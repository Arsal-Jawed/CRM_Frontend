import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { VerifyLeadModal } from './index.js';
import CONFIG from '../Configuration';
import {
  LeadForm,
  FollowUpModal,
  LeadEditForm,
  SelectClosureModel,
  SelectSecondClosure,
} from './index.js';
import FollowUpTableHeader from './FollowUpTableHeader';
import FollowUpTableRow from './FollowUpTableRow';

function FollowUpTable({ onSelectClient, setCalls }) {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showClosureModal, setShowClosureModal] = useState(false);
  const [showSecondClosureModal, setShowSecondClosureModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);

  const email = JSON.parse(localStorage.getItem('user')).email;
  const role = JSON.parse(localStorage.getItem("user")).role;
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
  }, [IP, email]);

  const handleClick = async (lead) => {
    onSelectClient(lead);
    setSelectedLead(lead);
    try {
      const response = await fetch(`${CONFIG.API_URL}/calls/client/${lead._id}`);
      const data = await response.json();
      setCalls(data);
    } catch (error) {
      console.error('Failed to fetch calls:', error);
      setCalls([]);
    }
  };

  const filtered = leads
    .filter((lead) => (lead.person_name || '').toLowerCase().includes(search.toLowerCase()))
    .filter((lead) => (statusFilter === 'all' ? true : lead.status === statusFilter));

  return (
    <div className="bg-white shadow-md h-[42vh] rounded-lg border border-gray-200 p-4 space-y-3 overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <FollowUpTableHeader
        showVerifyPopup={showVerifyPopup}
        setShowVerifyPopup={setShowVerifyPopup}
        setShowForm={setShowForm}
        selectedLead={selectedLead}
        email={email}
        setShowClosureModal={setShowClosureModal}
        setToast={setToast}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {toast && (
        <div className="text-red-500 text-xs font-medium text-center">{toast}</div>
      )}

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
                  <FollowUpTableRow
                    key={lead._id}
                    lead={lead}
                    index={index}
                    handleClick={handleClick}
                    setShowScheduleModal={setShowScheduleModal}
                    setSelectedLead={setSelectedLead}
                    setEditLead={setEditLead}
                    setShowSecondClosureModal={setShowSecondClosureModal}
                    email={email}
                  />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-400">
                      No leads found
                    </td>
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
          onCreated={() => setShowForm(false)}
        />
      )}

      {showScheduleModal && selectedLead && (
        <FollowUpModal
          lead={selectedLead}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedLead(null);
          }}
          onScheduled={() => {
            setShowScheduleModal(false);
            setSelectedLead(null);
          }}
        />
      )}

      {editLead && (
        <LeadEditForm
          lead={editLead}
          onClose={() => setEditLead(null)}
          onUpdated={() => setEditLead(null)}
        />
      )}

      {showClosureModal && selectedLead && (
        <SelectClosureModel
          lead={selectedLead}
          onClose={() => setShowClosureModal(false)}
          onUpdated={() => {
            setShowClosureModal(false);
            setSelectedLead(null);
          }}
        />
      )}

      {showSecondClosureModal && selectedLead && (
        <SelectSecondClosure
          lead={selectedLead}
          onClose={() => setShowSecondClosureModal(false)}
          onUpdated={() => {
            setShowSecondClosureModal(false);
            setSelectedLead(null);
          }}
        />
      )}
      {showVerifyPopup && (
        <VerifyLeadModal onClose={() => setShowVerifyPopup(false)} />
      )}
    </div>
  );
}

export default FollowUpTable;