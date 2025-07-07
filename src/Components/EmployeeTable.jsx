import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaUserTie, FaHandshake, FaUserFriends,FaCogs } from 'react-icons/fa';
import CONFIG from '../Configuration';
import { EmployeeForm,EditUserForm} from './index';

const roleIcons = {
  1: <FaUserTie className="text-blue-500" />,
  2: <FaHandshake className="text-green-500" />,
  3: <FaUserFriends className="text-orange-500" />,
  4: <FaCogs className="text-purple-500" />
};

function EmployeeTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const IP = CONFIG.API_URL;

  const fetchUsers = () => {
    fetch(`${IP}/users/getAllUsers`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(console.error);
  };

  const handleDelete = async (id) => {
  const res = await fetch(`${IP}/users/deleteUser/${id}`, { method: 'DELETE' });
  if (res.ok) {
    setUsers(prev => prev.filter(user => user._id !== id));
    setConfirmDelete(null);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users
    .filter(u => filterRole ? u.role === Number(filterRole) : true)
    .filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.role !== b.role) return a.role - b.role;
      return new Date(a.joining_date) - new Date(b.joining_date);
    });

  return (
    <div className="bg-white rounded-lg h-[52vh] shadow-sm border border-gray-100 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Employee Management</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 border focus:outline-none border-gray-200 rounded-md w-full focus:ring-1 focus:ring-blue-200 focus:border-blue-300"
            />
          </div>
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-200 focus:border-blue-300"
          >
            <option value="">All Roles</option>
            <option value="1">Managers</option>
            <option value="2">Sales</option>
            <option value="3">Lead Gen</option>
            <option value="4">Operation</option>
          </select>
          <button onClick={() => setShowForm(true)}
            className="flex items-center justify-center text-xs bg-clr1 text-white px-3 py-1.5 rounded-md hover:bg-orange-700 transition-colors">
            <FaPlus className="mr-1 text-[10px]" /> Add Employee
          </button>
          {showForm && <EmployeeForm onClose={() => setShowForm(false)} />}
        </div>
      </div>

      {/* Table header */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs border-collapse">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200 text-gray-600">
              <th className="px-3 py-2 text-left font-medium w-2/5">Employee</th>
              <th className="px-3 py-2 text-left font-medium w-1/5">Role</th>
              <th className="px-3 py-2 text-left font-medium w-1/5">Designation</th>
              <th className="px-3 py-2 text-left font-medium w-1/5">Joined</th>
              <th className="px-3 py-2 text-center font-medium w-1/5">Actions</th>
            </tr>
          </thead>
        </table>

        {/* Table body with scroll */}
        <div className="max-h-[35vh] overflow-y-auto no-scrollbar">
          <table className="min-w-full text-xs border-collapse">
            <tbody className="divide-y divide-gray-100">
              {filtered.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-800 w-2/5">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        <span className="text-xs text-gray-600">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-3 py-2 w-1/5">
                    <div className="flex items-center">
                      <span className="mr-1">{roleIcons[user.role]}</span>
                      {user.role === 1 ? 'Manager' : user.role === 2 ? 'Sales' : user.role === 3 ?'Lead Gen': user.role === 4 ? 'Operation Agent': 'Unspecified'}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-600 w-1/5">{user.designation || '-'}</td>
                  <td className="px-3 py-2 text-gray-500 w-1/5">
                    {new Date(user.joining_date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                  <td className="px-3 py-2 w-1/5">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditForm(true);
                        }}
                        className="p-1 text-blue-500 hover:text-blue-700 rounded hover:bg-blue-50">
                        <FaEdit className="text-xs" />
                      </button>
                      <button onClick={() => setConfirmDelete(user)} 
                      className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50">
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-400 text-xs">
                    No employees match your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEditForm && selectedUser && (
        <EditUserForm
          userData={selectedUser}
          onClose={() => {
            setShowEditForm(false);
            setSelectedUser(null);
          }}
          reload={fetchUsers}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-[90vw] max-w-sm">
            <h2 className="text-md font-semibold text-gray-800 mb-4">
              Are you sure you want to fire <span className="text-red-600">{confirmDelete.firstName} {confirmDelete.lastName}</span> ({confirmDelete.designation || 'No Designation'})?
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="text-sm px-4 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                className="text-sm px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Fire Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeTable;