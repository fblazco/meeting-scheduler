import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getScheduleBookings: async (scheduleId) => {
    const response = await api.get(`/bookings/schedule/${scheduleId}`);
    return response.data;
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await api.patch(`/bookings/${bookingId}/status`, { status });
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  cancelBooking: async (bookingId, email) => {
    const response = await api.patch(`/bookings/${bookingId}/cancel`, { email });
    return response.data;
  },
};

export default bookingService;
