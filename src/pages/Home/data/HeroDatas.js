import { getTopRatedMovies } from '@/services/imdb/movieService'

console.log(getTopRatedMovies(4))

export const HeroDatas = getTopRatedMovies(4)