import type { MovieFullData } from "../types/movieDetails"



const API_URL = import.meta.env.VITE_TMDB_API_URL;
const TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;


const options = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
}



export const fetchMovieFullData = async (
  id: number
): Promise<MovieFullData> => {
  const [
    details,
    reviews,
    images,
    videos,
    similar,
    providers,
  ] = await Promise.all([
    fetch(`${API_URL}/movie/${id}`, options).then(r => r.json()),
    fetch(`${API_URL}/movie/${id}/reviews`, options).then(r => r.json()),
    fetch(`${API_URL}/movie/${id}/images`, options).then(r => r.json()),
    fetch(`${API_URL}/movie/${id}/videos`, options).then(r => r.json()),
    fetch(`${API_URL}/movie/${id}/similar`, options).then(r => r.json()),
    fetch(`${API_URL}/movie/${id}/watch/providers`, options).then(r => r.json()),
  ])

  return {
    details,
    reviews: reviews.results,
    images,
    videos: videos.results,
    similar: similar.results,
    providers: providers.results?.US || null, // region-specific
  }
}