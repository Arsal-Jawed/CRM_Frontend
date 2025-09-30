import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { TicketForm, ClientForm } from './index';
import MyClientTableHeader from './MyClientTableHeader';
import MyClientTableRow from './MyClientTableRow';

function MyClientTable({ clients, onSelect }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddClientForm, setShowAddClientForm] = useState(false);

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
      <div className="bg-white shadow-md h-full rounded-lg border border-gray-200 p-3 space-y-2 overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-full">
        <MyClientTableHeader
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onAddClient={() => setShowAddClientForm(true)}
          onGenerateTicket={() => setShowTicketForm(true)}
          selectedClient={selectedClient}
        />
        
        <div className="max-h-[68vh] overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="min-w-full text-[11px] divide-y divide-gray-200 select-none">
            <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-2 py-2 text-left">#</th>
                <th className="px-2 py-2 text-left">Name</th>
                <th className="px-2 py-2 text-left">Email</th>
                <th className="px-2 py-2 text-left">Business Email</th>
                {/* <th className="px-2 py-2 text-left">Contact</th> */}
                <th className="px-2 py-2 text-left">Date</th>
                <th className="px-2 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-800 divide-y divide-gray-100">
              {filteredClients.map((client, index) => (
                <MyClientTableRow
                  key={client._id}
                  client={client}
                  index={index}
                  onSelect={onSelect}
                  setSelectedClient={setSelectedClient}
                />
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