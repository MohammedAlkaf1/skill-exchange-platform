import api from './axios';

export const getReviews = () => api.get('/reviews/');
export const getReviewById = (id) => api.get(`/reviews/${id}/`);
export const createReview = (data) => api.post('/reviews/', data);
export const getReviewsByUser = (userId) => api.get(`/reviews/user/${userId}/`);
