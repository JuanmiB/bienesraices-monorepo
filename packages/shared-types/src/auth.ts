import { User } from './user';

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface AuthError {
  message: string;
  code: 'INVALID_CREDENTIALS' | 'USER_EXISTS' | 'INVALID_TOKEN' | 'UNAUTHORIZED' | 'EMAIL_NOT_CONFIRMED';
  details?: Record<string, string>;
}

export interface TokenPayload {
  id: string;
  email: string;
  nombre: string;
}
