export interface Movie {

 id: number;
 title: string;
 overview: string;
 poster_path: string;
 backdrop_path: string;
 vote_average: number;
 release_date: string;
 genre_ids: number[];
 popularity: number;
}

export interface UpcomingMoviesResponse {

 page: number;
 results: Movie[];
 total_pages: number;
 total_results: number;
}

