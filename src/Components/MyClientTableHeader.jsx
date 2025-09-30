import React from 'react';
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';

function MyClientTableHeader({ 
  search, 
  setSearch, 
  statusFilter, 
  setStatusFilter, 
  onAddClient, 
  onGenerateTicket, 
  selectedClient 
}) {
  const role = JSON.parse(localStorage.getItem('user')).role;

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <h2 className="text-sm font-semibold text-clr1">My Clients</h2>

      <div className="flex items-center gap-2 flex-wrap flex-1 justify-end">
        {[1, 4, 5].includes(role) && (
          <button
            onClick={onAddClient}
            className="flex items-center gap-1.5 border border-clr1 text-clr1 px-3 py-1.5 rounded text-xs hover:bg-clr1 hover:text-white transition"
          >
            <FaPlus className="text-xs" />
            Add Client
          </button>
        )}

        <button
          onClick={() => {
            if (!selectedClient) return alert('Select a client first');
            onGenerateTicket();
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
            <option value="Rejected">Rejected</option>
            <option value="Buyback">Buyback</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default MyClientTableHeader;