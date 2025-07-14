import React, { useEffect, useState, useRef } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiChevronDown } from 'react-icons/fi';
import { FaUserTie, FaBullseye, FaStar as FaSolidStar,FaUserPlus } from 'react-icons/fa';
import { TeamMembersTable, TeamForm, EditTeamForm } from '../Components';
import CONFIG from '../Configuration';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [focusedRow, setFocusedRow] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  const tableRef = useRef(null);
  const IP = CONFIG.API_URL;
  const isBlurred = showCreate || showEdit || showDeleteConfirm;

  const fetchTeamMembers = team => {
    setSelectedTeam(team);
    setFocusedRow(null);
    fetch(`${IP}/users/team-members/${team.teamId}`)
      .then(r => r.json())
      .then(setMembers)
      .catch(() => setMembers([]));
  };

  const AddMember = () => {
    setShowAddMember(true);
    fetch(`${IP}/users/without-team`)
    .then(r => r.json())
    .then(setAvailableUsers)
    .catch(() => setAvailableUsers([]));
  }

  const handleTeamDelete = () => {
    fetch(`${IP}/teams/delete/${selectedTeam.teamId}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => {
        setTeams(prev => {
          const updated = prev.filter(t => t.teamId !== selectedTeam.teamId);
          if (updated.length) fetchTeamMembers(updated[0]);
          else {
            setSelectedTeam(null);
            setMembers([]);
          }
          return updated;
        });
        setShowDeleteConfirm(false);
      })
      .catch(() => setShowDeleteConfirm(false));
  };

  useEffect(() => {
    fetch(`${IP}/teams/getAllTeams`)
      .then(r => r.json())
      .then(data => {
        setTeams(data);
        if (data.length) fetchTeamMembers(data[0]);
      });
  }, []);

  const renderStars = rating => {
    const full = Math.floor(rating || 0);
    const hasHalf = (rating || 0) % 1 >= 0.5;
    return Array(5).fill().map((_, i) => (
      <FaSolidStar
        key={i}
        className={`text-${i < full ? 'yellow' : 'gray'}-400 ${i === full && hasHalf ? 'opacity-50' : ''}`}
      />
    ));
  };

  return (
    <div className="relative z-20">
      <div className={`bg-white w-[60vw] h-[84vh] rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col gap-6 overflow-hidden transition-all ${isBlurred ? 'blur-sm pointer-events-none' : ''}`}>

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

        {selectedTeam && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-clr1/5 to-white p-6 rounded-xl border border-gray-100 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedTeam.teamName}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaUserTie className="text-clr1 mr-2" />
                      <span>Leader: {selectedTeam.TeamLeaderName}</span>
                    </div>
                    <div className="flex items-center">
                      <FaBullseye className="text-clr1 mr-2" />
                      <span>{selectedTeam.teamGoal}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    {renderStars(selectedTeam.teamRating)}
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {(selectedTeam.teamRating || 0).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Team Rating</span>
                </div>
              </div>
            </div>

            <TeamMembersTable
              members={members.filter(m => m.id !== selectedTeam?.TeamLeader)}
              tableRef={tableRef}
              focusedRow={focusedRow}
              onFocusRow={setFocusedRow}
              onMakeLeader={member => {
                fetch(`${IP}/teams/changeLeader/${selectedTeam.teamId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ newLeader: member.email })
                })
                  .then(r => r.json())
                  .then(fetchTeamMembers)
                  .catch(console.error);
              }}
              onRemove={member => {
              fetch(`${IP}/teams/removeMember`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: member.email })
              })
                .then(() => fetchTeamMembers(selectedTeam))
                .catch(console.error);
            }}
            />
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <TeamForm
            onClose={() => setShowCreate(false)}
            onTeamCreated={newTeam => {
              setTeams(prev => [...prev, newTeam]);
              fetchTeamMembers(newTeam);
              setShowCreate(false);
            }}
          />
        </div>
      )}

      {showEdit && selectedTeam && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <EditTeamForm
            team={selectedTeam}
            onClose={() => setShowEdit(false)}
            onSave={updated => {
              fetch(`${IP}/teams/updateTeam/${updated.teamId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
              })
                .then(res => res.json())
                .then(data => {
                  setTeams(prev => prev.map(t => t.teamId === data.teamId ? data : t));
                  fetchTeamMembers(data);
                  setShowEdit(false);
                })
                .catch(err => {
                  console.error('Failed to update team:', err);
                  setShowEdit(false);
                });
            }}
          />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-[26vw] p-6 rounded-xl shadow-xl border border-gray-200 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the team <strong>{selectedTeam?.teamName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleTeamDelete}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddMember && (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-white w-[24vw] p-6 rounded-xl shadow-xl border border-gray-200 flex flex-col gap-4">
      <h2 className="text-lg text-gray-500">Add Member to Team</h2>

      <select
        value={selectedUser}
        onChange={e => setSelectedUser(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none"
      >
        <option value="">Select a user</option>
        {availableUsers.map(u => (
          <option key={u._id} value={u.email}>
          {u.firstName + ' ' + u.lastName} - {u.role === 2 ? 'Sales Closure' : u.role === 3 ? 'Lead Gen' : 'Support'}
        </option>
        ))}
      </select>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => {
            setShowAddMember(false);
            setSelectedUser('');
          }}
          className="px-4 py-2 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (!selectedUser || !selectedTeam) return;
            fetch(`${IP}/teams/assignTeam`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userEmail: selectedUser,
                teamId: selectedTeam.teamId
              })
            })
              .then(() => {
                fetchTeamMembers(selectedTeam);
                setSelectedUser('');
                setShowAddMember(false);
              })
              .catch(console.error);
          }}
          className="px-4 py-2 text-sm rounded bg-clr1 text-white hover:opacity-90"
        >
          Add Member
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Teams;