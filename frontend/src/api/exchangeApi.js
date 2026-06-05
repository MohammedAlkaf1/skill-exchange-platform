import api from './axios';

export const getExchanges = () => api.get('/exchanges/');
export const getSentExchanges = () => api.get('/exchanges/sent/');
export const getReceivedExchanges = () => api.get('/exchanges/received/');
export const getExchangeById = (id) => api.get(`/exchanges/${id}/`);
export const createExchange = (data) => api.post('/exchanges/', data);
export const acceptExchange = (id) => api.patch(`/exchanges/${id}/accept/`);
export const rejectExchange = (id) => api.patch(`/exchanges/${id}/reject/`);
export const cancelExchange = (id) => api.patch(`/exchanges/${id}/cancel/`);
export const startExchange = (id) => api.patch(`/exchanges/${id}/start/`);
export const completeExchange = (id) => api.patch(`/exchanges/${id}/complete/`);
