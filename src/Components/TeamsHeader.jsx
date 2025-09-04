import React from 'react';
import { FiEdit, FiTrash2, FiPlus, FiChevronDown } from 'react-icons/fi';
import { FaUserPlus } from 'react-icons/fa';

function TeamsHeader({ 
  teams, 
  selectedTeam, 
  fetchTeamMembers, 
  setShowEdit, 
  setShowDeleteConfirm, 
  AddMember, 
  setShowCreate 
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="relative w-[16vw]">
        <select
          value={String(selectedTeam?.teamId || '')}
          onChange={e => {
            const teamId = e.target.value;
            const t = teams.find(t => String(t.teamId) === teamId);
            if (t) fetchTeamMembers(t);
          }}
          className="appearance-none w-full border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
        >
          {teams.map(t => (
            <option key={t.teamId} value={String(t.teamId)}>{t.teamName}</option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      <div className="flex gap-3">
        <button onClick={() => setShowEdit(true)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-clr1 px-3 py-2 rounded-lg hover:bg-gray-50">
          <FiEdit size={16} /> Edit
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 text-sm text-red-600 hover:text-white px-3 py-2 rounded-lg bg-red-100 hover:bg-red-600">
          <FiTrash2 size={16} /> Delete
        </button>
        <button onClick={AddMember} className="flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-lg shadow hover:bg-gray-200">
          <FaUserPlus size={16} /> Add Member
        </button>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-gradient-to-r from-clr1 to-clr2 text-white px-4 py-2 rounded-lg shadow hover:opacity-90">
          <FiPlus size={16} /> Create Team
        </button>
      </div>
    </div>
  );
}

export default TeamsHeader;