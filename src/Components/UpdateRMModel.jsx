import React, { useState, useEffect } from 'react';
import CONFIG from '../Configuration';
import { X, Users, Save, RotateCcw, User } from 'lucide-react';

function UpdateRMModal({ client, onClose, onSuccess }) {
  const [selectedUser, setSelectedUser] = useState(client?.rm || '');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${CONFIG.API_URL}/users/getAllUsers`);
        const data = await res.json();
        
        if (res.ok) {
          // Filter users with role 5 or 6 and map to include full name
          const filteredUsers = data
            .filter(user => user.role === 4 || user.role === 5)
            .map(user => ({
              ...user,
              fullName: `${user.firstName} ${user.lastName}`.trim()
            }));
          setUsers(filteredUsers);
        } else {
          alert('Failed to load users');
        }
      } catch (err) {
        alert('Error loading users');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${CONFIG.API_URL}/sales/updateRM/${client.lead_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rm: selectedUser })
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess(data.sale);
        onClose();
      } else {
        alert(data.message || 'Failed to update RM');
      }
    } catch (err) {
      alert('Error updating RM');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="bg-gradient-to-r from-clr1 to-clr2 rounded-t-2xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-1 rounded-full transition-colors duration-200"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Update Relationship Manager</h2>
              <p className="text-white/80 text-sm mt-1">Assign a new RM for {client?.name || 'this client'}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User size={16} className="text-clr1" />
              Select Relationship Manager
            </label>
            
            {loadingUsers ? (
              <div className="flex items-center justify-center py-4">
                <RotateCcw size={20} className="animate-spin text-clr1" />
                <span className="ml-2 text-gray-600">Loading users...</span>
              </div>
            ) : (
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-clr1 focus:ring-2 focus:ring-clr1/20 transition-all duration-200 appearance-none bg-white cursor-pointer"
                required
              >
                <option value="">Select a Relationship Manager</option>
                {users.map((user) => (
                  <option 
                    key={user.id} 
                    value={user.fullName}
                    className="py-2"
                  >
                    {user.fullName}
                  </option>
                ))}
              </select>
            )}
            
            {!loadingUsers && (
              <p className="text-xs text-gray-500 mt-2">
                {users.length} relationship managers available
              </p>
            )}
          </div>

          {selectedUser && (
            <div className="bg-gradient-to-r from-clr1/10 to-clr2/10 border border-clr1/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-clr1/20 p-2 rounded-lg">
                  <User size={16} className="text-clr1" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Selected RM:</p>
                  <p className="text-lg font-semibold text-clr2">{selectedUser}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 font-medium"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedUser.trim() || loadingUsers}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-clr1 to-clr2 text-white hover:from-clr1/90 hover:to-clr2/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <RotateCcw size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update RM
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateRMModal;