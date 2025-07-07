import React, { useState, useEffect } from 'react';
import CONFIG from '../Configuration';

function EditTeamForm({ team, onClose, onSave }) {
  const [teamName, setTeamName] = useState('');
  const [teamLeaderEmail, setTeamLeaderEmail] = useState('');
  const [teamGoal, setTeamGoal] = useState('');
  const [teamRating, setTeamRating] = useState(0);
  const [members, setMembers] = useState([]);

  const IP = CONFIG.API_URL;

  useEffect(() => {
    if (team) {
      setTeamName(team.teamName || '');
      setTeamLeaderEmail(team.teamLeaderEmail || '');
      setTeamGoal(team.teamGoal || '');
      setTeamRating(team.teamRating || 0);

      fetch(`${IP}/users/team-members/${team.teamId}`)
        .then(res => res.json())
        .then(data => setMembers(data))
        .catch(() => setMembers([]));
    }
  }, [team]);

  const handleSubmit = () => {
    const updated = {
      ...team,
      teamName,
      teamLeaderEmail,
      teamGoal,
      teamRating: parseFloat(teamRating)
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white w-[32vw] p-6 rounded-xl shadow-xl flex flex-col gap-4 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Edit Team Info</h2>

        <div>
          <label className="text-sm text-gray-600">Team Name</label>
          <input
            type="text"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Team Leader</label>
          <select
            value={teamLeaderEmail}
            onChange={e => setTeamLeaderEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
          >
            {members.length > 0 ? (
              members.map(m => (
                <option key={m.email} value={m.email}>{m.name}</option>
              ))
            ) : (
              <option value="">No members available</option>
            )}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Team Goal</label>
          <textarea
            value={teamGoal}
            onChange={e => setTeamGoal(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Team Rating</label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={teamRating}
            onChange={e => setTeamRating(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-clr1 text-white rounded hover:opacity-90 text-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

export default EditTeamForm;