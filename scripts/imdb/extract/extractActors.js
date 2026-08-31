/* eslint-env node */

import fs from "fs";
import path from "path";
import zlib from "zlib";
import readline from "readline";

import { imdbConfig } from "../config/imdbConfig.js";


// ==================================================
// Paths
// ==================================================

const MOVIES_FILE = path.join(
  imdbConfig.outputPath,
  "movies.json"
);

const SERIES_FILE = path.join(
  imdbConfig.outputPath,
  "series.json"
);

const PRINCIPALS_FILE = path.join(
  imdbConfig.rawPath,
  "title.principals.tsv.gz"
);

const NAMES_FILE = path.join(
  imdbConfig.rawPath,
  "name.basics.tsv.gz"
);

const ACTORS_OUTPUT = path.join(
  imdbConfig.outputPath,
  "actors.json"
);


// ==================================================
// Helpers
// ==================================================

function isValidValue(value) {
  return value && value !== "\\N";
}


function parseArray(value) {
  if (!isValidValue(value)) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}


// ==================================================
// Load Titles
// ==================================================

function loadTitles() {
  console.log("Loading movies and series...");

  if (!fs.existsSync(MOVIES_FILE)) {
    throw new Error(
      `Movies file not found: ${MOVIES_FILE}`
    );
  }

  if (!fs.existsSync(SERIES_FILE)) {
    throw new Error(
      `Series file not found: ${SERIES_FILE}`
    );
  }

  const movies = JSON.parse(
    fs.readFileSync(MOVIES_FILE, "utf8")
  );

  const series = JSON.parse(
    fs.readFileSync(SERIES_FILE, "utf8")
  );


  const titles = new Map();

  for (const movie of movies) {
    if (movie?.id) {
      titles.set(movie.id, {
        id: movie.id,
        type: "movie",
        title: movie.title,
      });
    }
  }

  for (const seriesItem of series) {
    if (seriesItem?.id) {
      titles.set(seriesItem.id, {
        id: seriesItem.id,
        type: "series",
        title: seriesItem.title,
      });
    }
  }


  console.log(
    `Movies: ${movies.length}`
  );

  console.log(
    `Series: ${series.length}`
  );

  console.log(
    `Unique titles: ${titles.size}`
  );


  if (movies.length !== 1000) {
    throw new Error(
      `Expected 1000 movies, found ${movies.length}`
    );
  }

  if (series.length !== 1000) {
    throw new Error(
      `Expected 1000 series, found ${series.length}`
    );
  }

  if (titles.size !== 2000) {
    throw new Error(
      `Expected 2000 unique titles, found ${titles.size}`
    );
  }


  return titles;
}


// ==================================================
// Extract Principal Actors
// ==================================================

async function extractPrincipalActors(
  titles
) {
  console.log(
    "\nExtracting actors from principals..."
  );

  const actorsByTitle = new Map();

  let processed = 0;
  let matchedTitles = 0;
  let actorRows = 0;


  const stream = fs
    .createReadStream(PRINCIPALS_FILE)
    .pipe(zlib.createGunzip());

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });


  let isHeader = true;


  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }


    processed++;


    const parts = line.split("\t");

    const titleId = parts[0];
    const nameId = parts[2];
    const category = parts[3];


    // ----------------------------------------------
    // Only our 2000 titles
    // ----------------------------------------------

    if (!titles.has(titleId)) {
      continue;
    }


    // ----------------------------------------------
    // Only actors / actresses
    // ----------------------------------------------

    if (
      category !== "actor" &&
      category !== "actress"
    ) {
      continue;
    }


    if (!isValidValue(nameId)) {
      continue;
    }


    actorRows++;


    if (!actorsByTitle.has(titleId)) {
      actorsByTitle.set(
        titleId,
        new Map()
      );

      matchedTitles++;
    }


    const actors = actorsByTitle.get(titleId);


    // Prevent duplicate actor IDs
    if (!actors.has(nameId)) {
      actors.set(nameId, {
        id: nameId,
        category,
      });
    }


    // ----------------------------------------------
    // Progress
    // ----------------------------------------------

    if (processed % 1000000 === 0) {
      process.stdout.write(
        `\rProcessed principals: ${processed.toLocaleString()}`
      );
    }
  }


  console.log(
    `\nProcessed principals: ${processed.toLocaleString()}`
  );

  console.log(
    `Matched titles: ${matchedTitles}`
  );

  console.log(
    `Actor rows: ${actorRows.toLocaleString()}`
  );


  return actorsByTitle;
}


// ==================================================
// Load Actor Names
// ==================================================

async function loadActorNames(
  actorsByTitle
) {
  console.log(
    "\nLoading actor names..."
  );


  // ----------------------------------------------
  // Collect required name IDs
  // ----------------------------------------------

  const requiredNames = new Set();


  for (const actors of actorsByTitle.values()) {
    for (const actor of actors.values()) {
      requiredNames.add(actor.id);
    }
  }


  console.log(
    `Unique actors required: ${requiredNames.size.toLocaleString()}`
  );


  const actorNames = new Map();


  const stream = fs
    .createReadStream(NAMES_FILE)
    .pipe(zlib.createGunzip());

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });


  let isHeader = true;
  let processed = 0;
  let matched = 0;


  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }


    processed++;


    const parts = line.split("\t");

    const nameId = parts[0];
    const primaryName = parts[1];
    const birthYear = parts[2];
    const deathYear = parts[3];
    const primaryProfession = parseArray(parts[4]);
    const knownForTitles = parseArray(parts[5]);


    if (!requiredNames.has(nameId)) {
      continue;
    }


    if (!isValidValue(primaryName)) {
      continue;
    }


    actorNames.set(
      nameId,
      {
        id: nameId,
        name: primaryName,

        birthYear:
          isValidValue(birthYear)
            ? Number(birthYear)
            : null,

        deathYear:
          isValidValue(deathYear)
            ? Number(deathYear)
            : null,

        primaryProfession,

        knownForTitles,
      }
    );


    matched++;


    if (processed % 1000000 === 0) {
      process.stdout.write(
        `\rProcessed names: ${processed.toLocaleString()}`
      );
    }
  }


  console.log(
    `\nProcessed names: ${processed.toLocaleString()}`
  );

  console.log(
    `Matched actors: ${matched.toLocaleString()}`
  );


  return actorNames;
}


// ==================================================
// Build Final Actor Data
// ==================================================

function buildActors(
  titles,
  actorsByTitle,
  actorNames
) {
  console.log(
    "\nBuilding final actor data..."
  );


  const actors = new Map();


  for (const [
    titleId,
    titleActors,
  ] of actorsByTitle
  ) {
    const title = titles.get(titleId);


    if (!title) {
      continue;
    }


    for (const [
      actorId,
      principalData,
    ] of titleActors
    ) {
      const actorData = actorNames.get(actorId);


      if (!actorData) {
        continue;
      }


      if (!actors.has(actorId)) {
        actors.set(
          actorId,
          {
            id: actorData.id,
            name: actorData.name,

            birthYear:
              actorData.birthYear,

            deathYear:
              actorData.deathYear,

            primaryProfession:
              actorData.primaryProfession,

            titles: [],
          }
        );
      }


      const actor = actors.get(actorId);


      // Prevent duplicate title IDs
      const alreadyExists = actor.titles.some(
        (item) => item.id === title.id
      );


      if (!alreadyExists) {
        actor.titles.push({
          id: title.id,
          type: title.type,
          title: title.title,
          category: principalData.category,
        });
      }
    }
  }


  return Array.from(actors.values());
}


// ==================================================
// Sort Actors
// ==================================================

function sortActors(actors) {
  return actors.sort((a, b) => {
    if (b.titles.length !== a.titles.length) {
      return b.titles.length - a.titles.length;
    }

    return a.name.localeCompare(
      b.name
    );
  });
}


// ==================================================
// Validation
// ==================================================

function validate(
  titles,
  actors
) {
  console.log(
    "\nValidating actor data..."
  );


  const actorIds = new Set();


  for (const actor of actors) {
    if (actorIds.has(actor.id)) {
      throw new Error(
        `Duplicate actor ID: ${actor.id}`
      );
    }

    actorIds.add(actor.id);


    if (!actor.name) {
      throw new Error(
        `Actor ${actor.id} has no name`
      );
    }


    const titleIds = new Set();


    for (const title of actor.titles) {
      if (!titles.has(title.id)) {
        throw new Error(
          `Actor ${actor.id} references unknown title ${title.id}`
        );
      }


      if (titleIds.has(title.id)) {
        throw new Error(
          `Actor ${actor.id} has duplicate title ${title.id}`
        );
      }


      titleIds.add(title.id);


      if (
        title.category !== "actor" &&
        title.category !== "actress"
      ) {
        throw new Error(
          `Invalid category for ${actor.name}`
        );
      }
    }
  }


  console.log(
    `✅ Actors validated: ${actors.length.toLocaleString()}`
  );


  console.log(
    `✅ Unique actor IDs: ${actorIds.size.toLocaleString()}`
  );
}


// ==================================================
// Save JSON
// ==================================================

function saveJson(
  filePath,
  data
) {
  fs.mkdirSync(
    path.dirname(filePath),
    {
      recursive: true,
    }
  );


  fs.writeFileSync(
    filePath,
    JSON.stringify(
      data,
      null,
      2
    ),
    "utf8"
  );


  console.log(
    `\n✅ Saved: ${filePath}`
  );
}


// ==================================================
// Main
// ==================================================

async function main() {
  console.log(
    "🎭 IMDb actor extraction started\n"
  );


  // ----------------------------------------------
  // Check required files
  // ----------------------------------------------

  const requiredFiles = [
    MOVIES_FILE,
    SERIES_FILE,
    PRINCIPALS_FILE,
    NAMES_FILE,
  ];


  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      throw new Error(
        `Required file not found: ${file}`
      );
    }
  }


  // ----------------------------------------------
  // Load our 2000 titles
  // ----------------------------------------------

  const titles = loadTitles();


  // ----------------------------------------------
  // Extract actor IDs
  // ----------------------------------------------

  const actorsByTitle =
    await extractPrincipalActors(
      titles
    );


  // ----------------------------------------------
  // Load actor information
  // ----------------------------------------------

  const actorNames =
    await loadActorNames(
      actorsByTitle
    );


  // ----------------------------------------------
  // Build final data
  // ----------------------------------------------

  let actors = buildActors(
    titles,
    actorsByTitle,
    actorNames
  );


  // ----------------------------------------------
  // Sort
  // ----------------------------------------------

  actors = sortActors(actors);


  // ----------------------------------------------
  // Validate
  // ----------------------------------------------

  validate(
    titles,
    actors
  );


  // ----------------------------------------------
  // Save
  // ----------------------------------------------

  saveJson(
    ACTORS_OUTPUT,
    actors
  );


  // ----------------------------------------------
  // Summary
  // ----------------------------------------------

  const actorsWithMovies = actors.filter(
    (actor) =>
      actor.titles.some(
        (title) => title.type === "movie"
      )
  ).length;


  const actorsWithSeries = actors.filter(
    (actor) =>
      actor.titles.some(
        (title) => title.type === "series"
      )
  ).length;


  console.log(
    "\n=============================="
  );

  console.log(
    `Movies: 1000`
  );

  console.log(
    `Series: 1000`
  );

  console.log(
    `Actors: ${actors.length.toLocaleString()}`
  );

  console.log(
    `Actors in movies: ${actorsWithMovies.toLocaleString()}`
  );

  console.log(
    `Actors in series: ${actorsWithSeries.toLocaleString()}`
  );

  console.log(
    "=============================="
  );


  console.log(
    "\n🎭 Actor extraction completed"
  );
}


// ==================================================
// Run
// ==================================================

main().catch((error) => {
  console.error(
    "\n❌ Actor extraction failed:"
  );

  console.error(error);

  process.exit(1);
});
