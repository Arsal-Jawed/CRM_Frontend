import React, { useState } from 'react';
import { FiUsers, FiTrash2 } from 'react-icons/fi';
import { FaUserShield } from 'react-icons/fa';

function TeamMembersTable({ members, focusedRow, tableRef, onFocusRow, onMakeLeader, onRemove }) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <FiUsers className="text-clr1" />
            Team Members ({members.length})
          </h3>
        </div>

        <div className="overflow-hidden flex-1 relative">
          <div className="absolute inset-0 overflow-y-auto scrollbar-hidden" ref={tableRef}>
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-600 text-sm sticky top-0">
                <tr>
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">Role</th>
                  <th className="p-3 text-left font-medium">Email</th>
                  <th className="p-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.length > 0 ? (
                  members.map((m, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-gray-50 transition-colors ${focusedRow === idx ? 'bg-blue-50' : ''}`}
                      tabIndex={0}
                      onFocus={() => onFocusRow(idx)}
                    >
                      <td className="p-3 text-[0.8vw] text-gray-800">{m.name}</td>
                      <td className="p-3 text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 text-[0.8vw] rounded-full">
                       {m.role === 2 ? 'Sales Closure' : m.role === 3 ? 'Lead Gen' : 'Admin'}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 text-[0.8vw]">{m.email}</td>
                      <td className="p-3 text-right flex gap-3 justify-end">
                        <button
                          onClick={() => onMakeLeader(m)}
                          className="text-gray-400 hover:text-gray-500"
                          title="Make Team Leader"
                        >
                          <FaUserShield size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setMemberToRemove(m);
                            setShowRemoveConfirm(true);
                          }}
                          className="text-red-500 hover:text-red-600"
                          title="Remove from Team"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-400">
                      No members in this team yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showRemoveConfirm && memberToRemove && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[24vw] p-6 rounded-xl shadow-xl border border-gray-200 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Removal</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove <strong>{memberToRemove.name}</strong> from the team?
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setMemberToRemove(null);
                }}
                className="px-4 py-2 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRemove(memberToRemove);
                  setShowRemoveConfirm(false);
                  setMemberToRemove(null);
                }}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TeamMembersTable;