/* eslint-env node */

import fs from "fs";
import path from "path";

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

const ACTORS_FILE = path.join(
  imdbConfig.outputPath,
  "actors.json"
);

const MOVIES_OUTPUT = path.join(
  imdbConfig.outputPath,
  "moviesWithActors.json"
);

const SERIES_OUTPUT = path.join(
  imdbConfig.outputPath,
  "seriesWithActors.json"
);


// ==================================================
// Helpers
// ==================================================

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `File not found: ${filePath}`
    );
  }

  return JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );
}


function saveJson(filePath, data) {
  fs.mkdirSync(
    path.dirname(filePath),
    {
      recursive: true,
    }
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  console.log(
    `✅ Saved: ${filePath}`
  );
}


// ==================================================
// Load Data
// ==================================================

function loadData() {
  console.log("Loading IMDb data...\n");

  const movies = loadJson(MOVIES_FILE);
  const series = loadJson(SERIES_FILE);
  const actors = loadJson(ACTORS_FILE);

  console.log(
    `Movies: ${movies.length}`
  );

  console.log(
    `Series: ${series.length}`
  );

  console.log(
    `Actors: ${actors.length}`
  );

  return {
    movies,
    series,
    actors,
  };
}


// ==================================================
// Build Actor Index
// ==================================================

function buildActorIndex(actors) {
  console.log(
    "\nBuilding actor index..."
  );

  const actorIndex = new Map();

  for (const actor of actors) {
    if (!actor?.id) {
      continue;
    }

    actorIndex.set(
      actor.id,
      actor
    );
  }

  console.log(
    `Indexed actors: ${actorIndex.size}`
  );

  return actorIndex;
}


// ==================================================
// Build Title → Actors Index
// ==================================================

function buildTitleActorIndex(actors) {
  console.log(
    "\nBuilding title → actors index..."
  );

  const titleActorIndex = new Map();

  let totalConnections = 0;

  for (const actor of actors) {
    if (
      !actor?.id ||
      !Array.isArray(actor.titles)
    ) {
      continue;
    }

    for (const title of actor.titles) {
      if (!title?.id) {
        continue;
      }

      if (!titleActorIndex.has(title.id)) {
        titleActorIndex.set(
          title.id,
          []
        );
      }

      const actorList =
        titleActorIndex.get(title.id);

      // Prevent duplicate actor IDs
      if (
        actorList.some(
          (item) => item.id === actor.id
        )
      ) {
        continue;
      }

      actorList.push({
        id: actor.id,
        name: actor.name,
        category: title.category,
      });

      totalConnections++;
    }
  }

  console.log(
    `Titles with actors: ${titleActorIndex.size}`
  );

  console.log(
    `Total actor connections: ${totalConnections}`
  );

  return titleActorIndex;
}


// ==================================================
// Attach Actors
// ==================================================

function attachActors(
  titles,
  titleActorIndex,
  actorIndex,
  expectedType
) {
  return titles.map((title) => {
    const actorConnections =
      titleActorIndex.get(title.id) || [];

    const actors = actorConnections
      .filter((connection) => {
        const actor =
          actorIndex.get(connection.id);

        return actor &&
          connection.category &&
          (
            connection.category === "actor" ||
            connection.category === "actress"
          );
      })
      .map((connection) => ({
        id: connection.id,
        name: connection.name,
        category: connection.category,
      }));


    return {
      ...title,

      actors,

      actorCount: actors.length,

      type: expectedType,
    };
  });
}


// ==================================================
// Validation
// ==================================================

function validateTitles(
  originalTitles,
  processedTitles,
  expectedType
) {
  console.log(
    `\nValidating ${expectedType}s...`
  );


  // ----------------------------------------------
  // Count
  // ----------------------------------------------

  if (
    originalTitles.length !==
    processedTitles.length
  ) {
    throw new Error(
      `${expectedType} count changed: ` +
      `${originalTitles.length} → ` +
      `${processedTitles.length}`
    );
  }


  // ----------------------------------------------
  // IDs
  // ----------------------------------------------

  const originalIds =
    new Set(
      originalTitles.map(
        (title) => title.id
      )
    );

  const processedIds =
    new Set(
      processedTitles.map(
        (title) => title.id
      )
    );


  if (
    originalIds.size !==
    processedIds.size
  ) {
    throw new Error(
      `${expectedType} IDs are not unique`
    );
  }


  for (const id of originalIds) {
    if (!processedIds.has(id)) {
      throw new Error(
        `Missing ${expectedType} ID: ${id}`
      );
    }
  }


  // ----------------------------------------------
  // Actor validation
  // ----------------------------------------------

  let totalActors = 0;

  let titlesWithActors = 0;

  let titlesWithoutActors = 0;


  for (const title of processedTitles) {
    if (
      title.type !== expectedType
    ) {
      throw new Error(
        `Invalid type for ${title.title}: ` +
        `${title.type}`
      );
    }


    if (
      !Array.isArray(title.actors)
    ) {
      throw new Error(
        `${title.title} has invalid actors`
      );
    }


    if (
      title.actorCount !==
      title.actors.length
    ) {
      throw new Error(
        `Invalid actorCount for ${title.title}`
      );
    }


    const actorIds = new Set();


    for (const actor of title.actors) {
      if (!actor?.id) {
        throw new Error(
          `${title.title} contains actor without ID`
        );
      }


      if (!actor?.name) {
        throw new Error(
          `${title.title} contains actor without name`
        );
      }


      if (actorIds.has(actor.id)) {
        throw new Error(
          `Duplicate actor ${actor.id} in ${title.title}`
        );
      }


      actorIds.add(actor.id);


      if (
        actor.category !== "actor" &&
        actor.category !== "actress"
      ) {
        throw new Error(
          `Invalid actor category in ${title.title}`
        );
      }
    }


    totalActors +=
      title.actors.length;


    if (title.actors.length > 0) {
      titlesWithActors++;
    } else {
      titlesWithoutActors++;
    }
  }


  console.log(
    `✅ ${expectedType}s validated`
  );

  console.log(
    `Titles with actors: ${titlesWithActors}`
  );

  console.log(
    `Titles without actors: ${titlesWithoutActors}`
  );

  console.log(
    `Actor connections: ${totalActors}`
  );
}


// ==================================================
// Cross Validation
// ==================================================

function validateConnections(
  movies,
  series,
  actors
) {
  console.log(
    "\nValidating actor ↔ title connections..."
  );


  const actorIndex =
    new Map(
      actors.map(
        (actor) => [actor.id, actor]
      )
    );


  const titles = [
    ...movies,
    ...series,
  ];


  let checkedConnections = 0;


  for (const title of titles) {
    for (const actor of title.actors) {
      const actorData =
        actorIndex.get(actor.id);


      if (!actorData) {
        throw new Error(
          `Actor ${actor.id} not found in actors.json`
        );
      }


      const actorTitle =
        actorData.titles.find(
          (item) =>
            item.id === title.id
        );


      if (!actorTitle) {
        throw new Error(
          `Broken reverse connection: ` +
          `${actor.name} → ${title.title}`
        );
      }


      if (
        actorTitle.category !==
        actor.category
      ) {
        throw new Error(
          `Category mismatch: ` +
          `${actor.name} → ${title.title}`
        );
      }


      checkedConnections++;
    }
  }


  console.log(
    `✅ Reverse connections checked: ` +
    `${checkedConnections}`
  );
}


// ==================================================
// Main
// ==================================================

function main() {
  console.log(
    "🎬 IMDb actor attachment started\n"
  );


  // ----------------------------------------------
  // Load
  // ----------------------------------------------

  const {
    movies,
    series,
    actors,
  } = loadData();


  // ----------------------------------------------
  // Indexes
  // ----------------------------------------------

  const actorIndex =
    buildActorIndex(actors);

  const titleActorIndex =
    buildTitleActorIndex(actors);


  // ----------------------------------------------
  // Attach actors
  // ----------------------------------------------

  console.log(
    "\nAttaching actors to movies..."
  );

  const moviesWithActors =
    attachActors(
      movies,
      titleActorIndex,
      actorIndex,
      "movie"
    );


  console.log(
    "Attaching actors to series..."
  );

  const seriesWithActors =
    attachActors(
      series,
      titleActorIndex,
      actorIndex,
      "series"
    );


  // ----------------------------------------------
  // Validation
  // ----------------------------------------------

  validateTitles(
    movies,
    moviesWithActors,
    "movie"
  );

  validateTitles(
    series,
    seriesWithActors,
    "series"
  );


  validateConnections(
    moviesWithActors,
    seriesWithActors,
    actors
  );


  // ----------------------------------------------
  // Save
  // ----------------------------------------------

  saveJson(
    MOVIES_OUTPUT,
    moviesWithActors
  );

  saveJson(
    SERIES_OUTPUT,
    seriesWithActors
  );


  // ----------------------------------------------
  // Summary
  // ----------------------------------------------

  const movieActorConnections =
    moviesWithActors.reduce(
      (sum, movie) =>
        sum + movie.actors.length,
      0
    );


  const seriesActorConnections =
    seriesWithActors.reduce(
      (sum, seriesItem) =>
        sum + seriesItem.actors.length,
      0
    );


  const moviesWithActorsCount =
    moviesWithActors.filter(
      (movie) =>
        movie.actors.length > 0
    ).length;


  const seriesWithActorsCount =
    seriesWithActors.filter(
      (seriesItem) =>
        seriesItem.actors.length > 0
    ).length;


  console.log(
    "\n=============================="
  );

  console.log(
    `Movies: ${moviesWithActors.length}`
  );

  console.log(
    `Movies with actors: ${moviesWithActorsCount}`
  );

  console.log(
    `Movie actor connections: ${movieActorConnections}`
  );

  console.log(
    `Series: ${seriesWithActors.length}`
  );

  console.log(
    `Series with actors: ${seriesWithActorsCount}`
  );

  console.log(
    `Series actor connections: ${seriesActorConnections}`
  );

  console.log(
    "=============================="
  );


  console.log(
    "\n🎬 Actor attachment completed"
  );
}


// ==================================================
// Run
// ==================================================

try {
  main();
} catch (error) {
  console.error(
    "\n❌ Actor attachment failed:"
  );

  console.error(
    error.message
  );

  process.exit(1);
}
