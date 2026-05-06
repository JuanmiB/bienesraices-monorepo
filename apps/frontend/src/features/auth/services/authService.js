import { api } from '@shared/services/api';

export const login = async (email, password) => {
  const response = await api.post('/api/v1/auth/login', { email, password });
  return response.data.user;
};

export const logout = async () => {
  await api.post('/api/v1/auth/logout');
};

export const register = async ({ name, lastName, email, password }) => {
  const response = await api.post('/api/v1/auth/register', {
    firstname: name,
    lastName,
    email,
    password,
  });
  return response.data.user;
};

export const verify = async () => {
  const response = await api.get('/api/v1/auth/verify');
  return response.data.user;
};

export const recoverPassword = async (email) => {
  await api.post('/api/v1/auth/password/recover', { email });
};

export const resetPassword = async (token, newPassword) => {
  await api.post(`/api/v1/auth/password/reset/${token}`, { password: newPassword });
};

export const verifyEmail = async (token) => {
  await api.post('/api/v1/auth/email/verify', { token });
};
