import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execFile } from "child_process";
import { promisify } from "util";

// ============================================================
// PATH CONFIG
// ============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "../../..");

const MOVIES_INPUT = path.join(
  ROOT_DIR,
  "data/imdb/output/movies.json"
);

const SERIES_INPUT = path.join(
  ROOT_DIR,
  "data/imdb/output/series.json"
);

const OUTPUT_DIR = path.join(
  ROOT_DIR,
  "data/imdb/enriched"
);

const MOVIES_OUTPUT = path.join(
  OUTPUT_DIR,
  "movies.json"
);

const SERIES_OUTPUT = path.join(
  OUTPUT_DIR,
  "series.json"
);

const CACHE_FILE = path.join(
  OUTPUT_DIR,
  "omdb-cache.json"
);

// ============================================================
// ENV
// ============================================================

const API_KEYS = [
  process.env.OMDB_API_KEY_1,
  process.env.OMDB_API_KEY_2,
].filter(Boolean);

const OMDB_URL = "https://www.omdbapi.com/";

const REQUEST_DELAY = 300;

const MAX_RETRIES = 3;

const CURL_TIMEOUT = 30;

// ============================================================
// VALIDATION
// ============================================================

if (API_KEYS.length === 0) {
  console.error("❌ No OMDb API keys found.");

  console.error(`
Add your API keys to .env:

OMDB_API_KEY_1=your_first_key
OMDB_API_KEY_2=your_second_key
`);

  process.exit(1);
}

if (API_KEYS.length < 2) {
  console.warn(
    "⚠️ Only one OMDb API key was found."
  );
}

console.log(
  `🔑 OMDb API keys loaded: ${API_KEYS.length}`
);

// ============================================================
// HELPERS
// ============================================================

function ensureDirectory() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, {
      recursive: true,
    });
  }
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `File not found: ${filePath}`
    );
  }

  return JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );
}

function writeJson(filePath, data) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// ============================================================
// CURL
// ============================================================

const execFileAsync = promisify(execFile);

async function curlRequest(url) {
  const { stdout } = await execFileAsync(
    "curl.exe",
    [
      "-sS",
      "--connect-timeout",
      "15",
      "--max-time",
      String(CURL_TIMEOUT),
      url,
    ],
    {
      windowsHide: true,
      maxBuffer: 1024 * 1024,
    }
  );

  return stdout;
}

// ============================================================
// CACHE
// ============================================================

function loadCache() {
  if (!fs.existsSync(CACHE_FILE)) {
    return {};
  }

  try {
    return readJson(CACHE_FILE);
  } catch {
    console.warn(
      "⚠️ Cache file is invalid. Starting with empty cache."
    );

    return {};
  }
}

function saveCache(cache) {
  writeJson(CACHE_FILE, cache);
}

// ============================================================
// API KEY MANAGER
// ============================================================

let currentKeyIndex = 0;

function getCurrentApiKey() {
  return API_KEYS[currentKeyIndex];
}

function switchApiKey() {
  if (currentKeyIndex >= API_KEYS.length - 1) {
    return false;
  }

  currentKeyIndex++;

  console.log(
    `🔄 Switching to API key ${
      currentKeyIndex + 1
    }/${API_KEYS.length}`
  );

  return true;
}

// ============================================================
// OMDB REQUEST
// ============================================================

async function fetchFromOmdb(imdbId) {
  let retries = 0;

  while (true) {
    const apiKey = getCurrentApiKey();

    const url =
      `${OMDB_URL}?apikey=${encodeURIComponent(apiKey)}` +
      `&i=${encodeURIComponent(imdbId)}` +
      `&plot=short`;

    try {
      // --------------------------------------------------------
      // CURL REQUEST
      // --------------------------------------------------------

      const rawResponse = await curlRequest(url);

      if (!rawResponse) {
        throw new Error(
          "Empty response from OMDb."
        );
      }

      let data;

      try {
        data = JSON.parse(rawResponse);
      } catch {
        throw new Error(
          "OMDb returned invalid JSON."
        );
      }

      // --------------------------------------------------------
      // API LIMIT
      // --------------------------------------------------------

      if (
        data.Response === "False" &&
        data.Error?.toLowerCase().includes("limit")
      ) {
        console.warn(
          `⚠️ API key ${
            currentKeyIndex + 1
          } reached its limit.`
        );

        const switched = switchApiKey();

        if (!switched) {
          throw new Error(
            "All OMDb API keys have reached their limit."
          );
        }

        retries = 0;

        continue;
      }

      // --------------------------------------------------------
      // INVALID API KEY
      // --------------------------------------------------------

      if (
        data.Response === "False" &&
        data.Error?.toLowerCase().includes("invalid api key")
      ) {
        console.warn(
          `⚠️ API key ${
            currentKeyIndex + 1
          } is invalid.`
        );

        const switched = switchApiKey();

        if (!switched) {
          throw new Error(
            "All OMDb API keys are invalid."
          );
        }

        retries = 0;

        continue;
      }

      // --------------------------------------------------------
      // NOT FOUND / OTHER OMDB ERROR
      // --------------------------------------------------------

      if (data.Response === "False") {
        return {
          poster: null,
          plot: null,
          error:
            data.Error ||
            "Unknown OMDb error",
        };
      }

      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------

      return {
        poster:
          data.Poster &&
          data.Poster !== "N/A"
            ? data.Poster
            : null,

        plot:
          data.Plot &&
          data.Plot !== "N/A"
            ? data.Plot
            : null,
      };

    } catch (error) {
      retries++;

      console.warn(
        `⚠️ Request failed for ${imdbId} ` +
        `(attempt ${retries}/${MAX_RETRIES})`
      );

      if (retries >= MAX_RETRIES) {
        return {
          poster: null,
          plot: null,
          error:
            error?.message ||
            "Unknown request error",
        };
      }

      await sleep(2000);
    }
  }
}

// ============================================================
// ENRICH DATASET
// ============================================================

async function enrichDataset(
  items,
  type,
  cache
) {
  const result = [];

  let successCount = 0;
  let cacheCount = 0;
  let failedCount = 0;
  let missingPosterCount = 0;
  let missingPlotCount = 0;

  console.log("");
  console.log(
    `🎬 Processing ${type}: ${items.length} titles`
  );
  console.log("");

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    console.log(
      `[${i + 1}/${items.length}] ${item.title} (${item.id})`
    );

    let omdbData;

    // ========================================================
    // CACHE
    // ========================================================

    if (
      Object.prototype.hasOwnProperty.call(
        cache,
        item.id
      )
    ) {
      omdbData = cache[item.id];

      cacheCount++;

      console.log(
        "   ↳ Using cache"
      );
    }

    // ========================================================
    // OMDB REQUEST
    // ========================================================

    else {
      omdbData = await fetchFromOmdb(
        item.id
      );

      // ------------------------------------------------------
      // SAVE RESULT TO CACHE
      // ------------------------------------------------------

      cache[item.id] = omdbData;

      saveCache(cache);

      if (omdbData.error) {
        failedCount++;

        console.log(
          `   ❌ ${omdbData.error}`
        );
      } else {
        successCount++;

        console.log(
          "   ✅ OMDb data received"
        );
      }

      await sleep(REQUEST_DELAY);
    }

    // ========================================================
    // FINAL OBJECT
    // ========================================================

    const enrichedItem = {
      ...item,

      poster:
        omdbData.poster ?? null,

      plot:
        omdbData.plot ?? null,
    };

    // ========================================================
    // STATISTICS
    // ========================================================

    if (!enrichedItem.poster) {
      missingPosterCount++;
    }

    if (!enrichedItem.plot) {
      missingPlotCount++;
    }

    result.push(enrichedItem);

    // ========================================================
    // PROGRESS
    // ========================================================

    if ((i + 1) % 50 === 0) {
      console.log("");

      console.log(
        `📊 Progress: ${i + 1}/${items.length}`
      );

      console.log("");
    }
  }

  // ==========================================================
  // RESULT
  // ==========================================================

  console.log("");

  console.log(
    `========== ${type.toUpperCase()} RESULT ==========`
  );

  console.log(
    `Total: ${items.length}`
  );

  console.log(
    `From cache: ${cacheCount}`
  );

  console.log(
    `Fetched from OMDb: ${successCount}`
  );

  console.log(
    `Failed: ${failedCount}`
  );

  console.log(
    `Without poster: ${missingPosterCount}`
  );

  console.log(
    `Without plot: ${missingPlotCount}`
  );

  console.log(
    "======================================"
  );

  return result;
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log(
    "🎬 OMDb dataset enrichment started"
  );

  console.log("");

  // ==========================================================
  // DIRECTORY
  // ==========================================================

  ensureDirectory();

  // ==========================================================
  // LOAD INPUT
  // ==========================================================

  console.log(
    "Loading IMDb datasets..."
  );

  const movies = readJson(
    MOVIES_INPUT
  );

  const series = readJson(
    SERIES_INPUT
  );

  console.log(
    `Movies: ${movies.length}`
  );

  console.log(
    `Series: ${series.length}`
  );

  console.log(
    `Total titles: ${
      movies.length + series.length
    }`
  );

  // ==========================================================
  // LOAD CACHE
  // ==========================================================

  const cache = loadCache();

  console.log(
    `Cached OMDb records: ${
      Object.keys(cache).length
    }`
  );

  console.log("");

  // ==========================================================
  // MOVIES
  // ==========================================================

  const enrichedMovies =
    await enrichDataset(
      movies,
      "movies",
      cache
    );

  writeJson(
    MOVIES_OUTPUT,
    enrichedMovies
  );

  console.log("");

  console.log(
    `✅ Saved: ${MOVIES_OUTPUT}`
  );

  // ==========================================================
  // SERIES
  // ==========================================================

  const enrichedSeries =
    await enrichDataset(
      series,
      "series",
      cache
    );

  writeJson(
    SERIES_OUTPUT,
    enrichedSeries
  );

  console.log("");

  console.log(
    `✅ Saved: ${SERIES_OUTPUT}`
  );

  // ==========================================================
  // SAVE CACHE
  // ==========================================================

  saveCache(cache);

  // ==========================================================
  // FINAL
  // ==========================================================

  console.log("");

  console.log(
    "======================================"
  );

  console.log(
    "🎉 OMDb enrichment completed"
  );

  console.log(
    `Movies: ${enrichedMovies.length}`
  );

  console.log(
    `Series: ${enrichedSeries.length}`
  );

  console.log(
    `Total: ${
      enrichedMovies.length +
      enrichedSeries.length
    }`
  );

  console.log(
    `Cache: ${
      Object.keys(cache).length
    }`
  );

  console.log(
    "======================================"
  );
}

// ============================================================
// RUN
// ============================================================

main().catch((error) => {
  console.error("");

  console.error(
    "❌ OMDb enrichment failed:"
  );

  console.error(error);

  process.exit(1);
});
