import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "../../..");

const ACTORS_INPUT = path.join(ROOT_DIR, "data/imdb/output/actors.json");

const MOVIES_INPUT = path.join(
  ROOT_DIR,
  "data/imdb/output/moviesWithActors.json",
);

const SERIES_INPUT = path.join(
  ROOT_DIR,
  "data/imdb/output/seriesWithActors.json",
);

const OUTPUT = path.join(
  ROOT_DIR,
  "data/imdb/output/actorsWithPopularity.json",
);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function main() {
  console.log("🎭 Calculating actor popularity...");

  const actors = readJson(ACTORS_INPUT);

  const movies = readJson(MOVIES_INPUT);

  const series = readJson(SERIES_INPUT);

  console.log("Actors:", actors.length);

  const titlesMap = new Map();

  [...movies, ...series].forEach((item) => {
    titlesMap.set(item.id, {
      rating: item.rating,
      votes: item.votes,
    });
  });

  const result = actors

    .filter((actor) => actor.titles.length >= 3)

    .map((actor) => {
      let totalTitleScore = 0;

      let ratings = [];

      let votes = [];

      actor.titles.forEach((title) => {
        const item = titlesMap.get(title.id);

        if (item) {
          ratings.push(item.rating);

          votes.push(item.votes);


          const titleScore = item.rating * Math.log10(item.votes + 1);

          totalTitleScore += titleScore;
        }
      });

      const titleCount = actor.titles.length;

      const averageRating = ratings.length
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

      const averageVotes = votes.length
        ? votes.reduce((a, b) => a + b, 0) / votes.length
        : 0;


      const experienceBonus = Math.min(titleCount, 10) * 5;

      const popularityScore =
        totalTitleScore + averageRating * 30 + experienceBonus;

      return {
        ...actor,

        stats: {
          titleCount,

          averageRating: Number(averageRating.toFixed(2)),

          averageVotes: Math.round(averageVotes),

          popularityScore: Number(popularityScore.toFixed(2)),
        },
      };
    });

  result.sort((a, b) => b.stats.popularityScore - a.stats.popularityScore);

  writeJson(OUTPUT, result);

  console.log("✅ Saved:", OUTPUT);

  console.log("Top 10 Actors:");

  console.log(
    result.slice(0, 10).map(
      (actor) =>
        `${actor.name}
(${actor.stats.popularityScore})`,
    ),
  );
}

main();
