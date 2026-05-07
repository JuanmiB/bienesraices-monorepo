import { api } from '@shared/services/api';

const buildPropertyFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};

export const getMyProperties = async () => {
  const response = await api.get('/api/v1/users/me/properties');
  return response.data.data;
};

export const getMyPropertyById = async (id) => {
  const response = await api.get(`/api/v1/users/me/properties/${id}`);
  return response.data.data;
};

export const createProperty = async (data, images = []) => {
  const formData = buildPropertyFormData(data);
  images.forEach((file) => formData.append('imagenes', file));
  const response = await api.post('/api/v1/users/me/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const updateProperty = async (id, data) => {
  const formData = buildPropertyFormData(data);
  const response = await api.put(`/api/v1/users/me/properties/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const deleteProperty = async (id) => {
  await api.delete(`/api/v1/users/me/properties/${id}`);
};

export const togglePublish = async (id, active) => {
  const response = await api.patch(`/api/v1/users/me/properties/${id}`, { active });
  return response.data.data;
};

export const setPrimaryImage = async (propertyId, imageId) => {
  await api.put(`/api/v1/users/me/properties/${propertyId}/images/${imageId}/primary`);
};

export const deleteImage = async (propertyId, imageId) => {
  await api.delete(`/api/v1/users/me/properties/${propertyId}/images/${imageId}`);
};

export const addImages = async (propertyId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('imagenes', file));
  const response = await api.post(
    `/api/v1/users/me/properties/${propertyId}/images`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data.data;
};
