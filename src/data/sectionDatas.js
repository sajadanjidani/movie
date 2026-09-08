import {
  getMovies,
  getPopularMovies,
} from "@/services/imdb/movieService";

import {
  getSeries,
} from "@/services/imdb/seriesService";

import {
  getActors,
} from "@/services/imdb/actorService";

export const sectionDatas = [
    { id : 1 , label : 'Trends' , moreAddress : null , datas : getPopularMovies(20)},
    { id : 2 , label : 'Movies' , moreAddress : '/Movies' , datas : getMovies()},
    { id : 3 , label : 'Series' , moreAddress : '/Series' , datas : getSeries()},
    { id : 4 , label : 'Collection' , moreAddress : '/Collection'},
    { id : 5 , label : 'Charactors' , moreAddress : '/Charactors' , datas : getActors()},
]