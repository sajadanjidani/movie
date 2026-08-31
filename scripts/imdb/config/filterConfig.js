export const filterConfig = {
  movies: {
    targetCount: 1000,

    allowedTypes: [
      "movie",
    ],

    minYear: 2000,

    minRating: 7,

    minVotes: 10000,

    allowAdult: false,

    requireGenres: true,
  },

  series: {
    targetCount: 1000,

    allowedTypes: [
      "tvSeries",
    ],

    minYear: 2000,

    minRating: 7,

    minVotes: 10000,

    allowAdult: false,

    requireGenres: true,
  },

  actors: {
    // حداکثر تعداد بازیگر برای هر عنوان
    maxPerTitle: 10,

    // فقط بازیگرهایی که principal cast هستند
    allowedCategories: [
      "actor",
      "actress",
    ],
  },
};