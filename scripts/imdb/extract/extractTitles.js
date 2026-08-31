/* eslint-env node */

import fs from "fs";
import path from "path";
import zlib from "zlib";
import readline from "readline";

import { imdbConfig } from "../config/imdbConfig.js";
import { filterConfig } from "../config/filterConfig.js";


// ==================================================
// Paths
// ==================================================

const BASICS_FILE = path.join(
  imdbConfig.rawPath,
  "title.basics.tsv.gz"
);

const RATINGS_FILE = path.join(
  imdbConfig.rawPath,
  "title.ratings.tsv.gz"
);

const MOVIES_OUTPUT = path.join(
  imdbConfig.outputPath,
  "movies.json"
);

const SERIES_OUTPUT = path.join(
  imdbConfig.outputPath,
  "series.json"
);


// ==================================================
// Helpers
// ==================================================

function isValidValue(value) {
  return value && value !== "\\N";
}


function parseNumber(value) {
  if (!isValidValue(value)) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


function parseGenres(value) {
  if (!isValidValue(value)) {
    return [];
  }

  return value
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean);
}


// ==================================================
// Weighted Rating
// ==================================================

function calculateWeightedRating(
  rating,
  votes,
  minimumVotes,
  averageRating
) {
  return (
    (votes / (votes + minimumVotes)) * rating +
    (minimumVotes / (votes + minimumVotes)) * averageRating
  );
}


// ==================================================
// Candidate comparison
// ==================================================
//
// Better candidate = smaller comparator result
//

function compareCandidates(a, b) {
  if (a.score !== b.score) {
    return b.score - a.score;
  }

  if (a.rating !== b.rating) {
    return b.rating - a.rating;
  }

  if (a.votes !== b.votes) {
    return b.votes - a.votes;
  }

  if (a.startYear !== b.startYear) {
    return b.startYear - a.startYear;
  }

  return a.id.localeCompare(b.id);
}


// ==================================================
// Load Ratings
// ==================================================

async function loadRatings() {
  console.log("Loading ratings...");

  const ratings = new Map();

  let totalRating = 0;
  let totalRatingCount = 0;

  const stream = fs
    .createReadStream(RATINGS_FILE)
    .pipe(zlib.createGunzip());

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let isHeader = true;
  let count = 0;

  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }

    const parts = line.split("\t");

    const tconst = parts[0];
    const rating = parseNumber(parts[1]);
    const votes = parseNumber(parts[2]);

    if (
      !tconst ||
      rating === null ||
      votes === null
    ) {
      continue;
    }

    ratings.set(tconst, {
      rating,
      votes,
    });

    totalRating += rating;
    totalRatingCount++;
    count++;

    if (count % 100000 === 0) {
      process.stdout.write(
        `\rRatings loaded: ${count.toLocaleString()}`
      );
    }
  }

  const averageRating =
    totalRatingCount > 0
      ? totalRating / totalRatingCount
      : 0;

  console.log(
    `\nRatings loaded: ${count.toLocaleString()}`
  );

  // مقدار کامل در محاسبات استفاده می‌شود.
  // فقط نمایش را تا 6 رقم اعشار محدود می‌کنیم.
  console.log(
    `IMDb average rating: ${averageRating.toFixed(6)}`
  );

  return {
    ratings,
    averageRating,
  };
}


// ==================================================
// Extract Titles
// ==================================================

async function extractTitles(
  ratings,
  averageRating
) {
  console.log("\nExtracting titles...\n");

  const movies = [];
  const series = [];

  const movieConfig = filterConfig.movies;
  const seriesConfig = filterConfig.series;

  const movieLimit = movieConfig.targetCount;
  const seriesLimit = seriesConfig.targetCount;

  const stream = fs
    .createReadStream(BASICS_FILE)
    .pipe(zlib.createGunzip());

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let isHeader = true;

  let processed = 0;
  let acceptedMovies = 0;
  let acceptedSeries = 0;


  // ==================================================
  // Process IMDb Basics
  // ==================================================

  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }

    processed++;

    const parts = line.split("\t");

    const tconst = parts[0];
    const titleType = parts[1];
    const primaryTitle = parts[2];
    const originalTitle = parts[3];
    const isAdult = parts[4];
    const startYear = parseNumber(parts[5]);
    const endYear = parseNumber(parts[6]);
    const runtimeMinutes = parseNumber(parts[7]);
    const genres = parseGenres(parts[8]);


    // ----------------------------------------------
    // Basic validation
    // ----------------------------------------------

    if (!tconst) {
      continue;
    }

    if (!isValidValue(titleType)) {
      continue;
    }

    if (!isValidValue(primaryTitle)) {
      continue;
    }


    // ----------------------------------------------
    // Movie / Series
    // ----------------------------------------------

    const isMovie = titleType === "movie";
    const isSeries = titleType === "tvSeries";

    if (!isMovie && !isSeries) {
      continue;
    }


    // ----------------------------------------------
    // Adult
    // ----------------------------------------------

    if (isAdult !== "0") {
      continue;
    }


    // ----------------------------------------------
    // Config
    // ----------------------------------------------

    const config = isMovie
      ? movieConfig
      : seriesConfig;


    // ----------------------------------------------
    // Genre
    // ----------------------------------------------

    if (
      config.requireGenres &&
      genres.length === 0
    ) {
      continue;
    }


    // ----------------------------------------------
    // Year
    // ----------------------------------------------

    if (
      startYear === null ||
      startYear < config.minYear
    ) {
      continue;
    }


    // ----------------------------------------------
    // Rating
    // ----------------------------------------------

    const ratingData = ratings.get(tconst);

    if (!ratingData) {
      continue;
    }


    // ----------------------------------------------
    // Minimum Rating
    // ----------------------------------------------

    if (
      ratingData.rating <
      config.minRating
    ) {
      continue;
    }


    // ----------------------------------------------
    // Minimum Votes
    // ----------------------------------------------

    if (
      ratingData.votes <
      config.minVotes
    ) {
      continue;
    }


    // ----------------------------------------------
    // Weighted Rating
    // ----------------------------------------------

    const score = calculateWeightedRating(
      ratingData.rating,
      ratingData.votes,
      config.minVotes,
      averageRating
    );


    // ----------------------------------------------
    // Candidate
    // ----------------------------------------------

    const candidate = {
      id: tconst,

      titleType,

      title: primaryTitle,

      originalTitle:
        isValidValue(originalTitle)
          ? originalTitle
          : primaryTitle,

      isAdult: false,

      startYear,

      endYear:
        endYear === null
          ? null
          : endYear,

      runtimeMinutes,

      genres,

      rating: ratingData.rating,

      votes: ratingData.votes,

      // Internal field.
      // This is the EXACT score calculated
      // using the REAL IMDb average.
      score,
    };


    // ==================================================
    // Movie
    // ==================================================

    if (isMovie) {
      addToTopK(
        movies,
        candidate,
        movieLimit
      );

      acceptedMovies++;
    }


    // ==================================================
    // Series
    // ==================================================

    if (isSeries) {
      addToTopK(
        series,
        candidate,
        seriesLimit
      );

      acceptedSeries++;
    }


    // ==================================================
    // Progress
    // ==================================================

    if (processed % 500000 === 0) {
      process.stdout.write(
        `\rProcessed: ${processed.toLocaleString()} | ` +
        `Movies: ${movies.length}/${movieLimit} | ` +
        `Series: ${series.length}/${seriesLimit}`
      );
    }
  }


  console.log("\n");


  // ==================================================
  // FINAL SORT
  // ==================================================

  movies.sort(compareCandidates);
  series.sort(compareCandidates);


  // ==================================================
  // Remove internal score
  // ==================================================

  const cleanMovies = movies.map(
    ({ score, ...movie }) => movie
  );

  const cleanSeries = series.map(
    ({ score, ...seriesItem }) => seriesItem
  );


  return {
    movies: cleanMovies,
    series: cleanSeries,
    processed,
    acceptedMovies,
    acceptedSeries,
  };
}


// ==================================================
// Top K
// ==================================================
//
// فقط K مورد برتر را نگه می‌داریم.
//
// نکته مهم:
// Score قبلاً با averageRating واقعی محاسبه شده
// و همان score برای مقایسه استفاده می‌شود.
//

function addToTopK(
  collection,
  candidate,
  limit
) {
  // هنوز به ظرفیت نرسیده‌ایم
  if (collection.length < limit) {
    collection.push(candidate);
    return;
  }


  // پیدا کردن ضعیف‌ترین candidate
  let worstIndex = 0;

  for (
    let i = 1;
    i < collection.length;
    i++
  ) {
    if (
      compareCandidates(
        collection[i],
        collection[worstIndex]
      ) > 0
    ) {
      worstIndex = i;
    }
  }


  // اگر candidate جدید بهتر است
  if (
    compareCandidates(
      candidate,
      collection[worstIndex]
    ) < 0
  ) {
    collection[worstIndex] = candidate;
  }
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
    `✅ Saved: ${filePath}`
  );
}


// ==================================================
// Main
// ==================================================

async function main() {
  console.log(
    "🎬 IMDb title extraction started\n"
  );


  // ----------------------------------------------
  // Check files
  // ----------------------------------------------

  if (!fs.existsSync(BASICS_FILE)) {
    throw new Error(
      `Missing file: ${BASICS_FILE}`
    );
  }

  if (!fs.existsSync(RATINGS_FILE)) {
    throw new Error(
      `Missing file: ${RATINGS_FILE}`
    );
  }


  // ----------------------------------------------
  // Load ratings
  // ----------------------------------------------

  const {
    ratings,
    averageRating,
  } = await loadRatings();


  // ----------------------------------------------
  // Extract
  // ----------------------------------------------

  const result = await extractTitles(
    ratings,
    averageRating
  );


  // ----------------------------------------------
  // Save
  // ----------------------------------------------

  saveJson(
    MOVIES_OUTPUT,
    result.movies
  );

  saveJson(
    SERIES_OUTPUT,
    result.series
  );


  // ----------------------------------------------
  // Summary
  // ----------------------------------------------

  console.log(
    "\n=============================="
  );

  console.log(
    `Movies: ${result.movies.length}`
  );

  console.log(
    `Series: ${result.series.length}`
  );

  console.log(
    `Processed: ${result.processed.toLocaleString()}`
  );

  console.log(
    `Accepted Movies: ${result.acceptedMovies.toLocaleString()}`
  );

  console.log(
    `Accepted Series: ${result.acceptedSeries.toLocaleString()}`
  );

  console.log(
    "=============================="
  );

  console.log(
    "\n🎬 Title extraction completed"
  );
}


// ==================================================
// Run
// ==================================================

main().catch((error) => {
  console.error(
    "\n❌ Extraction failed:"
  );

  console.error(error);

  process.exit(1);
});
