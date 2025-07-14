import React from 'react';
import { FaCheck, FaBell } from 'react-icons/fa';
import CONFIG from '../Configuration';

const NotificationCard = ({ message, timestamp, scheduleId, scheduleDate, onMark }) => {
  const IP = CONFIG.API_URL;
  const todayStr = new Date().toISOString().slice(0, 10);
  const isMissed = scheduleDate < todayStr;

  const handleMark = () => {
    fetch(`${IP}/schedules/${scheduleId}/mark`, {
      method: 'PATCH'
    })
      .then(res => res.json())
      .then(() => onMark(scheduleId))
      .catch(err => console.error('Failed to mark schedule:', err));
  };

  return (
    <div className={`rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4 flex items-center gap-4 w-full max-w-md hover:-translate-y-0.5
      ${isMissed ? 'bg-red-100 border border-red-300' : 'bg-white'}`}>
      <div className={`${isMissed ? 'bg-red-500' : 'bg-clr1'} rounded-full p-3 flex items-center justify-center`}>
        <FaBell className="text-white text-xl" />
      </div>

      <div className="flex-1">
        <p className="text-gray-800 font-medium text-base">{message}</p>
        <p className="text-gray-600 text-sm mt-1">{timestamp || 'Just now'}</p>
      </div>

      <button
        onClick={handleMark}
        className="bg-green-200 hover:bg-green-300 rounded-lg p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        aria-label="Mark as done"
      >
        <FaCheck className="text-green-600 text-lg" />
      </button>
    </div>
  );
};

export default NotificationCard;