import { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { searchMovie } from '../services/tmdb';

export const useMovieSearch = (term: string) => {
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term.trim()), 300);
    return () => clearTimeout(timer);
  }, [term]);

  const enabled = debounced.length >= 2;

  const { data, isFetching } = useQuery({
    queryKey: ['movie-search', debounced],
    queryFn: () => searchMovie(debounced),
    enabled,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData
  });

  return {
    results: enabled ? (data?.results?.slice(0, 6) ?? []) : [],
    isFetching
  };
};
