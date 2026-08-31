/* eslint-env node */

import fs from "fs";
import path from "path";

import { imdbConfig } from "../config/imdbConfig.js";


// ==================================================
// Paths
// ==================================================

const OUTPUT_PATH = imdbConfig.outputPath;

const MOVIES_FILE = path.join(
  OUTPUT_PATH,
  "movies.json"
);

const SERIES_FILE = path.join(
  OUTPUT_PATH,
  "series.json"
);

const ACTORS_FILE = path.join(
  OUTPUT_PATH,
  "actors.json"
);

const MOVIES_WITH_ACTORS_FILE = path.join(
  OUTPUT_PATH,
  "moviesWithActors.json"
);

const SERIES_WITH_ACTORS_FILE = path.join(
  OUTPUT_PATH,
  "seriesWithActors.json"
);


// ==================================================
// Helpers
// ==================================================

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  return JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );
}


function isValidId(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}


function addError(errors, message) {
  errors.push(message);
}


function addWarning(warnings, message) {
  warnings.push(message);
}


// ==================================================
// ROUND 1
// Basic Structure Validation
// ==================================================

function validateBasicTitles(
  titles,
  expectedCount,
  expectedType,
  label,
  errors,
  warnings
) {
  console.log(`\nChecking ${label}...`);

  if (titles.length !== expectedCount) {
    addError(
      errors,
      `${label}: expected ${expectedCount}, found ${titles.length}`
    );
  }


  const ids = new Set();


  for (const title of titles) {
    if (!isValidId(title?.id)) {
      addError(
        errors,
        `${label}: title without valid ID`
      );

      continue;
    }


    if (ids.has(title.id)) {
      addError(
        errors,
        `${label}: duplicate ID ${title.id}`
      );
    }

    ids.add(title.id);


    if (
      typeof title.title !== "string" ||
      title.title.trim() === ""
    ) {
      addError(
        errors,
        `${label}: ${title.id} has invalid title`
      );
    }


    if (
      typeof title.rating !== "number"
    ) {
      addError(
        errors,
        `${label}: ${title.id} has invalid rating`
      );
    }


    if (
      typeof title.votes !== "number"
    ) {
      addError(
        errors,
        `${label}: ${title.id} has invalid votes`
      );
    }


    if (!Array.isArray(title.genres)) {
      addError(
        errors,
        `${label}: ${title.id} has invalid genres`
      );
    }


    if (
      expectedType === "movie" &&
      title.titleType !== "movie"
    ) {
      addError(
        errors,
        `${label}: ${title.id} has titleType=${title.titleType}`
      );
    }


    if (
      expectedType === "series" &&
      title.titleType !== "tvSeries"
    ) {
      addError(
        errors,
        `${label}: ${title.id} has titleType=${title.titleType}`
      );
    }


    if (
      typeof title.rating === "number" &&
      (
        title.rating < 0 ||
        title.rating > 10
      )
    ) {
      addError(
        errors,
        `${label}: ${title.id} has invalid rating ${title.rating}`
      );
    }


    if (
      typeof title.votes === "number" &&
      title.votes < 0
    ) {
      addError(
        errors,
        `${label}: ${title.id} has negative votes`
      );
    }
  }


  console.log(
    `IDs checked: ${ids.size}`
  );
}


// ==================================================
// ROUND 1
// Actor Structure
// ==================================================

function validateActors(
  actors,
  errors,
  warnings
) {
  console.log("\nChecking actors...");

  const actorIds = new Set();


  for (const actor of actors) {
    if (!isValidId(actor?.id)) {
      addError(
        errors,
        "Actor without valid ID"
      );

      continue;
    }


    if (actorIds.has(actor.id)) {
      addError(
        errors,
        `Duplicate actor ID: ${actor.id}`
      );
    }

    actorIds.add(actor.id);


    if (
      typeof actor.name !== "string" ||
      actor.name.trim() === ""
    ) {
      addError(
        errors,
        `Actor ${actor.id} has invalid name`
      );
    }


    if (
      !Array.isArray(
        actor.primaryProfession
      )
    ) {
      addError(
        errors,
        `Actor ${actor.id} has invalid primaryProfession`
      );
    }


    if (!Array.isArray(actor.titles)) {
      addError(
        errors,
        `Actor ${actor.id} has invalid titles`
      );

      continue;
    }


    const titleIds = new Set();


    for (const title of actor.titles) {
      if (!isValidId(title?.id)) {
        addError(
          errors,
          `Actor ${actor.id} has title without valid ID`
        );

        continue;
      }


      if (titleIds.has(title.id)) {
        addError(
          errors,
          `Actor ${actor.id} has duplicate title ${title.id}`
        );
      }

      titleIds.add(title.id);


      if (
        title.type !== "movie" &&
        title.type !== "series"
      ) {
        addError(
          errors,
          `Actor ${actor.id} has invalid title type`
        );
      }


      if (
        title.category !== "actor" &&
        title.category !== "actress"
      ) {
        addError(
          errors,
          `Actor ${actor.id} has invalid category`
        );
      }
    }
  }


  console.log(
    `Unique actor IDs: ${actorIds.size}`
  );
}


// ==================================================
// Actor Index
// ==================================================

function buildActorIndex(actors) {
  const index = new Map();

  for (const actor of actors) {
    index.set(
      actor.id,
      actor
    );
  }

  return index;
}


// ==================================================
// ROUND 1
// Title → Actor
// ==================================================

function validateTitleActors(
  titles,
  expectedType,
  actorIndex,
  errors,
  warnings
) {
  console.log(
    `\nChecking ${expectedType} → actor connections...`
  );


  let titlesWithActors = 0;
  let titlesWithoutActors = 0;
  let totalConnections = 0;


  for (const title of titles) {
    if (!Array.isArray(title.actors)) {
      addError(
        errors,
        `${title.title}: actors is not an array`
      );

      continue;
    }


    if (title.actors.length > 0) {
      titlesWithActors++;
    } else {
      titlesWithoutActors++;

      addWarning(
        warnings,
        `${expectedType} without actors: ${title.title} (${title.id})`
      );
    }


    const actorIds = new Set();


    for (const actor of title.actors) {
      totalConnections++;


      if (!isValidId(actor?.id)) {
        addError(
          errors,
          `${title.title}: actor without valid ID`
        );

        continue;
      }


      if (actorIds.has(actor.id)) {
        addError(
          errors,
          `${title.title}: duplicate actor ${actor.id}`
        );
      }

      actorIds.add(actor.id);


      const actorData =
        actorIndex.get(actor.id);


      if (!actorData) {
        addError(
          errors,
          `${title.title}: actor ${actor.id} not found in actors.json`
        );

        continue;
      }


      if (
        actor.name !== actorData.name
      ) {
        addError(
          errors,
          `${title.title}: actor name mismatch for ${actor.id}`
        );
      }


      if (
        actor.category !== "actor" &&
        actor.category !== "actress"
      ) {
        addError(
          errors,
          `${title.title}: invalid actor category`
        );
      }
    }


    if (
      title.actorCount !==
      title.actors.length
    ) {
      addError(
        errors,
        `${title.title}: actorCount mismatch`
      );
    }
  }


  console.log(
    `Titles with actors: ${titlesWithActors}`
  );

  console.log(
    `Titles without actors: ${titlesWithoutActors}`
  );

  console.log(
    `Actor connections: ${totalConnections}`
  );
}


// ==================================================
// ROUND 1
// Reverse Connections
// ==================================================

function validateReverseConnections(
  titles,
  actorIndex,
  errors
) {
  console.log(
    "\nChecking actor → title reverse connections..."
  );


  let checked = 0;


  for (const title of titles) {
    if (!Array.isArray(title.actors)) {
      continue;
    }


    for (const actor of title.actors) {
      const actorData =
        actorIndex.get(actor.id);


      if (!actorData) {
        continue;
      }


      const reverseTitle =
        actorData.titles.find(
          (item) =>
            item.id === title.id
        );


      if (!reverseTitle) {
        addError(
          errors,
          `Missing reverse connection: ${actor.name} → ${title.title}`
        );

        continue;
      }


      if (
        reverseTitle.type !==
        title.type
      ) {
        addError(
          errors,
          `Reverse type mismatch: ${actor.name} → ${title.title}`
        );
      }


      if (
        reverseTitle.category !==
        actor.category
      ) {
        addError(
          errors,
          `Reverse category mismatch: ${actor.name} → ${title.title}`
        );
      }


      checked++;
    }
  }


  console.log(
    `Reverse connections checked: ${checked}`
  );
}


// ==================================================
// ROUND 2
// Numeric & Semantic Validation
// ==================================================

function validateNumericData(
  titles,
  label,
  errors,
  warnings
) {
  console.log(
    `\nChecking ${label} numeric data...`
  );


  let suspiciousRatings = 0;
  let suspiciousVotes = 0;
  let suspiciousYears = 0;
  let suspiciousRuntime = 0;


  const currentYear =
    new Date().getFullYear();


  for (const title of titles) {
    // --------------------------------------------
    // Rating
    // --------------------------------------------

    if (
      !Number.isFinite(title.rating) ||
      title.rating < 0 ||
      title.rating > 10
    ) {
      addError(
        errors,
        `${label}: invalid rating ${title.id}`
      );
    }


    if (
      Number.isFinite(title.rating) &&
      (
        title.rating === 0 ||
        title.rating === 10
      )
    ) {
      suspiciousRatings++;

      addWarning(
        warnings,
        `${label}: suspicious rating ${title.rating} → ${title.title}`
      );
    }


    // --------------------------------------------
    // Votes
    // --------------------------------------------

    if (
      !Number.isInteger(title.votes) ||
      title.votes < 0
    ) {
      addError(
        errors,
        `${label}: invalid votes ${title.id}`
      );
    }


    if (
      title.votes === 0
    ) {
      suspiciousVotes++;

      addWarning(
        warnings,
        `${label}: zero votes → ${title.title}`
      );
    }


    // --------------------------------------------
    // Start Year
    // --------------------------------------------

    if (
      title.startYear !== null &&
      title.startYear !== undefined
    ) {
      if (
        !Number.isInteger(
          title.startYear
        ) ||
        title.startYear < 1870 ||
        title.startYear > currentYear + 2
      ) {
        suspiciousYears++;

        addWarning(
          warnings,
          `${label}: suspicious startYear ${title.startYear} → ${title.title}`
        );
      }
    }


    // --------------------------------------------
    // End Year
    // --------------------------------------------

    if (
      title.endYear !== null &&
      title.endYear !== undefined
    ) {
      if (
        !Number.isInteger(
          title.endYear
        ) ||
        title.endYear < 1870 ||
        title.endYear > currentYear + 2
      ) {
        addWarning(
          warnings,
          `${label}: suspicious endYear ${title.endYear} → ${title.title}`
        );
      }


      if (
        title.startYear &&
        title.endYear &&
        title.endYear <
        title.startYear
      ) {
        addError(
          errors,
          `${label}: endYear before startYear → ${title.title}`
        );
      }
    }


    // --------------------------------------------
    // Runtime
    // --------------------------------------------

    if (
      title.runtimeMinutes !== null &&
      title.runtimeMinutes !== undefined
    ) {
      if (
        !Number.isInteger(
          title.runtimeMinutes
        ) ||
        title.runtimeMinutes < 1
      ) {
        suspiciousRuntime++;

        addWarning(
          warnings,
          `${label}: suspicious runtime ${title.runtimeMinutes} → ${title.title}`
        );
      }


      if (
        title.runtimeMinutes > 1000
      ) {
        suspiciousRuntime++;

        addWarning(
          warnings,
          `${label}: extremely high runtime ${title.runtimeMinutes} → ${title.title}`
        );
      }
    }
  }


  console.log(
    `Suspicious ratings: ${suspiciousRatings}`
  );

  console.log(
    `Suspicious votes: ${suspiciousVotes}`
  );

  console.log(
    `Suspicious years: ${suspiciousYears}`
  );

  console.log(
    `Suspicious runtimes: ${suspiciousRuntime}`
  );
}


// ==================================================
// ROUND 2
// Genre Validation
// ==================================================

function validateGenres(
  titles,
  label,
  errors,
  warnings
) {
  console.log(
    `\nChecking ${label} genres...`
  );


  const validGenres =
    new Set([
      "Action",
      "Adventure",
      "Animation",
      "Biography",
      "Comedy",
      "Crime",
      "Documentary",
      "Drama",
      "Family",
      "Fantasy",
      "History",
      "Horror",
      "Music",
      "Musical",
      "Mystery",
      "Romance",
      "Sci-Fi",
      "Sport",
      "Thriller",
      "War",
      "Western",
      "Film-Noir",
    ]);


  let emptyGenres = 0;
  let invalidGenres = 0;


  for (const title of titles) {
    if (!Array.isArray(title.genres)) {
      addError(
        errors,
        `${label}: genres is not array → ${title.title}`
      );

      continue;
    }


    if (title.genres.length === 0) {
      emptyGenres++;

      addWarning(
        warnings,
        `${label}: no genres → ${title.title}`
      );
    }


    const genres =
      new Set();


    for (const genre of title.genres) {
      if (
        typeof genre !== "string" ||
        genre.trim() === ""
      ) {
        addError(
          errors,
          `${label}: invalid genre → ${title.title}`
        );

        continue;
      }


      if (genres.has(genre)) {
        addError(
          errors,
          `${label}: duplicate genre ${genre} → ${title.title}`
        );
      }


      genres.add(genre);


      if (!validGenres.has(genre)) {
        invalidGenres++;

        addWarning(
          warnings,
          `${label}: unknown genre ${genre} → ${title.title}`
        );
      }
    }
  }


  console.log(
    `Titles without genres: ${emptyGenres}`
  );

  console.log(
    `Unknown genres: ${invalidGenres}`
  );
}


// ==================================================
// ROUND 2
// Title Field Validation
// ==================================================

function validateTitleFields(
  titles,
  label,
  errors,
  warnings
) {
  console.log(
    `\nChecking ${label} fields...`
  );


  let missingOriginalTitle = 0;
  let missingRuntime = 0;
  let missingYear = 0;


  for (const title of titles) {
    if (
      typeof title.originalTitle !==
        "string" ||
      title.originalTitle.trim() === ""
    ) {
      missingOriginalTitle++;

      addWarning(
        warnings,
        `${label}: missing originalTitle → ${title.title}`
      );
    }


    if (
      title.runtimeMinutes === null ||
      title.runtimeMinutes === undefined
    ) {
      missingRuntime++;

      addWarning(
        warnings,
        `${label}: missing runtime → ${title.title}`
      );
    }


    if (
      title.startYear === null ||
      title.startYear === undefined
    ) {
      missingYear++;

      addWarning(
        warnings,
        `${label}: missing startYear → ${title.title}`
      );
    }
  }


  console.log(
    `Missing originalTitle: ${missingOriginalTitle}`
  );

  console.log(
    `Missing runtime: ${missingRuntime}`
  );

  console.log(
    `Missing startYear: ${missingYear}`
  );
}


// ==================================================
// ROUND 2
// Processed Data Consistency
// ==================================================

function validateProcessedConsistency(
  original,
  processed,
  label,
  errors
) {
  console.log(
    `\nChecking ${label} processed consistency...`
  );


  const originalMap =
    new Map(
      original.map(
        (item) => [item.id, item]
      )
    );


  for (const item of processed) {
    const originalItem =
      originalMap.get(item.id);


    if (!originalItem) {
      addError(
        errors,
        `${label}: processed item not found in original → ${item.id}`
      );

      continue;
    }


    const fields = [
      "titleType",
      "title",
      "originalTitle",
      "isAdult",
      "startYear",
      "endYear",
      "runtimeMinutes",
      "rating",
      "votes",
    ];


    for (const field of fields) {
      if (
        item[field] !==
        originalItem[field]
      ) {
        addError(
          errors,
          `${label}: field mismatch ${field} → ${item.id}`
        );
      }
    }


    const originalGenres =
      JSON.stringify(
        originalItem.genres
      );

    const processedGenres =
      JSON.stringify(
        item.genres
      );


    if (
      originalGenres !==
      processedGenres
    ) {
      addError(
        errors,
        `${label}: genres mismatch → ${item.id}`
      );
    }
  }


  console.log(
    "Processed fields checked."
  );
}


// ==================================================
// ROUND 2
// Actor Data Quality
// ==================================================

function validateActorQuality(
  actors,
  errors,
  warnings
) {
  console.log(
    "\nChecking actor data quality..."
  );


  let missingBirthYear = 0;
  let invalidBirthDeath = 0;
  let emptyProfession = 0;
  let emptyTitles = 0;


  for (const actor of actors) {
    if (
      actor.birthYear !== null &&
      actor.birthYear !== undefined
    ) {
      if (
        !Number.isInteger(
          actor.birthYear
        ) ||
        actor.birthYear < 1800 ||
        actor.birthYear >
          new Date().getFullYear()
      ) {
        addWarning(
          warnings,
          `Suspicious birthYear → ${actor.name}`
        );
      }
    } else {
      missingBirthYear++;
    }


    if (
      actor.deathYear !== null &&
      actor.deathYear !== undefined
    ) {
      if (
        !Number.isInteger(
          actor.deathYear
        ) ||
        actor.deathYear < 1800 ||
        actor.deathYear >
          new Date().getFullYear() + 1
      ) {
        addWarning(
          warnings,
          `Suspicious deathYear → ${actor.name}`
        );
      }
    }


    if (
      actor.birthYear &&
      actor.deathYear &&
      actor.deathYear <
      actor.birthYear
    ) {
      invalidBirthDeath++;

      addError(
        errors,
        `Death year before birth year → ${actor.name}`
      );
    }


    if (
      !Array.isArray(
        actor.primaryProfession
      ) ||
      actor.primaryProfession.length === 0
    ) {
      emptyProfession++;

      addWarning(
        warnings,
        `No profession → ${actor.name}`
      );
    }


    if (
      !Array.isArray(actor.titles) ||
      actor.titles.length === 0
    ) {
      emptyTitles++;

      addWarning(
        warnings,
        `Actor without titles → ${actor.name}`
      );
    }
  }


  console.log(
    `Actors without birthYear: ${missingBirthYear}`
  );

  console.log(
    `Invalid birth/death years: ${invalidBirthDeath}`
  );

  console.log(
    `Actors without profession: ${emptyProfession}`
  );

  console.log(
    `Actors without titles: ${emptyTitles}`
  );
}


// ==================================================
// Statistics
// ==================================================

function printStatistics(
  movies,
  series,
  actors
) {
  console.log(
    "\n=============================="
  );

  console.log(
    "DATA STATISTICS"
  );

  console.log(
    "=============================="
  );


  const movieConnections =
    movies.reduce(
      (sum, movie) =>
        sum +
        (
          Array.isArray(movie.actors)
            ? movie.actors.length
            : 0
        ),
      0
    );


  const seriesConnections =
    series.reduce(
      (sum, item) =>
        sum +
        (
          Array.isArray(item.actors)
            ? item.actors.length
            : 0
        ),
      0
    );


  const moviesWithActors =
    movies.filter(
      (movie) =>
        Array.isArray(movie.actors) &&
        movie.actors.length > 0
    ).length;


  const seriesWithActors =
    series.filter(
      (item) =>
        Array.isArray(item.actors) &&
        item.actors.length > 0
    ).length;


  console.log(
    `Movies: ${movies.length}`
  );

  console.log(
    `Movies with actors: ${moviesWithActors}`
  );

  console.log(
    `Movie actor connections: ${movieConnections}`
  );

  console.log(
    `Series: ${series.length}`
  );

  console.log(
    `Series with actors: ${seriesWithActors}`
  );

  console.log(
    `Series actor connections: ${seriesConnections}`
  );

  console.log(
    `Actors: ${actors.length}`
  );


  console.log(
    "=============================="
  );
}


// ==================================================
// Print Result
// ==================================================

function printResult(
  errors,
  warnings
) {
  console.log(
    "\n=============================="
  );

  console.log(
    "VALIDATION RESULT"
  );

  console.log(
    "=============================="
  );


  console.log(
    `Errors: ${errors.length}`
  );

  console.log(
    `Warnings: ${warnings.length}`
  );


  if (errors.length > 0) {
    console.log(
      "\n❌ ERRORS:"
    );


    const maxErrors = 100;


    errors
      .slice(0, maxErrors)
      .forEach(
        (error, index) => {
          console.log(
            `${index + 1}. ${error}`
          );
        }
      );


    if (
      errors.length > maxErrors
    ) {
      console.log(
        `... and ${
          errors.length - maxErrors
        } more errors`
      );
    }


    return false;
  }


  if (warnings.length > 0) {
    console.log(
      "\n⚠️ WARNINGS:"
    );


    const maxWarnings = 100;


    warnings
      .slice(0, maxWarnings)
      .forEach(
        (warning, index) => {
          console.log(
            `${index + 1}. ${warning}`
          );
        }
      );


    if (
      warnings.length > maxWarnings
    ) {
      console.log(
        `... and ${
          warnings.length - maxWarnings
        } more warnings`
      );
    }
  }


  console.log(
    "\n✅ Data validation passed."
  );


  return true;
}


// ==================================================
// Main
// ==================================================

function main() {
  console.log(
    "🔍 IMDb data quality validation started"
  );


  console.log(
    "\n========== ROUND 1 =========="
  );


  const movies =
    loadJson(MOVIES_FILE);

  const series =
    loadJson(SERIES_FILE);

  const actors =
    loadJson(ACTORS_FILE);

  const moviesWithActors =
    loadJson(
      MOVIES_WITH_ACTORS_FILE
    );

  const seriesWithActors =
    loadJson(
      SERIES_WITH_ACTORS_FILE
    );


  const errors = [];
  const warnings = [];


  // ==================================================
  // ROUND 1
  // ==================================================

  validateBasicTitles(
    movies,
    1000,
    "movie",
    "Movies",
    errors,
    warnings
  );


  validateBasicTitles(
    series,
    1000,
    "series",
    "Series",
    errors,
    warnings
  );


  validateActors(
    actors,
    errors,
    warnings
  );


  const actorIndex =
    buildActorIndex(actors);


  validateProcessedConsistency(
    movies,
    moviesWithActors,
    "Movies",
    errors
  );


  validateProcessedConsistency(
    series,
    seriesWithActors,
    "Series",
    errors
  );


  validateTitleActors(
    moviesWithActors,
    "movie",
    actorIndex,
    errors,
    warnings
  );


  validateTitleActors(
    seriesWithActors,
    "series",
    actorIndex,
    errors,
    warnings
  );


  validateReverseConnections(
    [
      ...moviesWithActors,
      ...seriesWithActors,
    ],
    actorIndex,
    errors
  );


  // ==================================================
  // ROUND 2
  // ==================================================

  console.log(
    "\n========== ROUND 2 =========="
  );


  validateNumericData(
    movies,
    "Movies",
    errors,
    warnings
  );


  validateNumericData(
    series,
    "Series",
    errors,
    warnings
  );


  validateGenres(
    movies,
    "Movies",
    errors,
    warnings
  );


  validateGenres(
    series,
    "Series",
    errors,
    warnings
  );


  validateTitleFields(
    movies,
    "Movies",
    errors,
    warnings
  );


  validateTitleFields(
    series,
    "Series",
    errors,
    warnings
  );


  validateActorQuality(
    actors,
    errors,
    warnings
  );


  // ==================================================
  // Statistics
  // ==================================================

  printStatistics(
    moviesWithActors,
    seriesWithActors,
    actors
  );


  // ==================================================
  // Result
  // ==================================================

  const passed =
    printResult(
      errors,
      warnings
    );


  if (!passed) {
    process.exit(1);
  }
}


// ==================================================
// Run
// ==================================================

try {
  main();
} catch (error) {
  console.error(
    "\n❌ Validation failed:"
  );

  console.error(
    error
  );

  process.exit(1);
}
