import { api } from '@shared/services/api';

export const getMe = async () => {
  const response = await api.get('/api/v1/users/me');
  return response.data.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/api/v1/users/me', data);
  return response.data.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await api.post('/api/v1/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};
