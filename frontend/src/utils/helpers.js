/**
 * Formats ISO date string to readable Date & Time.
 */
export const formatDateTime = (isoDate) => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Formats ISO date string to readable Time (e.g. 10:30 AM).
 */
export const formatTime = (isoDate) => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Formats ISO date string to readable Date only (e.g. Wed, Oct 12).
 */
export const formatDate = (isoDate) => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Formats Day Header for Excel grid (e.g. "Mon 24/08").
 */
export const formatDayHeader = (dateObj) => {
  if (!dateObj) return '';
  const d = new Date(dateObj);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${weekday} ${day}/${month}`;
};

/**
 * Returns an array of 7 Date objects for Monday-Sunday of the week containing baseDate.
 */
export const getWeekDates = (baseDate = new Date()) => {
  const d = new Date(baseDate);
  const day = d.getDay(); // 0 is Sun, 1 is Mon, ... 6 is Sat
  const diffToMonday = d.getDate() - (day === 0 ? 6 : day - 1);
  const monday = new Date(d.setDate(diffToMonday));
  monday.setHours(0, 0, 0, 0);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    week.push(nextDay);
  }
  return week;
};

/**
 * Standard University Schedule Distribution (Academic Modules: 1h10m classes, 10m breaks, 13:30-14:50 Lunch)
 */
export const UNI_MODULES = [
  { module: '1', name: 'Módulo 1', startTime: '08:20', endTime: '09:30' },
  { module: '2', name: 'Módulo 2', startTime: '09:40', endTime: '10:50' },
  { module: '3', name: 'Módulo 3', startTime: '11:00', endTime: '12:10' },
  { module: '4', name: 'Módulo 4', startTime: '12:20', endTime: '13:30' },
  { isLunch: true, module: 'Almuerzo', name: 'Almuerzo / Lunch', startTime: '13:30', endTime: '14:50' },
  { module: '5', name: 'Módulo 5', startTime: '14:50', endTime: '16:00' },
  { module: '6', name: 'Módulo 6', startTime: '16:10', endTime: '17:20' },
  { module: '7', name: 'Módulo 7', startTime: '17:30', endTime: '18:40' },
  { module: '8', name: 'Módulo 8', startTime: '18:50', endTime: '20:00' },
  { module: '9', name: 'Módulo 9', startTime: '20:10', endTime: '21:20' },
];

/**
 * Generates an array of time slot intervals in HH:mm format.
 */
export const generateTimeIntervals = (fromTime = '08:00', toTime = '18:00', stepMinutes = 30) => {
  const intervals = [];
  const [fromH, fromM] = fromTime.split(':').map(Number);
  const [toH, toM] = toTime.split(':').map(Number);

  let currentMinutes = fromH * 60 + fromM;
  const endMinutes = toH * 60 + toM;

  while (currentMinutes + stepMinutes <= endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    intervals.push(timeStr);
    currentMinutes += stepMinutes;
  }

  return intervals;
};

/**
 * Groups an array of time slot objects by their calendar date (YYYY-MM-DD).
 */
export const groupSlotsByDate = (slots = []) => {
  if (!Array.isArray(slots)) return {};
  return slots.reduce((acc, slot) => {
    const dateKey = new Date(slot.startTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {});
};

/**
 * Copies text to clipboard and returns boolean indicating success.
 */
export const copyToClipboard = async (text) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

/**
 * Generates the full public booking URL for a schedule token.
 */
export const getShareableLink = (linkToken) => {
  if (!linkToken) return '';
  const baseUrl = typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'http://localhost:5173';
  return `${baseUrl}/schedule/${linkToken}`;
};
