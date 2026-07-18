import { useEffect, useState } from 'react';
import { getAnimeMovies } from '../services/tmdb';
import type { Movie } from '../types/movie';

export const useTopAnime = (initialPage = 1) => {
  const [anime, setAnime] = useState<Movie[]>([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnime = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAnimeMovies(page);
        setAnime(response.results || []);
        setTotalPages(response.total_pages || 1);
      } catch {
        setError('Unable to load anime movies right now.');
      } finally {
        setLoading(false);
      }
    };

    loadAnime();
  }, [page]);

  return {
    anime,
    page,
    setPage,
    totalPages,
    loading,
    error,
  };
};
