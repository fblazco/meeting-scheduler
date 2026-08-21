import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  Clock,
  Trash2,
  Sparkles,
  Layers,
  Utensils,
  GraduationCap,
} from 'lucide-react';
import Button from '../common/Button';
import {
  getWeekDates,
  generateTimeIntervals,
  formatDayHeader,
  formatTime,
  formatDate,
  UNI_MODULES,
} from '../../utils/helpers';

/**
 * Excel-like Weekly Schedule Grid Component
 * Supports:
 * - Standard time steps (15m, 30m, 45m, 60m)
 * - University Schedule Distribution ("uni" / 70m: Módulos 1-9 + 13:30-14:50 Lunch Block)
 */
export const WeeklyScheduleGrid = ({
  mode = 'creator', // 'creator' | 'booker' | 'viewer'
  slotDuration = 30, // 15 | 30 | 45 | 60 | 'uni' | 70
  fromTime = '08:00',
  toTime = '18:00',
  existingSlots = [],
  selectedSlot = null,
  onSelectSlot = () => {},
  selectedSlots = [], // for creator mode: array of { startTime, endTime }
  onChangeSelectedSlots = () => {},
  onDeleteSlot = null,
}) => {
  const isUniSchedule = slotDuration === 'uni' || slotDuration === 70 || slotDuration === '70';

  // Current viewed week base date
  const [baseDate, setBaseDate] = useState(() => {
    if (existingSlots && existingSlots.length > 0) {
      return new Date(existingSlots[0].startTime);
    }
    return new Date();
  });

  const weekDates = useMemo(() => getWeekDates(baseDate), [baseDate]);

  // Standard intervals or Uni Modules
  const rows = useMemo(() => {
    if (isUniSchedule) {
      return UNI_MODULES;
    }
    const intervals = generateTimeIntervals(fromTime, toTime, Number(slotDuration) || 30);
    return intervals.map((timeStr) => ({
      timeStr,
      startTime: timeStr,
      endTime: null,
    }));
  }, [isUniSchedule, fromTime, toTime, slotDuration]);

  // Helper to format ISO string key for a specific date and time
  const getSlotKey = (dateObj, timeStr) => {
    const d = new Date(dateObj);
    const [h, m] = timeStr.split(':').map(Number);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  // Map of created / selected slots by ISO startTime
  const selectedMap = useMemo(() => {
    const map = new Map();
    if (mode === 'creator') {
      selectedSlots.forEach((s) => {
        map.set(new Date(s.startTime).toISOString(), s);
      });
    } else {
      existingSlots.forEach((s) => {
        map.set(new Date(s.startTime).toISOString(), s);
      });
    }
    return map;
  }, [mode, selectedSlots, existingSlots]);

  // Week navigation
  const handlePrevWeek = () => {
    const next = new Date(baseDate);
    next.setDate(next.getDate() - 7);
    setBaseDate(next);
  };

  const handleNextWeek = () => {
    const next = new Date(baseDate);
    next.setDate(next.getDate() + 7);
    setBaseDate(next);
  };

  const handleToday = () => {
    setBaseDate(new Date());
  };

  // Toggle single cell in creator mode
  const handleCellClick = (dateObj, rowItem) => {
    if (mode === 'booker') {
      const startIso = getSlotKey(dateObj, rowItem.startTime);
      const slot = selectedMap.get(startIso);
      if (slot && !slot.isBooked) {
        onSelectSlot(slot);
      }
      return;
    }

    if (mode !== 'creator') return;

    const startIso = getSlotKey(dateObj, rowItem.startTime);
    const startTimeObj = new Date(startIso);
    
    let endTimeObj;
    if (isUniSchedule && rowItem.endTime) {
      const [endH, endM] = rowItem.endTime.split(':').map(Number);
      endTimeObj = new Date(dateObj);
      endTimeObj.setHours(endH, endM, 0, 0);
    } else {
      const durationNum = Number(slotDuration) || 30;
      endTimeObj = new Date(startTimeObj.getTime() + durationNum * 60 * 1000);
    }

    const exists = selectedMap.has(startIso);
    let nextList;

    if (exists) {
      nextList = selectedSlots.filter(
        (s) => new Date(s.startTime).toISOString() !== startIso
      );
    } else {
      nextList = [
        ...selectedSlots,
        {
          startTime: startTimeObj.toISOString(),
          endTime: endTimeObj.toISOString(),
        },
      ];
    }
    onChangeSelectedSlots(nextList);
  };

  // Batch toggle an entire day column in creator mode
  const handleToggleDay = (dateObj) => {
    if (mode !== 'creator') return;

    const daySlots = rows.map((r) => {
      const s = new Date(getSlotKey(dateObj, r.startTime));
      let e;
      if (isUniSchedule && r.endTime) {
        const [endH, endM] = r.endTime.split(':').map(Number);
        e = new Date(dateObj);
        e.setHours(endH, endM, 0, 0);
      } else {
        const durationNum = Number(slotDuration) || 30;
        e = new Date(s.getTime() + durationNum * 60 * 1000);
      }
      return { startTime: s.toISOString(), endTime: e.toISOString() };
    });

    const allDaySelected = daySlots.every((s) => selectedMap.has(s.startTime));
    let nextList;

    if (allDaySelected) {
      const dayIsos = new Set(daySlots.map((s) => s.startTime));
      nextList = selectedSlots.filter((s) => !dayIsos.has(new Date(s.startTime).toISOString()));
    } else {
      const dayIsos = new Set(selectedSlots.map((s) => new Date(s.startTime).toISOString()));
      const toAdd = daySlots.filter((s) => !dayIsos.has(s.startTime));
      nextList = [...selectedSlots, ...toAdd];
    }
    onChangeSelectedSlots(nextList);
  };

  // Batch toggle an entire row in creator mode
  const handleToggleRow = (rowItem) => {
    if (mode !== 'creator') return;

    const rowSlots = weekDates.map((d) => {
      const s = new Date(getSlotKey(d, rowItem.startTime));
      let e;
      if (isUniSchedule && rowItem.endTime) {
        const [endH, endM] = rowItem.endTime.split(':').map(Number);
        e = new Date(d);
        e.setHours(endH, endM, 0, 0);
      } else {
        const durationNum = Number(slotDuration) || 30;
        e = new Date(s.getTime() + durationNum * 60 * 1000);
      }
      return { startTime: s.toISOString(), endTime: e.toISOString() };
    });

    const allRowSelected = rowSlots.every((s) => selectedMap.has(s.startTime));
    let nextList;

    if (allRowSelected) {
      const rowIsos = new Set(rowSlots.map((s) => s.startTime));
      nextList = selectedSlots.filter((s) => !rowIsos.has(new Date(s.startTime).toISOString()));
    } else {
      const currentIsos = new Set(selectedSlots.map((s) => new Date(s.startTime).toISOString()));
      const toAdd = rowSlots.filter((s) => !currentIsos.has(s.startTime));
      nextList = [...selectedSlots, ...toAdd];
    }
    onChangeSelectedSlots(nextList);
  };

  // Batch Quick Select helpers
  const handleSelectAllWeekdays = () => {
    if (mode !== 'creator') return;
    const all = [];
    weekDates.slice(0, 5).forEach((d) => {
      rows.forEach((r) => {
        const s = new Date(getSlotKey(d, r.startTime));
        let e;
        if (isUniSchedule && r.endTime) {
          const [endH, endM] = r.endTime.split(':').map(Number);
          e = new Date(d);
          e.setHours(endH, endM, 0, 0);
        } else {
          const durationNum = Number(slotDuration) || 30;
          e = new Date(s.getTime() + durationNum * 60 * 1000);
        }
        all.push({ startTime: s.toISOString(), endTime: e.toISOString() });
      });
    });
    onChangeSelectedSlots(all);
  };

  const handleClearAll = () => {
    if (mode !== 'creator') return;
    onChangeSelectedSlots([]);
  };

  const startWeekFormatted = formatDate(weekDates[0]);
  const endWeekFormatted = formatDate(weekDates[6]);

  return (
    <div className="excel-schedule-wrapper">
      {/* Grid Controls Toolbar */}
      <div className="excel-grid-toolbar">
        <div className="excel-week-nav">
          <button
            type="button"
            className="excel-nav-btn"
            onClick={handlePrevWeek}
            title="Previous Week"
          >
            <ChevronLeft size={16} />
          </button>
          <button type="button" className="excel-today-btn" onClick={handleToday}>
            This Week
          </button>
          <button
            type="button"
            className="excel-nav-btn"
            onClick={handleNextWeek}
            title="Next Week"
          >
            <ChevronRight size={16} />
          </button>
          <span className="excel-week-title">
            {startWeekFormatted} – {endWeekFormatted}
          </span>
          {isUniSchedule && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginLeft: '0.5rem',
              }}
            >
              <GraduationCap size={13} /> Uni Schedule (Modules 1–9 + Lunch)
            </span>
          )}
        </div>

        {/* Quick Batch Actions (Creator Mode) */}
        {mode === 'creator' && (
          <div className="excel-quick-actions">
            <button
              type="button"
              className="excel-action-pill"
              onClick={handleSelectAllWeekdays}
            >
              <Sparkles size={13} /> Select Mon–Fri
            </button>
            <button
              type="button"
              className="excel-action-pill danger"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="excel-legend">
          <span className="legend-item">
            <span className="legend-box available" />
            {mode === 'creator' ? 'Available (Active)' : 'Available Slot'}
          </span>
          {mode !== 'creator' && (
            <span className="legend-item">
              <span className="legend-box booked" />
              Booked
            </span>
          )}
          {isUniSchedule && (
            <span className="legend-item">
              <span className="legend-box lunch" />
              Almuerzo / Lunch Block
            </span>
          )}
          <span className="legend-item">
            <span className="legend-box empty" />
            Unavailable
          </span>
        </div>
      </div>

      {/* Spreadsheet / Excel Matrix Table */}
      <div className="excel-table-container">
        <table className="excel-grid-table">
          <thead>
            <tr>
              <th className="excel-corner-cell" style={{ width: isUniSchedule ? '115px' : '85px' }}>
                <Clock size={14} style={{ opacity: 0.7 }} />
                <span>{isUniSchedule ? 'Módulo' : 'Time'}</span>
              </th>
              {weekDates.map((dateObj, colIdx) => (
                <th
                  key={colIdx}
                  className={`excel-day-header ${mode === 'creator' ? 'clickable' : ''}`}
                  onClick={() => handleToggleDay(dateObj)}
                  title={mode === 'creator' ? 'Click to toggle entire day' : undefined}
                >
                  <div className="day-name">{formatDayHeader(dateObj)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((rowItem, rowIdx) => {
              const isLunchRow = Boolean(rowItem.isLunch);

              return (
                <tr key={rowIdx} className={isLunchRow ? 'excel-lunch-row' : ''}>
                  {/* Row Header (Module or Time Interval) */}
                  <td
                    className={`excel-time-cell ${isLunchRow ? 'lunch-cell' : ''} ${mode === 'creator' ? 'clickable' : ''}`}
                    onClick={() => handleToggleRow(rowItem)}
                    title={mode === 'creator' ? `Click to toggle ${isLunchRow ? 'lunch' : `Módulo ${rowItem.module}`} for all days` : undefined}
                  >
                    {isUniSchedule ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
                        <span style={{ fontWeight: 700, color: isLunchRow ? '#d97706' : 'var(--primary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          {isLunchRow && <Utensils size={11} />}
                          {rowItem.module}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: isLunchRow ? 'inherit' : 'var(--text-muted)' }}>
                          {rowItem.startTime} - {rowItem.endTime}
                        </span>
                      </div>
                    ) : (
                      <span>{rowItem.startTime}</span>
                    )}
                  </td>

                  {/* 7 Day Column Cells */}
                  {weekDates.map((dateObj, colIdx) => {
                    const startIso = getSlotKey(dateObj, rowItem.startTime);
                    const isSelectedInCreator = mode === 'creator' && selectedMap.has(startIso);
                    const existingSlot = (mode === 'booker' || mode === 'viewer') ? selectedMap.get(startIso) : null;
                    const isAvailableInBooker = existingSlot && !existingSlot.isBooked;
                    const isBooked = existingSlot && existingSlot.isBooked;
                    const isSelectedInBooker = selectedSlot?.id === existingSlot?.id;

                    let cellClass = 'excel-slot-cell';
                    if (isLunchRow) cellClass += ' cell-lunch-slot';
                    if (isSelectedInCreator) cellClass += ' cell-selected';
                    if (isAvailableInBooker) cellClass += ' cell-available';
                    if (isBooked) cellClass += ' cell-booked';
                    if (isSelectedInBooker) cellClass += ' cell-active-booking';

                    return (
                      <td
                        key={colIdx}
                        className={cellClass}
                        onClick={() => handleCellClick(dateObj, rowItem)}
                        title={`${isLunchRow ? 'Almuerzo' : `Módulo ${rowItem.module}`} (${rowItem.startTime} - ${rowItem.endTime})`}
                      >
                        {/* Creator mode active indicator */}
                        {isSelectedInCreator && (
                          <div className="cell-content active-badge">
                            <Check size={12} strokeWidth={3} />
                            <span>{isLunchRow ? '🍽️ Almuerzo' : (isUniSchedule ? `Mod ${rowItem.module}` : 'Open')}</span>
                          </div>
                        )}

                        {/* Booker mode available indicator */}
                        {mode === 'booker' && isAvailableInBooker && (
                          <div className="cell-content booker-badge">
                            {isSelectedInBooker ? (
                              <>
                                <CheckCircle2 size={12} />
                                <strong>Selected</strong>
                              </>
                            ) : (
                              <span>{isLunchRow ? '🍽️ Available' : 'Available'}</span>
                            )}
                          </div>
                        )}

                        {/* Booked indicator */}
                        {isBooked && (
                          <div className="cell-content booked-badge">
                            <span>Booked</span>
                          </div>
                        )}

                        {/* Viewer mode slot */}
                        {mode === 'viewer' && existingSlot && !isBooked && (
                          <div className="cell-content viewer-badge">
                            <span>{isLunchRow ? '🍽️ Almuerzo' : (isUniSchedule ? `Mod ${rowItem.module}` : 'Open')}</span>
                            {onDeleteSlot && (
                              <button
                                type="button"
                                className="cell-delete-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteSlot(existingSlot.id);
                                }}
                                title="Delete this slot"
                              >
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Down There: Available Slots Chip List */}
      <div className="excel-summary-section">
        <div className="excel-summary-header">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
            <Layers size={16} color="var(--primary)" />
            {mode === 'creator'
              ? `Configured Available Slots (${selectedSlots.length})`
              : `Total Schedule Slots (${existingSlots.length})`}
          </h4>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {isUniSchedule
              ? 'Uni Academic Modules (1h 10m + Lunch Block available)'
              : `${slotDuration} minutes per meeting slot`}
          </span>
        </div>

        {/* Selected List in Creator Mode */}
        {mode === 'creator' && (
          selectedSlots.length === 0 ? (
            <div className="excel-empty-slots">
              <CalendarIcon size={20} style={{ opacity: 0.5 }} />
              <span>Click module cells on the grid above to open available time slots for your schedule.</span>
            </div>
          ) : (
            <div className="excel-slots-chips">
              {selectedSlots.map((s, idx) => (
                <div key={idx} className="excel-slot-chip">
                  <Clock size={13} color="var(--primary)" />
                  <span>
                    <strong>{formatDate(s.startTime)}</strong>: {formatTime(s.startTime)} – {formatTime(s.endTime)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = selectedSlots.filter((_, i) => i !== idx);
                      onChangeSelectedSlots(next);
                    }}
                    className="chip-delete-btn"
                    title="Remove this slot"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {/* Existing List in Viewer/Booker Mode */}
        {(mode === 'viewer' || mode === 'booker') && (
          existingSlots.length === 0 ? (
            <div className="excel-empty-slots">
              <span>No slots available for this schedule.</span>
            </div>
          ) : (
            <div className="excel-slots-chips">
              {existingSlots.map((s) => (
                <div
                  key={s.id}
                  className={`excel-slot-chip ${s.isBooked ? 'chip-booked' : ''} ${selectedSlot?.id === s.id ? 'chip-selected' : ''}`}
                  onClick={() => mode === 'booker' && !s.isBooked && onSelectSlot(s)}
                  style={{ cursor: mode === 'booker' && !s.isBooked ? 'pointer' : 'default' }}
                >
                  <Clock size={13} color={s.isBooked ? 'var(--danger)' : 'var(--primary)'} />
                  <span>
                    <strong>{formatDate(s.startTime)}</strong>: {formatTime(s.startTime)} – {formatTime(s.endTime)}
                  </span>
                  {s.isBooked ? (
                    <span className="chip-status-tag booked">Booked</span>
                  ) : (
                    <span className="chip-status-tag available">Available</span>
                  )}
                  {mode === 'viewer' && onDeleteSlot && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSlot(s.id);
                      }}
                      className="chip-delete-btn"
                      title="Delete slot"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default WeeklyScheduleGrid;
