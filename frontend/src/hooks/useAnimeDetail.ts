import { useEffect, useState } from 'react';
import { getAnimeDetails } from '../services/anime';
import type { AnimeDetail } from '../types/anime';

export const useAnimeDetail = (id: number) => {
  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setAnime(null);
      return;
    }

    const loadAnime = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAnimeDetails(id);
        setAnime(response);
      } catch {
        setError('Unable to load anime details at the moment.');
      } finally {
        setLoading(false);
      }
    };

    loadAnime();
  }, [id]);

  return {
    anime,
    loading,
    error,
  };
};
