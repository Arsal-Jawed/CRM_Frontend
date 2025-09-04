import React, { useEffect, useState, useRef } from 'react';
import { TeamMembersTable, TeamForm, EditTeamForm } from '../Components';
import TeamsHeader from '../Components/TeamsHeader';
import TeamDetails from '../Components/TeamDetails';
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

  return (
    <div className="relative z-20">
      <div className={`bg-white w-[60vw] h-[84vh] rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col gap-6 overflow-hidden transition-all ${isBlurred ? 'blur-sm pointer-events-none' : ''}`}>

        <TeamsHeader
          teams={teams}
          selectedTeam={selectedTeam}
          fetchTeamMembers={fetchTeamMembers}
          setShowEdit={setShowEdit}
          setShowDeleteConfirm={setShowDeleteConfirm}
          AddMember={AddMember}
          setShowCreate={setShowCreate}
        />

        {selectedTeam && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <TeamDetails selectedTeam={selectedTeam} />

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