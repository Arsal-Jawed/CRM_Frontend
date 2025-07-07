import React, { useState } from 'react';
import { FaCalendarAlt, FaTimes, FaSave, FaAlignLeft } from 'react-icons/fa';
import CONFIG from '../Configuration';

function EditScheduleForm({ schedule, onClose, onSave }) {
  const [details, setDetails] = useState(schedule.details || '');
  const [scheduleDate, setScheduleDate] = useState(schedule.schedule_date);

  const IP = CONFIG.API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      details,
      schedule_date: scheduleDate,
    };

    const res = await fetch(`${IP}/schedules/editSchedule/${schedule.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });

    if (res.ok) {
      const updated = await res.json();
      onSave(updated);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-clr1 text-white">
              <FaCalendarAlt size={18} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Edit Schedule</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Details</label>
            <div className="relative">
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Add schedule details..."
                className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-clr1 focus:border-clr1 outline-none transition-all pl-10 resize-none"
                rows="3"
                required
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FaAlignLeft />
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Date & Time</label>
            <input
              type="datetime-local"
              value={scheduleDate.slice(0, 16)}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-clr1 focus:border-clr1 outline-none transition-all"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-clr1 to-clr2 text-white hover:opacity-90 transition-opacity font-medium flex items-center gap-2"
            >
              <FaSave size={14} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditScheduleForm;