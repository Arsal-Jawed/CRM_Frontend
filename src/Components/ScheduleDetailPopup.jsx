import React from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaEye, FaLock, FaInfoCircle } from 'react-icons/fa';
import { format } from 'date-fns';

function ScheduleDetailPopup({ schedule, onClose }) {
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return {
      date: format(date, "MMMM d, yyyy"),
      time: format(date, "h:mm a"),
      full: format(date, "EEEE, MMMM d, yyyy 'at' h:mm a")
    };
  };

  const scheduled = formatDateTime(schedule.schedule_date);
  const created = formatDateTime(schedule.set_date);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-clr1/10 text-clr1">
              <FaCalendarAlt size={18} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Schedule Details</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <FaInfoCircle className="text-gray-400" />
              {schedule.details}
            </h3>
            {schedule.description && (
              <p className="text-gray-600 text-sm pl-7">{schedule.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Scheduled Date</p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaCalendarAlt className="text-gray-400" />
                {scheduled.date}
              </p>
              <p className="flex items-center gap-2 text-gray-700 pl-6">
                <FaClock className="text-gray-400" />
                {scheduled.time}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Created On</p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaCalendarAlt className="text-gray-400" />
                {created.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {schedule.is_public ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FaEye size={12} />
                Public
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <FaLock size={12} />
                Private
              </span>
            )}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-clr1 text-white rounded-lg hover:bg-clr1/90 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleDetailPopup;