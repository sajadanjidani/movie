import series from "../../../data/imdb/frontend/series.json";


// ==================================================
// Series
// ==================================================

export function getSeries() {
  return series;
}


// ==================================================
// Series By ID
// ==================================================

export function getSeriesById(seriesId) {
  return series.find(
    (item) => item.id === seriesId
  ) || null;
}


// ==================================================
// Series By Genre
// ==================================================

export function getSeriesByGenre(genre) {
  return series.filter(
    (item) =>
      Array.isArray(item.genres) &&
      item.genres.includes(genre)
  );
}


// ==================================================
// Top Rated Series
// ==================================================

export function getTopRatedSeries(limit = 10) {
  return [...series]
    .sort(
      (a, b) => b.rating - a.rating
    )
    .slice(0, limit);
}


// ==================================================
// Popular Series
// ==================================================

export function getPopularSeries(limit = 10) {
  return [...series]
    .sort(
      (a, b) => b.votes - a.votes
    )
    .slice(0, limit);
}


// ==================================================
// Search Series
// ==================================================

export function searchSeries(query) {
  const normalizedQuery =
    query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return series.filter(
    (item) =>
      item.title
        ?.toLowerCase()
        .includes(normalizedQuery) ||
      item.originalTitle
        ?.toLowerCase()
        .includes(normalizedQuery)
  );
}