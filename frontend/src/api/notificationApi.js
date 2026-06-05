import api from './axios';

export const getNotifications = () => api.get('/notifications/');
export const markAsRead = (id) => api.patch(`/notifications/${id}/read/`);
export const markAllRead = () => api.patch('/notifications/read-all/');
export const getUnreadCount = () => api.get('/notifications/unread-count/');
