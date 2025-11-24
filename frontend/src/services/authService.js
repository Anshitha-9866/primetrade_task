import api from './api';

export const authService = {
  signup: async (userData) => {
    const { data } = await api.post('/auth/signup', userData);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getCurrentUser: async () => {
    const { data } = await api.get('/user/profile');
    return data;
  },
};
