import { api } from '@shared/services/api';

const buildQueryString = (params) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, value);
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
};

export const getProperties = async (params = {}) => {
  const response = await api.get(`/api/v1/properties${buildQueryString(params)}`);
  return response.data.data ?? response.data ?? [];
};

export const getFeaturedProperties = async () => {
  const response = await api.get('/api/v1/properties?featured=true');
  return response.data.data ?? response.data ?? [];
};

export const getPropertyById = async (id) => {
  const response = await api.get(`/api/v1/properties/${id}`);
  return response.data.data;
};

export const getPropertyTypes = async () => {
  const response = await api.get('/api/v1/properties/types');
  return response.data;
};

export const sendContactMessage = async (propertyId, payload) => {
  const response = await api.post(`/api/v1/properties/${propertyId}/contact`, payload);
  return response.data;
};
