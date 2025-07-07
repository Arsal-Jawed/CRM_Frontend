import { useEffect, useState, useRef } from 'react';
import { LeadForm, LeadInfo } from './index';
import CONFIG from '../Configuration';

function Leads() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [focusedRowIndex, setFocusedRowIndex] = useState(-1);
  const tableContainerRef = useRef(null);
  const tableBodyRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const email = user.email;
  const IP = CONFIG.API_URL;

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

  // Handle keyboard navigation and scroll
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
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 bg-blue-50 rounded"
                      >
                        View
                      </button>
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
    </>
  );
}

export default Leads;