import type { UpcomingMoviesResponse } from "../types/movie";


const API_URL = import.meta.env.VITE_TMDB_API_URL;
const TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;


export const getUpcomingMovies = async (
    page:number,category:string
):Promise<UpcomingMoviesResponse> => {
  const response = await fetch(`${API_URL}/movie/${category}?language=en-US&page=${page}`, {
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