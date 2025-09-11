import React from 'react';
import { FaSearch, FaPlus, FaFilter, FaUserTimes } from 'react-icons/fa';

function FollowUpTableHeader({ 
  showVerifyPopup, 
  setShowVerifyPopup, 
  setShowForm, 
  selectedLead, 
  email, 
  setShowClosureModal, 
  setToast, 
  search, 
  setSearch, 
  statusFilter, 
  setStatusFilter,
  leads
}) {
  const today = new Date().toISOString().split("T")[0];
  const todayFollowupsCount = leads.filter(
    (lead) => lead.followupDate && lead.followupDate.split("T")[0] === today
  ).length;

  return (
    <div className="flex flex-row items-center justify-center flex-wrap gap-1">
      <h2 className="text-base font-semibold text-clr1">
        Follow Ups ({todayFollowupsCount})
      </h2>

      <div className="flex items-center gap-3 flex-wrap flex-1 justify-end">
        <button
          onClick={() => setShowVerifyPopup(true)}
          className="flex items-center gap-2 bg-blue-400 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700 transition"
        >
          <FaSearch className="text-xs" />
          Verify Lead
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-clr1 text-white px-3 py-1.5 rounded text-xs hover:bg-orange-600 transition"
        >
          <FaPlus className="text-xs" />
          New Lead
        </button>
        {selectedLead?.closure1 === email && (
          <button
            onClick={() => {
              if (!selectedLead) {
                setToast('Select a client first');
                setTimeout(() => setToast(''), 3000);
                return;
              }
              setShowClosureModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-800 to-blue-400 text-white px-3 py-1.5 rounded text-xs hover:from-blue-900 hover:to-blue-500 transition"
          >
            <FaUserTimes className="text-sm" />
            Give Up Lead
          </button>
        )}

        <div className="relative min-w-[100px]">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-clr1"
          />
        </div>

        <div className="relative w-[160px]">
          <FaFilter className="absolute left-3 top-2.5 text-gray-400 text-xs" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-clr1"
          >
            <option value="all">All</option>
            <option value="in process">In Process</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="today">Today's Followup</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FollowUpTableHeader;