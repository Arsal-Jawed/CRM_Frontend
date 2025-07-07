import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaTrophy, FaUsers, FaSpinner } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import CONFIG from '../Configuration';

function TeamForm({ onClose, onTeamCreated }) {
  const [teamName, setTeamName] = useState('');
  const [leaderId, setLeaderId] = useState('');
  const [goal, setGoal] = useState('');
  const [unassignedUsers, setUnassignedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const IP = CONFIG.API_URL;

  useEffect(() => {
    setIsLoading(true);
    fetch(`${IP}/users/without-team`)
      .then(res => res.json())
      .then(data => setUnassignedUsers(data))
      .catch(err => console.error('Failed to fetch users', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!teamName || !leaderId || !goal) return;
  setIsLoading(true);
  setSuccessMsg('');

  try {
    const res = await fetch(`${IP}/teams/createTeam`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamName, leaderId, goal }),
    });

    const data = await res.json();
    if (res.ok) {
      setSuccessMsg('Team created successfully!');
      if (onTeamCreated) onTeamCreated(data.team);

      setTimeout(() => {
        onClose();
      }, 1500);
    }
  } catch (error) {
    console.error('Error creating team:', error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl w-[90%] max-w-md p-6 shadow-2xl transform transition-all duration-200 animate-slideUp">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl text-gray-400">Create New Team</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {successMsg && (
          <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-300 rounded">
            {successMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <FaUsers className="w-4 h-4 mr-2 text-clr1" />
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder="Marketing Team"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <FaUser className="w-4 h-4 mr-2 text-clr1" />
              Team Leader
            </label>
            <div className="relative">
              <select
                value={leaderId}
                onChange={(e) => setLeaderId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200 pr-10"
                required
                disabled={isLoading}
              >
                <option value="">Select a leader</option>
                {unassignedUsers.map((user) => {
                  const roleLabel = user.role === 2 ? 'Sales Closure' : user.role === 3 ? 'Lead Gen' : user.role === 1 ? 'Sales Head': 'Unknown';
                  const fullName = `${user.firstName} ${user.lastName}`;
                  return (
                    <option key={user._id} value={user._id}>
                      {fullName} ({roleLabel})
                    </option>
                  );
                })}
              </select>
              <IoIosArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <FaTrophy className="w-4 h-4 mr-2 text-clr1" />
              Team Goal
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder="Increase sales by 20%"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors duration-200 flex items-center"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-clr1 hover:bg-clr2 text-white font-medium transition-colors duration-200 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Team'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeamForm;