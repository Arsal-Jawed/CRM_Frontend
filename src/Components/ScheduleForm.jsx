import React, { useState } from 'react';
import CONFIG from '../Configuration';

function ScheduleForm({ onClose, onCreate }) {
  const [details, setDetails] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const IP = CONFIG.API_URL;

const handleSubmit = () => {
  if (!scheduleDate) {
    setSuccessMsg('Please select a schedule date.');
    return;
  }

  const selected = new Date(scheduleDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selected < today) {
    setSuccessMsg('You cannot select a past date.');
    return;
  }

  const data = {
    scheduler: JSON.parse(localStorage.getItem('user')).email,
    details,
    schedule_date: scheduleDate,
    is_public: isPublic ? 1 : 0
  };

  fetch(`${IP}/schedules/createSchedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => {
      setSuccessMsg('Schedule created successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        onCreate();
        onClose();
      }, 1200);
    });
};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-30">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow space-y-4 border">
        <h2 className="text-xl font-semibold text-clr1">Create Schedule</h2>

        <input
          type="text"
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <input
          type="date"
          value={scheduleDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setScheduleDate(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none"
        />

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Public
        </label>

        {successMsg && (
          <div className="text-green-600 text-sm font-medium bg-green-50 border border-green-200 p-2 rounded">
            {successMsg}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 hover:bg-gray-300 text-sm border rounded">Cancel</button>
          <button onClick={handleSubmit} className="bg-clr1 hover:bg-[#db5f25] text-white px-4 py-2 rounded">Create</button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleForm;