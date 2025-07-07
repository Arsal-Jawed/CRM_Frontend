import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaCommentDots } from 'react-icons/fa';
import CONFIG from '../Configuration';

function CallForm({ onClose, onSave, clientId }) {
  const [dateTime, setDateTime] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem('user'));
  const caller = `${userData.firstName} ${userData.lastName}`;
  const IP = CONFIG.API_URL;

  const handleSubmit = async () => {
    if (!dateTime || !remarks) return;

    setLoading(true);

    try {
      const res = await fetch(`${IP}/calls/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          remarks,
          date: dateTime,
          caller
        })
      });

      const newCall = await res.json();
      onSave(newCall);
      onClose();
    } catch (err) {
      console.error('Call creation failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[320px] space-y-4 shadow-xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
          <FaTimes />
        </button>
        <h2 className="text-lg font-semibold text-gray-700 text-center">Add Call</h2>

        <div className="space-y-3 text-sm">
          <div>
            <label className="text-gray-600 mb-1 flex items-center gap-2">
              <FaCalendarAlt className="text-clr1" /> Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-clr1"
            />
          </div>
          <div>
            <label className="text-gray-600 mb-1 flex items-center gap-2">
              <FaCommentDots className="text-clr1" /> Remarks
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-clr1 resize-none"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1 bg-clr1 text-white text-sm rounded hover:opacity-90"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CallForm;