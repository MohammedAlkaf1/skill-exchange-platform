import api from './axios';

export const getUsers = (params) => api.get('/users/', { params });
export const getUserById = (id) => api.get(`/users/${id}/`);
export const getUserReviews = (id) => api.get(`/users/${id}/reviews/`);
export const getUserSkills = (id) => api.get(`/users/${id}/skills/`);
