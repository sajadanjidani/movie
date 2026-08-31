import movies from "../../../data/imdb/frontend/movies.json";


// ==================================================
// Movies
// ==================================================

export function getMovies() {
  return movies;
}


// ==================================================
// Movie By ID
// ==================================================

export function getMovieById(movieId) {
  return movies.find(
    (movie) => movie.id === movieId
  ) || null;
}


// ==================================================
// Movies By Genre
// ==================================================

export function getMoviesByGenre(genre) {
  return movies.filter(
    (movie) =>
      Array.isArray(movie.genres) &&
      movie.genres.includes(genre)
  );
}


// ==================================================
// Top Rated Movies
// ==================================================

export function getTopRatedMovies(limit = 10) {
  return [...movies]
    .sort(
      (a, b) => b.rating - a.rating
    )
    .slice(0, limit);
}


// ==================================================
// Popular Movies
// ==================================================

export function getPopularMovies(limit = 10) {
  return [...movies]
    .sort(
      (a, b) => b.votes - a.votes
    )
    .slice(0, limit);
}


// ==================================================
// Search Movies
// ==================================================

export function searchMovies(query) {
  const normalizedQuery =
    query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return movies.filter(
    (movie) =>
      movie.title
        ?.toLowerCase()
        .includes(normalizedQuery) ||
      movie.originalTitle
        ?.toLowerCase()
        .includes(normalizedQuery)
  );
}

console.log(
  "Movies loaded:",
  movies.length
);