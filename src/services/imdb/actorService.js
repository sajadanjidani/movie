import actors from '../../../data/imdb/output/actorsWithPopularity.json';

// ==================================================
// Actors
// ==================================================

export function getActors() {
  return actors;
}

// ==================================================
// Popular Actors
// ==================================================

export function getPopularActors(limit = 10) {
  return [...actors]
    .sort(
      (a, b) =>
        (b.stats?.popularityScore ?? 0) -
        (a.stats?.popularityScore ?? 0)
    )
    .slice(0, limit);
}

// ==================================================
// Actor By ID
// ==================================================

export function getActorById(actorId) {
  return (
    actors.find((actor) => actor.id === actorId) || null
  );
}

// ==================================================
// Actors By Title
// ==================================================

export function getActorsByTitle(titleId) {
  return actors.filter(
    (actor) =>
      Array.isArray(actor.titles) &&
      actor.titles.some(
        (title) => title.id === titleId
      )
  );
}

// ==================================================
// Actor Movies
// ==================================================

export function getActorMovies(actorId) {
  const actor = getActorById(actorId);

  if (!actor) {
    return [];
  }

  return actor.titles.filter(
    (title) => title.type === "movie"
  );
}

// ==================================================
// Actor Series
// ==================================================

export function getActorSeries(actorId) {
  const actor = getActorById(actorId);

  if (!actor) {
    return [];
  }

  return actor.titles.filter(
    (title) => title.type === "series"
  );
}

// ==================================================
// Search Actors
// ==================================================

export function searchActors(query) {
  const normalizedQuery =
    query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return actors.filter((actor) =>
    actor.name
      ?.toLowerCase()
      .includes(normalizedQuery)
  );
}