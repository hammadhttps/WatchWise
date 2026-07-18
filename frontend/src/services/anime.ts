import type { AnimeDetail, AnimeTopResponse } from '../types/anime';

const JIKAN_API_URL = 'https://api.jikan.moe/v4';

export const getTopAnime = async (page = 1): Promise<AnimeTopResponse> => {
  const response = await fetch(`${JIKAN_API_URL}/top/anime?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch top anime');
  }
  return response.json();
};

export const getAnimeDetails = async (id: number): Promise<AnimeDetail> => {
  const response = await fetch(`${JIKAN_API_URL}/anime/${id}/full`);
  if (!response.ok) {
    throw new Error('Failed to fetch anime details');
  }
  const payload = await response.json();
  return payload.data as AnimeDetail;
};
