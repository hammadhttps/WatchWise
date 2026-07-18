import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const quoteAPI = {
  getQuote: async (title: string) => {
    const response = await api.get('/quotes', { params: { title, censored: true } });
    return response.data;
  }
};

export const authAPI = {
  signup: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    securityQuestions?: { question: string; answer: string }[];
  }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: { email: string; password: string; remember: boolean }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  verifyQuestions: async (email: string, answers: { question: string; answer: string }[]) => {
    const response = await api.post('/auth/verify-questions', { email, answers });
    return response.data;
  },

  resetPassword: async (newPassword: string) => {
    const response = await api.post('/auth/reset-password', { newPassword });
    return response.data;
  },

  updateSecurityQuestions: async (currentPassword: string, securityQuestions: { question: string; answer: string }[]) => {
    const response = await api.put('/auth/security-questions', { currentPassword, securityQuestions });
    return response.data;
  }
};

export interface LikedMovie {
  tmdbId: number;
  title: string;
  posterPath: string | null;
  genres: string[];
  year?: number | null;
  likedAt: string;
}

export interface SavedMovieInput {
  tmdbId: number;
  title: string;
  posterPath?: string | null;
  genres?: string[];
  year?: number | null;
}

export const likesAPI = {
  getLikes: async (): Promise<{ likedMovies: LikedMovie[] }> => {
    const response = await api.get('/likes');
    return response.data;
  },

  likeMovie: async (movie: SavedMovieInput): Promise<{ likedMovies: LikedMovie[] }> => {
    const response = await api.post('/likes', movie);
    return response.data;
  },

  unlikeMovie: async (tmdbId: number): Promise<{ likedMovies: LikedMovie[] }> => {
    const response = await api.delete(`/likes/${tmdbId}`);
    return response.data;
  }
};

export interface WatchlistMovie {
  tmdbId: number;
  title: string;
  posterPath: string | null;
  genres: string[];
  year?: number | null;
  addedAt: string;
}

export const watchlistAPI = {
  getWatchlist: async (): Promise<{ watchlist: WatchlistMovie[] }> => {
    const response = await api.get('/watchlist');
    return response.data;
  },

  addToWatchlist: async (movie: SavedMovieInput): Promise<{ watchlist: WatchlistMovie[] }> => {
    const response = await api.post('/watchlist', movie);
    return response.data;
  },

  removeFromWatchlist: async (tmdbId: number): Promise<{ watchlist: WatchlistMovie[] }> => {
    const response = await api.delete(`/watchlist/${tmdbId}`);
    return response.data;
  }
};

export interface AIRecommendation {
  title: string;
  year: number | null;
  matchScore: number;
  reason: string;
  genres: string[];
}

export interface MatchPreferences {
  mood: string;
  company: string;
  era: string;
  genres: string[];
  note: string;
}

export interface RecommendationHistoryEntry {
  _id: string;
  preferences: MatchPreferences;
  recommendations: AIRecommendation[];
  createdAt: string;
}

export const aiAPI = {
  getRecommendations: async (preferences: MatchPreferences): Promise<{ recommendations: AIRecommendation[] }> => {
    const response = await api.post('/recommendations', preferences);
    return response.data;
  },

  getHistory: async (): Promise<{ history: RecommendationHistoryEntry[] }> => {
    const response = await api.get('/recommendations/history');
    return response.data;
  }
};

export interface CommunityReview {
  _id: string;
  movieId: number;
  movieTitle: string;
  user: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export const reviewsAPI = {
  getReviews: async (movieId: number): Promise<{ reviews: CommunityReview[]; stats: { average: number | null; count: number } }> => {
    const response = await api.get(`/reviews/${movieId}`);
    return response.data;
  },

  submitReview: async (data: { movieId: number; movieTitle: string; rating: number; text: string }): Promise<{ review: CommunityReview }> => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  deleteReview: async (movieId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/reviews/${movieId}`);
    return response.data;
  }
};

export const tasteAPI = {
  getRoast: async (): Promise<{ roast: string }> => {
    const response = await api.post('/taste/roast');
    return response.data;
  }
};

export interface Party {
  id: string;
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  backdropPath: string | null;
  hostName: string;
  members: string[];
}

export const partyAPI = {
  createParty: async (data: { movieId: number; movieTitle: string; posterPath?: string | null; backdropPath?: string | null }): Promise<{ party: Party }> => {
    const response = await api.post('/party', data);
    return response.data;
  },

  getParty: async (id: string): Promise<{ party: Party }> => {
    const response = await api.get(`/party/${id}`);
    return response.data;
  }
};

export const SECURITY_QUESTIONS = [
  "What was your first pet's name?",
  "What city were you born in?",
  "What was your childhood nickname?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What is your favorite movie?",
  "What was your favorite food as a child?",
  "What street did you grow up on?"
];

export default api;
