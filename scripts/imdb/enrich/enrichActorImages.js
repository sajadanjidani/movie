import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execFile } from "child_process";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../..");

const ACTORS_INPUT = path.join(ROOT_DIR, "data/imdb/output/actors.json");
const ACTORS_OUTPUT = ACTORS_INPUT;
const CACHE_FILE = path.join(
	ROOT_DIR,
	"data/imdb/enriched/wikimedia-actor-cache.json",
);

const IMDB_SUGGESTION_URL =
	"https://v3.sg.media-imdb.com/suggestion/n/";
const CONCURRENCY = 8;
const REQUEST_TIMEOUT = 30;
const execFileAsync = promisify(execFile);

function readJson(file) {
	return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
	fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

async function fetchActorImage(id) {
	const { stdout } = await execFileAsync(
		"curl.exe",
		[
			"-sS",
			"-L",
			"--connect-timeout",
			"10",
			"--max-time",
			String(REQUEST_TIMEOUT),
			`${IMDB_SUGGESTION_URL}${id}.json`,
		],
		{ windowsHide: true, maxBuffer: 1024 * 1024 },
	);

	const result = JSON.parse(stdout);
	const actor = result.d?.find((item) => item.id === id);
	return actor?.i?.imageUrl || null;
}

async function enrichActors(actors, cache) {
	let completed = 0;
	const pending = actors.filter((actor) => !cache[actor.id]);
	const total = pending.length;

	async function worker() {
		while (pending.length) {
			const actor = pending.pop();

			try {
				const image = await fetchActorImage(actor.id);
				if (image) {
					cache[actor.id] = image;
				}
			} catch (error) {
				cache[actor.id] = cache[actor.id] || null;
				console.warn(`Could not fetch image for ${actor.id}: ${error.message}`);
			}

			completed += 1;
			if (completed % 100 === 0 || completed === total) {
				writeJson(CACHE_FILE, cache);
				console.log(`Processed ${completed}/${total}`);
			}
		}
	}

	await Promise.all(
		Array.from(
			{ length: Math.min(CONCURRENCY, pending.length) },
			() => worker(),
		),
	);
}

async function main() {
	const actors = readJson(ACTORS_INPUT);
	const cache = fs.existsSync(CACHE_FILE) ? readJson(CACHE_FILE) : {};

	console.log(`🎭 Enriching ${actors.length} actors with IMDb images...`);
	await enrichActors(actors, cache);

	const enrichedActors = actors.map((actor) => ({
		...actor,
		image: cache[actor.id] || null,
	}));

	writeJson(ACTORS_OUTPUT, enrichedActors);

	const withImage = enrichedActors.filter((actor) => actor.image).length;
	console.log(`✅ Saved ${ACTORS_OUTPUT}`);
	console.log(`Images found: ${withImage}/${enrichedActors.length}`);
}

main().catch((error) => {
	console.error("❌ Actor image enrichment failed:", error.message);
	process.exitCode = 1;
});
