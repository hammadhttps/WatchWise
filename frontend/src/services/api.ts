import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authAPI = {
  signup: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    securityQuestions: { question: string; answer: string }[];
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

  resetPassword: async (email: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', { email, newPassword });
    return response.data;
  },

  updateSecurityQuestions: async (currentPassword: string, securityQuestions: { question: string; answer: string }[]) => {
    const response = await api.put('/auth/security-questions', { currentPassword, securityQuestions });
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
