import api from './api';

export const scheduleService = {
  getMySchedules: async () => {
    const response = await api.get('/schedules/my-schedules');
    return response.data;
  },

  getScheduleById: async (id) => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },

  getPublicSchedule: async (linkToken) => {
    const response = await api.get(`/schedules/public/${linkToken}`);
    return response.data;
  },

  createSchedule: async (data) => {
    const response = await api.post('/schedules', data);
    return response.data;
  },

  updateSchedule: async (id, data) => {
    const response = await api.put(`/schedules/${id}`, data);
    return response.data;
  },

  deleteSchedule: async (id) => {
    const response = await api.delete(`/schedules/${id}`);
    return response;
  },

  addTimeSlots: async (scheduleId, slots) => {
    const response = await api.post(`/schedules/${scheduleId}/slots`, { slots });
    return response.data;
  },

  deleteTimeSlot: async (slotId) => {
    const response = await api.delete(`/schedules/slots/${slotId}`);
    return response;
  },
};

export default scheduleService;
