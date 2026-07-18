import { useQuery } from '@tanstack/react-query';
import { aiAPI } from '../services/api';
import useAuth from '../hooks/useAuth';

const useAIHistory = () => {
  const { user } = useAuth();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['ai-history', user?.id],
    queryFn: async () => (await aiAPI.getHistory()).history,
    enabled: !!user
  });

  return { history, isLoading };
};

export default useAIHistory;
