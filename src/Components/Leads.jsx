import { useEffect, useState, useRef } from 'react';
import { LeadForm, LeadInfo, VerifyLeadModal } from './index';
import CONFIG from '../Configuration';
import { FaEye, FaStickyNote, FaEdit } from 'react-icons/fa';

function Leads() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [focusedRowIndex, setFocusedRowIndex] = useState(-1);
  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [noteLead, setNoteLead] = useState(null);
  const [notes, setNotes] = useState('');
  const [editingNote, setEditingNote] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);

  const tableContainerRef = useRef(null);
  const tableBodyRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const email = user.email;
  const IP = CONFIG.API_URL;

  const handleNotesUpdate = async () => {
  try {
    const res = await fetch(`${IP}/leads/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: noteLead.lead_id,
        remarks: notes
      }),
    });

    if (res.ok) {
      setEditingNote(false);
      setShowNotesPopup(false);

      const refreshed = await fetch(`${IP}/leads/email/${email}`);
      const data = await refreshed.json();
      setLeads(data);
      setFilteredLeads(data);
    } else {
      const errorData = await res.json();
      console.error('Server error:', errorData);
      alert(errorData.error || 'Failed to update notes');
    }
  } catch (err) {
    console.error('Note update failed:', err);
  }
};

  useEffect(() => {
    fetch(`${IP}/leads/email/${email}`)
      .then(res => res.json())
      .then(data => {
        setLeads(data);
        setFilteredLeads(data);
      })
      .catch(err => console.error('Failed to fetch leads:', err));
  }, [email, showAddPopup]);

  useEffect(() => {
    let result = leads;
    if (search) {
      result = result.filter(lead =>
        lead.person_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterStatus) {
      result = result.filter(lead => lead.status === filterStatus);
    }
    setFilteredLeads(result);
    setFocusedRowIndex(-1);
  }, [search, filterStatus, leads]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (filteredLeads.length === 0) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newIndex = focusedRowIndex >= filteredLeads.length - 1 ? 0 : focusedRowIndex + 1;
        setFocusedRowIndex(newIndex);
        scrollToRow(newIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex = focusedRowIndex <= 0 ? filteredLeads.length - 1 : focusedRowIndex - 1;
        setFocusedRowIndex(newIndex);
        scrollToRow(newIndex);
      } else if (e.key === 'Enter' && focusedRowIndex >= 0) {
        setSelectedLead(filteredLeads[focusedRowIndex]);
      }
    };

    const tableContainer = tableContainerRef.current;
    tableContainer.addEventListener('keydown', handleKeyDown);
    
    return () => {
      tableContainer.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredLeads, focusedRowIndex]);

  const scrollToRow = (index) => {
    if (tableBodyRef.current && tableBodyRef.current.children[index]) {
      const rowElement = tableBodyRef.current.children[index];
      rowElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  const isPopupOpen = showAddPopup || selectedLead;

  return (
    <>
      <div className={`relative transition-all duration-300 ${isPopupOpen ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <div className="bg-white rounded-xl h-[53vh] shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Leads</h2>
            <div className="flex gap-2">
               <button onClick={() => setShowVerifyPopup(true)}
                  className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:opacity-90">
                  Verify Lead
                </button>
              <button
                onClick={() => setShowAddPopup(true)}
                className="bg-grd1 text-white text-sm px-4 py-2 rounded-md hover:opacity-90"
              >
                + Add Lead
              </button>
              <input
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Filter by status</option>
                <option value="in process">In Process</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          <div 
            className="overflow-y-hidden h-[40vh] border rounded-md hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            tabIndex="0"
            ref={tableContainerRef}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name & Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody 
                className="bg-white divide-y divide-gray-200"
                ref={tableBodyRef}
              >
                {filteredLeads.map((lead, index) => (
                  <tr 
                    key={lead._id} 
                    className={`hover:bg-gray-50 ${index === focusedRowIndex ? 'bg-blue-50 ring-2 ring-blue-200' : ''}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <p>{lead.person_name}</p>
                      <p className="text-xs text-gray-500">{lead.business_name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{lead.personal_email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full 
                        ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{lead.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            setNoteLead(lead);
                            setNotes(lead.notes || '');
                            setShowNotesPopup(true);
                          }}
                          className="text-green-600 hover:text-green-800"
                          title="Notes"
                        >
                          <FaStickyNote />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <LeadForm onClose={() => setShowAddPopup(false)} />
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <LeadInfo lead={selectedLead} onClose={() => setSelectedLead(null)} />
        </div>
      )}
      {showNotesPopup && noteLead && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow">
            <h2 className="text-lg font-semibold text-clr1">Remarks - {noteLead.person_name}</h2>
            {editingNote ? (
              <>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300"
                  rows={6}
                />
                <div className="flex justify-end gap-3">
                  <button onClick={() => setEditingNote(false)} className="text-sm text-gray-500">Cancel</button>
                  <button onClick={handleNotesUpdate} className="text-sm text-white bg-clr1 hover:bg-orange-600 px-4 py-1.5 rounded">Save</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{notes || 'No notes available.'}</p>
                <div className="flex justify-end">
                  <button onClick={() => setEditingNote(true)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <FaEdit /> Edit
                  </button>
                </div>
              </>
            )}
            <div className="flex justify-end pt-2">
              <button onClick={() => setShowNotesPopup(false)} className="text-sm text-gray-500">Close</button>
            </div>
          </div>
        </div>
      )}
      {showVerifyPopup && (<VerifyLeadModal onClose={() => setShowVerifyPopup(false)} />)}
    </>
  );
}

export default Leads;