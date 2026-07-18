import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { likesAPI } from '../services/api';
import type { LikedMovie } from '../services/api';
import useAuth from '../hooks/useAuth';

export interface MovieInput {
  tmdbId: number;
  title: string;
  posterPath?: string | null;
  genres?: string[];
  year?: number | null;
}

const useLikes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['likes', user?.id];

  const { data: likedMovies = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => (await likesAPI.getLikes()).likedMovies,
    enabled: !!user
  });

  const mutation = useMutation({
    mutationFn: ({ movie, remove }: { movie: MovieInput; remove: boolean }) =>
      remove ? likesAPI.unlikeMovie(movie.tmdbId) : likesAPI.likeMovie(movie),
    onMutate: async ({ movie, remove }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<LikedMovie[]>(queryKey);
      queryClient.setQueryData<LikedMovie[]>(queryKey, (old = []) =>
        remove
          ? old.filter(m => m.tmdbId !== movie.tmdbId)
          : [...old, {
              tmdbId: movie.tmdbId,
              title: movie.title,
              posterPath: movie.posterPath || null,
              genres: movie.genres || [],
              likedAt: new Date().toISOString()
            }]
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data.likedMovies);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const isLiked = (tmdbId: number) => likedMovies.some(m => m.tmdbId === tmdbId);

  const toggleLike = (movie: MovieInput) =>
    mutation.mutate({ movie, remove: isLiked(movie.tmdbId) });

  return { likedMovies, isLiked, toggleLike, isLoading };
};

export default useLikes;
