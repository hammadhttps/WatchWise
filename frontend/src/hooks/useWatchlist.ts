import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistAPI } from '../services/api';
import type { WatchlistMovie } from '../services/api';
import useAuth from '../hooks/useAuth';
import type { MovieInput } from './useLikes';

const useWatchlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['watchlist', user?.id];

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => (await watchlistAPI.getWatchlist()).watchlist,
    enabled: !!user
  });

  const mutation = useMutation({
    mutationFn: ({ movie, remove }: { movie: MovieInput; remove: boolean }) =>
      remove ? watchlistAPI.removeFromWatchlist(movie.tmdbId) : watchlistAPI.addToWatchlist(movie),
    onMutate: async ({ movie, remove }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<WatchlistMovie[]>(queryKey);
      queryClient.setQueryData<WatchlistMovie[]>(queryKey, (old = []) =>
        remove
          ? old.filter(m => m.tmdbId !== movie.tmdbId)
          : [...old, {
              tmdbId: movie.tmdbId,
              title: movie.title,
              posterPath: movie.posterPath || null,
              genres: movie.genres || [],
              addedAt: new Date().toISOString()
            }]
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data.watchlist);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const isInWatchlist = (tmdbId: number) => watchlist.some(m => m.tmdbId === tmdbId);

  const toggleWatchlist = (movie: MovieInput) =>
    mutation.mutate({ movie, remove: isInWatchlist(movie.tmdbId) });

  return { watchlist, isInWatchlist, toggleWatchlist, isLoading };
};

export default useWatchlist;
