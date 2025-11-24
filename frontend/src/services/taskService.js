import api from './api';

export const taskService = {
  getAll: async () => {
    const { data } = await api.get('/tasks');
    return data;
  },
  create: async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    return data;
  },
  update: async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  },
};
