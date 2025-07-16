import React, { useState } from 'react';
import { FaSearch, FaFilter, FaPlus, FaStar } from 'react-icons/fa';
import { TicketForm,ClientForm } from './index';

function MyClientTable({ clients, onSelect }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddClientForm, setShowAddClientForm] = useState(false);

  const role = JSON.parse(localStorage.getItem('user')).role;

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.person_name?.toLowerCase().includes(search.toLowerCase()) ||
      client.business_name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      client.sale?.approvalStatus === statusFilter ||
      (statusFilter === 'Declined' && client.status === 'lost');

    return matchesSearch && matchesStatus;
  });

  const onComplete = () => setShowAddClientForm(false);

  const getBadge = (status) => {
    const map = {
      Approved: 'bg-green-100 text-green-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      Activated: 'bg-blue-100 text-blue-700',
      Declined: 'bg-red-100 text-red-700',
      Submitted: 'bg-indigo-100 text-indigo-700',
      Lost: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${map[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`text-[10px] ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };
  
  return (
    <>
      <div className="bg-white shadow-md h-[82vh] rounded-lg border border-gray-200 p-3 space-y-2 overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-[60%]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-semibold text-clr1">My Clients</h2>

          <div className="flex items-center gap-2 flex-wrap flex-1 justify-end">
            {[1, 4, 5].includes(role) && (
            <button
              onClick={() => setShowAddClientForm(true)}
              className="flex items-center gap-1.5 border border-clr1 text-clr1 px-3 py-1.5 rounded text-xs hover:bg-clr1 hover:text-white transition"
            >
              <FaPlus className="text-xs" />
              Add Client
            </button>
          )}

          <button
            onClick={() => {
              if (!selectedClient) return alert('Select a client first');
              setShowTicketForm(true);
            }}
            className="flex items-center gap-1.5 bg-clr1 text-white px-3 py-1.5 rounded text-xs hover:bg-orange-600 transition"
          >
            <FaPlus className="text-xs" />
            Generate Ticket
          </button>
            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[10vw] pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-2.5 text-gray-400 text-xs" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-[10vw] pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-300"
              >
                <option value="all">All</option>
                <option value="Pending">Pending</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Activated">Activated</option>
                <option value="Declined">Declined</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>
        </div>
       <div className="max-h-[68vh] overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="min-w-full text-[11px] divide-y divide-gray-200 select-none">
          <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-2 py-2 text-left">#</th>
              <th className="px-2 py-2 text-left">Name</th>
              <th className="px-2 py-2 text-left">Email</th>
              <th className="px-2 py-2 text-left">Business Email</th>
              <th className="px-2 py-2 text-left">Contact</th>
              <th className="px-2 py-2 text-left">Rating</th>
              <th className="px-2 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-800 divide-y divide-gray-100">
            {filteredClients.map((client, index) => (
              <tr
                key={client._id}
                className="hover:bg-gray-50 transition cursor-pointer"
                onClick={() => {
                  setSelectedClient(client);
                  onSelect(client);
                }}
              >
                <td className="px-2 py-2">{index + 1}</td>
                <td className="px-2 py-2">
                  <div className="font-medium">{client.person_name}</div>
                  <div className="text-[10px] text-gray-500">{client.business_name}</div>
                </td>
                <td className="px-2 py-2">{client.personal_email}</td>
                <td className="px-2 py-2">{client.business_email || '-'}</td>
                <td className="px-2 py-2">{client.contact}</td>
                <td className="px-2 py-2 flex gap-[2px]">{renderStars(client.rating || 0)}</td>
                <td className="px-2 py-2">
                  {getBadge(client.sale?.approvalStatus || (client.status === 'lost' ? 'Lost' : 'Pending'))}
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">No clients found</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {showTicketForm && selectedClient && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-lg w-full relative shadow-lg">
            <button
              onClick={() => setShowTicketForm(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-lg"
            >
              ✕
            </button>
            <TicketForm
              onClose={() => setShowTicketForm(false)}
              prefill={{
                clientId: selectedClient._id,
                clientName: selectedClient.person_name,
                businessName: selectedClient.business_name,
                lead_id: selectedClient.lead_id
              }}
            />
          </div>
        </div>
      )}
      {showAddClientForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-lg w-full relative shadow-lg">
            <button
              onClick={() => setShowAddClientForm(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-lg"
            >
              ✕
            </button>
            <ClientForm onClose={() => setShowAddClientForm(false)} onComplete={onComplete}/>
          </div>
        </div>
      )}
    </>
  );
}

export default MyClientTable;