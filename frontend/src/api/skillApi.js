import api from './axios';

export const getSkills = (params) => api.get('/skills/', { params });
export const getSkillById = (id) => api.get(`/skills/${id}/`);
export const createSkill = (data) => api.post('/skills/', data);
export const updateSkill = (id, data) => api.put(`/skills/${id}/`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}/`);
export const getMySkills = () => api.get('/skills/my-skills/');
export const searchSkills = (params) => api.get('/skills/search/', { params });
export const getMatches = () => api.get('/skills/matches/');
