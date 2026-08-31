export const imdbConfig = {
  datasets: [
    {
      name: "title.basics.tsv.gz",
      url: "https://datasets.imdbws.com/title.basics.tsv.gz",
    },
    {
      name: "title.ratings.tsv.gz",
      url: "https://datasets.imdbws.com/title.ratings.tsv.gz",
    },
    {
      name: "title.principals.tsv.gz",
      url: "https://datasets.imdbws.com/title.principals.tsv.gz",
    },
    {
      name: "name.basics.tsv.gz",
      url: "https://datasets.imdbws.com/name.basics.tsv.gz",
    },
  ],

  rawPath: "./data/imdb/raw",
  outputPath: "./data/imdb/output",
};