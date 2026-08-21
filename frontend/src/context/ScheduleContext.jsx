import React, { createContext, useState, useCallback } from 'react';
import scheduleService from '../services/scheduleService';

export const ScheduleContext = createContext(null);

export const ScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMySchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scheduleService.getMySchedules();
      setSchedules(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch schedules');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchScheduleById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await scheduleService.getScheduleById(id);
      setCurrentSchedule(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch schedule details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSchedule = async (scheduleData) => {
    setLoading(true);
    try {
      const newSchedule = await scheduleService.createSchedule(scheduleData);
      setSchedules((prev) => [newSchedule, ...prev]);
      return newSchedule;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id) => {
    await scheduleService.deleteSchedule(id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    if (currentSchedule?.id === id) {
      setCurrentSchedule(null);
    }
  };

  const value = {
    schedules,
    currentSchedule,
    loading,
    error,
    fetchMySchedules,
    fetchScheduleById,
    createSchedule,
    deleteSchedule,
    setCurrentSchedule,
  };

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};

export default ScheduleContext;
