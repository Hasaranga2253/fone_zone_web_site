// src/components/Calendar.js
import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Event දත්ත (Demo)
  const events = [
    { id: 1, title: 'iPhone 15 Launch', date: new Date(2025, 7, 10), description: 'අලුත් iPhone Launch අවස්ථාව' },
    { id: 2, title: 'Black Friday Sale', date: new Date(2025, 10, 29), description: 'වර්ෂයේ විශාලතම විකුණුම' },
    { id: 3, title: 'Repair Workshop', date: new Date(2025, 8, 15), description: 'නිදහස් ජංගම යන්ත්‍ර අලුත්වැඩියා වැඩමුළුව' },
  ];

  // Month Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // පසුගිය මාසයේ දින
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="text-gray-500 p-2 text-center">
          {prevMonthDays - i}
        </div>
      );
    }

    // මේ මාසයේ දින
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const hasEvent = events.some(
        (event) =>
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear()
      );

      const isSelected =
        selectedDate &&
        selectedDate.getDate() === date.getDate() &&
        selectedDate.getMonth() === date.getMonth() &&
        selectedDate.getFullYear() === date.getFullYear();

      days.push(
        <div
          key={`current-${i}`}
          onClick={() => setSelectedDate(date)}
          className={`p-2 text-center rounded-lg cursor-pointer transition-colors ${
            isSelected
              ? 'bg-blue-600 text-white'
              : hasEvent
              ? 'bg-indigo-500/20 hover:bg-indigo-500/40'
              : 'hover:bg-gray-700'
          }`}
        >
          {i}
          {hasEvent && <div className="w-1 h-1 bg-indigo-400 rounded-full mx-auto mt-1"></div>}
        </div>
      );
    }

    return days;
  };

  const getEventsForDate = () => {
    if (!selectedDate) return [];
    return events.filter(
      (event) =>
        event.date.getDate() === selectedDate.getDate() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
         Shop Events
        </h2>
        <div className="flex items-center gap-3">
          <button onClick={goToPreviousMonth} className="p-1 rounded-full hover:bg-gray-700">
            <FaChevronLeft />
          </button>
          <h3 className="text-sm font-medium">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={goToNextMonth} className="p-1 rounded-full hover:bg-gray-700">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-gray-400 text-xs font-medium mb-3">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

      {/* Event List */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <h3 className="text-sm font-semibold mb-2">
            Events on {selectedDate.toLocaleDateString()}
          </h3>
          {getEventsForDate().length > 0 ? (
            getEventsForDate().map((event) => (
              <div key={event.id} className="bg-gray-700/40 p-3 rounded-lg border border-gray-600 mb-2">
                <h4 className="font-bold text-blue-300 text-sm">{event.title}</h4>
                <p className="text-gray-400 text-xs">{event.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-xs">No events this day</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Calendar;
