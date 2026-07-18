import type { UpcomingMoviesResponse } from "../types/movie";


const API_URL = import.meta.env.VITE_TMDB_API_URL;
const TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;


export const getUpcomingMovies = async (
    page:number,category:string
):Promise<UpcomingMoviesResponse> => {
  const path = category === 'trending' ? 'trending/movie/week' : `movie/${category}`;
  const response = await fetch(`${API_URL}/${path}?language=en-US&page=${page}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },

  }
);

if(!response.ok){

    throw new Error("Failed to fetch the movies");
}

return response.json();
};

export const TMDB_GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance',
  878: 'Science Fiction', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

export const genreNames = (ids?: number[]): string[] =>
  (ids || []).map(id => TMDB_GENRES[id]).filter(Boolean);

export const searchMovie = async (
  query: string,
  year?: number | null
): Promise<UpcomingMoviesResponse> => {
  const yearParam = year ? `&primary_release_year=${year}` : '';
  const response = await fetch(`${API_URL}/search/movie?query=${encodeURIComponent(query)}${yearParam}&language=en-US&page=1`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to search movies");
  }

  return response.json();
};

export const getAnimeMovies = async (
  page:number = 1
):Promise<UpcomingMoviesResponse> => {
  const response = await fetch(`${API_URL}/discover/movie?language=en-US&sort_by=popularity.desc&with_genres=16&with_original_language=ja&page=${page}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch anime movies");
  }

  return response.json();
};