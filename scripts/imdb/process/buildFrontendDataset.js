/* eslint-env node */

import fs from "fs";
import path from "path";

import { imdbConfig } from "../config/imdbConfig.js";


// ==================================================
// Paths
// ==================================================

const OUTPUT_PATH = imdbConfig.outputPath;

const ENRICHED_PATH = path.resolve(
  OUTPUT_PATH,
  "../enriched"
);

const FRONTEND_PATH = path.resolve(
  OUTPUT_PATH,
  "../frontend"
);


// Input files
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

const ENRICHED_MOVIES_FILE = path.join(
  ENRICHED_PATH,
  "movies.json"
);

const ENRICHED_SERIES_FILE = path.join(
  ENRICHED_PATH,
  "series.json"
);


// Output files
const FRONTEND_MOVIES_FILE = path.join(
  FRONTEND_PATH,
  "movies.json"
);

const FRONTEND_SERIES_FILE = path.join(
  FRONTEND_PATH,
  "series.json"
);

const FRONTEND_ACTORS_FILE = path.join(
  FRONTEND_PATH,
  "actors.json"
);

const FRONTEND_INDEX_FILE = path.join(
  FRONTEND_PATH,
  "index.json"
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


function createMap(items) {
  return new Map(
    items.map(
      (item) => [item.id, item]
    )
  );
}


// ==================================================
// Load Data
// ==================================================

function loadData() {
  console.log(
    "Loading IMDb datasets..."
  );

  const movies = loadJson(
    MOVIES_FILE
  );

  const series = loadJson(
    SERIES_FILE
  );

  const actors = loadJson(
    ACTORS_FILE
  );

  const moviesWithActors =
    loadJson(
      MOVIES_WITH_ACTORS_FILE
    );

  const seriesWithActors =
    loadJson(
      SERIES_WITH_ACTORS_FILE
    );

  const enrichedMovies =
    loadJson(
      ENRICHED_MOVIES_FILE
    );

  const enrichedSeries =
    loadJson(
      ENRICHED_SERIES_FILE
    );


  console.log(
    `Movies: ${movies.length}`
  );

  console.log(
    `Series: ${series.length}`
  );

  console.log(
    `Actors: ${actors.length}`
  );

  console.log(
    `Movies with actors: ${moviesWithActors.length}`
  );

  console.log(
    `Series with actors: ${seriesWithActors.length}`
  );

  console.log(
    `Enriched movies: ${enrichedMovies.length}`
  );

  console.log(
    `Enriched series: ${enrichedSeries.length}`
  );


  return {
    movies,
    series,
    actors,
    moviesWithActors,
    seriesWithActors,
    enrichedMovies,
    enrichedSeries,
  };
}


// ==================================================
// Build Movie Dataset
// ==================================================

function buildMovies(
  movies,
  moviesWithActors,
  enrichedMovies
) {
  console.log(
    "\nBuilding frontend movie dataset..."
  );


  const actorMap =
    createMap(
      moviesWithActors
    );


  const enrichedMap =
    createMap(
      enrichedMovies
    );


  return movies.map(
    (movie) => {
      const actorData =
        actorMap.get(movie.id);

      const enrichedData =
        enrichedMap.get(movie.id);


      return {
        id: movie.id,

        type: "movie",

        title: movie.title,

        originalTitle:
          movie.originalTitle,

        poster:
          enrichedData?.poster ?? null,

        plot:
          enrichedData?.plot ?? null,

        rating:
          movie.rating,

        votes:
          movie.votes,

        startYear:
          movie.startYear,

        endYear:
          movie.endYear,

        runtimeMinutes:
          movie.runtimeMinutes,

        genres:
          movie.genres,

        actors:
          actorData?.actors ?? [],

        actorCount:
          actorData?.actorCount ??
          0,
      };
    }
  );
}


// ==================================================
// Build Series Dataset
// ==================================================

function buildSeries(
  series,
  seriesWithActors,
  enrichedSeries
) {
  console.log(
    "\nBuilding frontend series dataset..."
  );


  const actorMap =
    createMap(
      seriesWithActors
    );


  const enrichedMap =
    createMap(
      enrichedSeries
    );


  return series.map(
    (seriesItem) => {
      const actorData =
        actorMap.get(
          seriesItem.id
        );

      const enrichedData =
        enrichedMap.get(
          seriesItem.id
        );


      return {
        id: seriesItem.id,

        type: "series",

        title:
          seriesItem.title,

        originalTitle:
          seriesItem.originalTitle,

        poster:
          enrichedData?.poster ?? null,

        plot:
          enrichedData?.plot ?? null,

        rating:
          seriesItem.rating,

        votes:
          seriesItem.votes,

        startYear:
          seriesItem.startYear,

        endYear:
          seriesItem.endYear,

        runtimeMinutes:
          seriesItem.runtimeMinutes,

        genres:
          seriesItem.genres,

        actors:
          actorData?.actors ?? [],

        actorCount:
          actorData?.actorCount ??
          0,
      };
    }
  );
}


// ==================================================
// Build Actor Dataset
// ==================================================

function buildActors(actors) {
  console.log(
    "\nBuilding frontend actor dataset..."
  );


  return actors.map(
    (actor) => ({
      id: actor.id,

      name: actor.name,

      birthYear:
        actor.birthYear,

      deathYear:
        actor.deathYear,

      primaryProfession:
        actor.primaryProfession,

      titles:
        actor.titles.map(
          (title) => ({
            id: title.id,

            type: title.type,

            title: title.title,

            category:
              title.category,
          })
        ),
    })
  );
}


// ==================================================
// Build Index
// ==================================================

function buildIndex(
  movies,
  series,
  actors
) {
  return {
    movies: movies.length,

    series: series.length,

    actors: actors.length,

    totalTitles:
      movies.length +
      series.length,

    generatedAt:
      new Date().toISOString(),
  };
}


// ==================================================
// Validation
// ==================================================

function validateDataset(
  movies,
  series,
  actors
) {
  console.log(
    "\nValidating frontend dataset..."
  );


  const movieIds =
    new Set();

  const seriesIds =
    new Set();

  const actorIds =
    new Set();


  // --------------------------------------------------
  // Movies
  // --------------------------------------------------

  for (const movie of movies) {
    if (!movie.id) {
      throw new Error(
        "Movie without ID"
      );
    }

    if (movieIds.has(movie.id)) {
      throw new Error(
        `Duplicate movie ID: ${movie.id}`
      );
    }

    movieIds.add(movie.id);


    if (movie.type !== "movie") {
      throw new Error(
        `Invalid movie type: ${movie.id}`
      );
    }


    if (!Array.isArray(movie.genres)) {
      throw new Error(
        `Invalid genres: ${movie.id}`
      );
    }


    if (!Array.isArray(movie.actors)) {
      throw new Error(
        `Invalid actors: ${movie.id}`
      );
    }


    if (
      movie.actorCount !==
      movie.actors.length
    ) {
      throw new Error(
        `Invalid actorCount: ${movie.id}`
      );
    }
  }


  // --------------------------------------------------
  // Series
  // --------------------------------------------------

  for (const seriesItem of series) {
    if (!seriesItem.id) {
      throw new Error(
        "Series without ID"
      );
    }

    if (
      seriesIds.has(
        seriesItem.id
      )
    ) {
      throw new Error(
        `Duplicate series ID: ${seriesItem.id}`
      );
    }

    seriesIds.add(
      seriesItem.id
    );


    if (
      seriesItem.type !== "series"
    ) {
      throw new Error(
        `Invalid series type: ${seriesItem.id}`
      );
    }


    if (
      !Array.isArray(
        seriesItem.genres
      )
    ) {
      throw new Error(
        `Invalid genres: ${seriesItem.id}`
      );
    }


    if (
      !Array.isArray(
        seriesItem.actors
      )
    ) {
      throw new Error(
        `Invalid actors: ${seriesItem.id}`
      );
    }


    if (
      seriesItem.actorCount !==
      seriesItem.actors.length
    ) {
      throw new Error(
        `Invalid actorCount: ${seriesItem.id}`
      );
    }
  }


  // --------------------------------------------------
  // Actors
  // --------------------------------------------------

  for (const actor of actors) {
    if (!actor.id) {
      throw new Error(
        "Actor without ID"
      );
    }

    if (
      actorIds.has(actor.id)
    ) {
      throw new Error(
        `Duplicate actor ID: ${actor.id}`
      );
    }

    actorIds.add(
      actor.id
    );


    if (
      typeof actor.name !==
      "string"
    ) {
      throw new Error(
        `Invalid actor name: ${actor.id}`
      );
    }


    if (
      !Array.isArray(
        actor.titles
      )
    ) {
      throw new Error(
        `Invalid actor titles: ${actor.id}`
      );
    }
  }


  console.log(
    `✅ Movies validated: ${movies.length}`
  );

  console.log(
    `✅ Series validated: ${series.length}`
  );

  console.log(
    `✅ Actors validated: ${actors.length}`
  );
}


// ==================================================
// Main
// ==================================================

function main() {
  console.log(
    "🎬 Frontend dataset build started\n"
  );


  // --------------------------------------------------
  // Load
  // --------------------------------------------------

  const {
    movies,
    series,
    actors,
    moviesWithActors,
    seriesWithActors,
    enrichedMovies,
    enrichedSeries,
  } = loadData();


  // --------------------------------------------------
  // Validate source counts
  // --------------------------------------------------

  if (
    movies.length !==
    moviesWithActors.length
  ) {
    throw new Error(
      "Movies count mismatch."
    );
  }


  if (
    series.length !==
    seriesWithActors.length
  ) {
    throw new Error(
      "Series count mismatch."
    );
  }


  if (
    movies.length !==
    enrichedMovies.length
  ) {
    throw new Error(
      "Enriched movies count mismatch."
    );
  }


  if (
    series.length !==
    enrichedSeries.length
  ) {
    throw new Error(
      "Enriched series count mismatch."
    );
  }


  // --------------------------------------------------
  // Build
  // --------------------------------------------------

  const frontendMovies =
    buildMovies(
      movies,
      moviesWithActors,
      enrichedMovies
    );


  const frontendSeries =
    buildSeries(
      series,
      seriesWithActors,
      enrichedSeries
    );


  const frontendActors =
    buildActors(
      actors
    );


  // --------------------------------------------------
  // Validate
  // --------------------------------------------------

  validateDataset(
    frontendMovies,
    frontendSeries,
    frontendActors
  );


  // --------------------------------------------------
  // Index
  // --------------------------------------------------

  const index =
    buildIndex(
      frontendMovies,
      frontendSeries,
      frontendActors
    );


  // --------------------------------------------------
  // Save
  // --------------------------------------------------

  saveJson(
    FRONTEND_MOVIES_FILE,
    frontendMovies
  );

  saveJson(
    FRONTEND_SERIES_FILE,
    frontendSeries
  );

  saveJson(
    FRONTEND_ACTORS_FILE,
    frontendActors
  );

  saveJson(
    FRONTEND_INDEX_FILE,
    index
  );


  // --------------------------------------------------
  // Summary
  // --------------------------------------------------

  console.log(
    "\n=============================="
  );

  console.log(
    "FRONTEND DATASET"
  );

  console.log(
    "=============================="
  );

  console.log(
    `Movies: ${frontendMovies.length}`
  );

  console.log(
    `Series: ${frontendSeries.length}`
  );

  console.log(
    `Actors: ${frontendActors.length}`
  );

  console.log(
    `Total titles: ${
      frontendMovies.length +
      frontendSeries.length
    }`
  );

  console.log(
    `Output: ${FRONTEND_PATH}`
  );

  console.log(
    "=============================="
  );


  console.log(
    "\n🎉 Frontend dataset build completed"
  );
}


// ==================================================
// Run
// ==================================================

try {
  main();
} catch (error) {
  console.error(
    "\n❌ Frontend dataset build failed:"
  );

  console.error(
    error.message
  );

  process.exit(1);
}