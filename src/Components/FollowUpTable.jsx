import React, { useEffect, useState } from 'react';
import { FaSearch, FaFilter, FaPlus, FaCalendarPlus, FaEdit,FaSpinner } from 'react-icons/fa';
import CONFIG from '../Configuration';
import { LeadForm, FollowUpModal,LeadEditForm } from './index.js';

function FollowUpTable({ onSelectClient, setCalls }) {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);

  const email = JSON.parse(localStorage.getItem('user')).email;
  const IP = CONFIG.API_URL;

 useEffect(() => {
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${IP}/leads/getByClosure/${email}`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchLeads();
}, []);

  const handleClick = async (client) => {
    onSelectClient(client);
    try {
      const response = await fetch(`${CONFIG.API_URL}/calls/client/${client._id}`);
      const data = await response.json();
      setCalls(data);
    } catch (error) {
      console.error('Failed to fetch calls:', error);
      setCalls([]);
    }
  };

  const filtered = leads
    .filter(lead =>
      (lead.person_name || '').toLowerCase().includes(search.toLowerCase())
    )
    .filter(lead =>
      statusFilter === 'all' ? true : lead.status === statusFilter
    );

  const getBadge = (status) => {
    const map = {
      'in process': 'bg-yellow-100 text-yellow-700',
      'won': 'bg-green-100 text-green-700',
      'lost': 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white shadow-md h-[42vh] rounded-lg border border-gray-200 p-4 space-y-3 overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">

      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-base font-semibold text-clr1">Follow Ups</h2>

        <div className="flex items-center gap-3 flex-wrap flex-1 justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-clr1 text-white px-3 py-1.5 rounded text-xs hover:bg-orange-600 transition"
          >
            <FaPlus className="text-xs" />
            Create New Lead
          </button>

          <div className="relative min-w-[200px]">
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
            </select>
          </div>
        </div>
      </div>
     <div className="overflow-hidden hover:overflow-y-auto max-h-[26vh] hover:scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <table className="min-w-full text-xs divide-y divide-gray-200 select-none">
        <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-semibold">
          <tr>
            <th className="px-2 py-2 text-left">#</th>
            <th className="px-2 py-2 text-left">Name</th>
            <th className="px-2 py-2 text-left">Email</th>
            <th className="px-2 py-2 text-left">Contact</th>
            <th className="px-2 py-2 text-left">Status</th>
            <th className="px-2 py-2 text-left">Date</th>
            <th className="px-2 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white text-gray-800 divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-6">
                <FaSpinner className="animate-spin text-clr1 text-lg mx-auto" />
              </td>
            </tr>
          ) : (
            <>
              {filtered.map((lead, index) => (
                <tr key={lead._id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => handleClick(lead)} tabIndex={0}>
                  <td className="px-2 py-2">{index + 1}</td>
                  <td className="px-2 py-2">
                    <div className="font-medium">{lead.person_name}</div>
                    <div className="text-[10px] text-gray-500">{lead.business_name}</div>
                  </td>
                  <td className="px-2 py-2">{lead.personal_email}</td>
                  <td className="px-2 py-2">{lead.contact}</td>
                  <td className="px-2 py-2">{getBadge(lead.status)}</td>
                  <td className="px-2 py-2">{lead.date}</td>
                  <td className="px-2 py-2 flex gap-2 items-center">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }} className="text-clr1 hover:text-orange-700" title="Schedule Follow-up">
                      <FaCalendarPlus />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setEditLead(lead); }} className="text-blue-500 hover:text-blue-700" title="Edit Lead">
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-400">No leads found</td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
      {showForm && (
        <LeadForm
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
          }}
        />
      )}

      {selectedLead && (
        <FollowUpModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onScheduled={() => setSelectedLead(null)}
        />
      )}
      {editLead && (
        <LeadEditForm
          lead={editLead}
          onClose={() => setEditLead(null)}
          onUpdated={() => setEditLead(null)}
        />
      )}
    </div>
  );
}

export default FollowUpTable;