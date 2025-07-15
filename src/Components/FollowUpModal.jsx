import React, { useState } from 'react';
import CONFIG from '../Configuration';

function FollowUpModal({ lead, onClose, onScheduled }) {
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSchedule = async () => {
    const scheduler = JSON.parse(localStorage.getItem('user')).email;
    const details = `Follow-up with ${lead.person_name} (${lead.business_name})`;

    const res = await fetch(`${CONFIG.API_URL}/schedules/createSchedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheduler,
        details,
        schedule_date: date,
        visibility: 'private'
      }),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onScheduled();
      }, 2000);
    } else {
      alert('Failed to create schedule');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow space-y-4 w-[90%] max-w-sm">
        <h2 className="text-base font-semibold text-clr1">Schedule Next Follow-up</h2>
        <p className="text-sm text-gray-600">Client: {lead.person_name}</p>

        {success && (
          <div className="text-green-600 text-sm bg-green-100 border border-green-300 px-3 py-2 rounded">
            Follow-up scheduled successfully
          </div>
        )}

        <input
          type="date"
          value={date}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-sm text-gray-500">Cancel</button>
          <button
            onClick={handleSchedule}
            className="bg-clr1 text-white px-4 py-1.5 rounded text-sm hover:bg-orange-600"
            disabled={!date || success}
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default FollowUpModal;