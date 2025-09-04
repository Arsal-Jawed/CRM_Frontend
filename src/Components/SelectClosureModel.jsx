import React, { useEffect, useState } from 'react';
import CONFIG from '../Configuration';
import { FaUserPlus } from 'react-icons/fa';

function SelectClosureModel({ onClose, lead }) {
  const [users, setUsers] = useState([]);
  const [closure1, setClosure1] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const IP = CONFIG.API_URL;
  const leadId = lead?._id;

  useEffect(() => {
    fetch(`${IP}/users/getAllUsers`)
      .then(res => res.json())
      .then(data => {
        const filtered = data
          .filter(user => user.role === 1 || user.role === 2 || user.role === 6)
          .sort((a, b) => {
            if (a.role !== b.role) return a.role - b.role; // role wise sort
            const nameA = (a.firstName + ' ' + a.lastName).toLowerCase();
            const nameB = (b.firstName + ' ' + b.lastName).toLowerCase();
            return nameA.localeCompare(nameB); // name wise sort
          });
        setUsers(filtered);
      });
  }, []);

  useEffect(() => {
    if (lead?.closure1) {
      const user1 = users.find(u => u.email === lead.closure1);
      if (user1) setClosure1(user1._id);
    }
  }, [lead, users]);

  const handleAssign = async () => {
    if (!closure1) {
      setErrorMsg('Please select Closure 1');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${IP}/leads/setClosure/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ closure1 })
      });
      if (res.ok) {
        setErrorMsg('');
        setShowSuccess(true);
      } else {
        setErrorMsg('Failed to assign closure');
      }
    } catch (err) {
      console.error('Error assigning closure:', err);
      setErrorMsg('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-30">
      {!showSuccess ? (
        <div className="bg-white rounded-xl shadow-2xl p-8 w-[95%] max-w-lg space-y-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <FaUserPlus className="text-clr1 text-xl" />
            <h2 className="text-2xl font-semibold text-gray-800">Select Closure</h2>
          </div>

          {errorMsg && (
            <div className="text-sm text-red-500 font-medium">{errorMsg}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Select Closure</label>
            <select
              value={closure1}
              onChange={(e) => setClosure1(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-clr1 transition-all"
            >
              <option value="">-- Choose User --</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.firstName + ' ' + user.lastName} ({user.role === 1 ? 'Admin' : 'Sales'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={loading}
              className="bg-clr1 text-white px-5 py-2 text-sm rounded shadow hover:bg-clr1/90 transition flex items-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-2xl p-8 w-[90%] max-w-sm space-y-6 border border-green-200 text-center">
          <h2 className="text-xl font-semibold text-green-700">Closure Assigned Successfully!</h2>
          <button
            onClick={onClose}
            className="bg-clr1 text-white px-6 py-2 rounded hover:bg-clr1/90 transition"
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}

export default SelectClosureModel;