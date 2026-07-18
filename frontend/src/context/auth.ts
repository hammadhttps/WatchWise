import { createContext } from 'react';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    securityQuestions?: { question: string; answer: string }[];
  }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
