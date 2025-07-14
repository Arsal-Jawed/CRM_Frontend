import { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiFilter } from 'react-icons/fi';
import { TicketCard, TicketForm } from '../Components';
import CONFIG from '../Configuration';

function TicketDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [tickets, setTickets] = useState([]);

  const IP = CONFIG.API_URL;

  useEffect(() => {
    fetch(`${IP}/tickets/getTickets`)
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(err => console.error('Failed to fetch tickets:', err));
  }, [showForm]);

  const filteredTickets = tickets.filter(t =>
    (filterStatus === 'All' || t.status === filterStatus) &&
    (
      t.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.leadId?.toString().includes(searchTerm) ||
      t.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-4 md:p-6 relative z-20">
      {/* Search & Filter Bar */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client, business or lead ID..."
              className="border border-gray-200 pl-9 pr-3 py-2 outline-none rounded-lg text-sm w-full focus:ring-1 focus:ring-blue-200 focus:border-blue-200 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="border border-gray-200 pl-9 pr-3 py-2 rounded-lg text-sm w-full outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-200 appearance-none bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Tickets</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-clr1 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <FiPlus size={16} />
          Generate New Ticket
        </button>
      </div>

      {/* Ticket List Section */}
      <div className="bg-white rounded-xl shadow-inner p-4 h-[66vh] overflow-y-hidden hover:overflow-y-auto transition-all scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-2">
          {filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
              <FiSearch size={48} className="mb-4 text-gray-300" />
              <p className="text-lg">No tickets found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <TicketForm onClose={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
}

export default TicketDashboard;