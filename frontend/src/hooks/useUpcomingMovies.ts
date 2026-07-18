import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUpcomingMovies } from "../services/tmdb";

export const useUpcomingMovies = (category: string) => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['tmdb-movies', category, page],
    queryFn: () => getUpcomingMovies(page, category),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000
  });

  return {
    movies: data?.results ?? [],
    isLoading,
    page,
    totalPages: data?.total_pages ?? 1,
    setPage
  };
};
