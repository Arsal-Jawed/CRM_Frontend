import { useEffect, useState, useRef } from 'react';
import {
  FaSearch,
  FaFilter,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaFileAlt,
  FaInfoCircle,
  FaStar,
  FaIdCard,
  FaUserTie,
  FaUniversity,
  FaBarcode
} from 'react-icons/fa';


import { DocumentCard } from '../Components';
import CONFIG from '../Configuration';

function ClientsPage() {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const tableRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const email = user?.email || 'unknown';

  const IP = CONFIG.API_URL;

  useEffect(() => {
    setLoading(true);
    fetch(`${IP}/leads/all`)
      .then(res => res.json())
      .then(data => {
        setLeads(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const newIndex = e.key === 'ArrowUp' 
          ? Math.max(0, focusedIndex - 1)
          : Math.min(filtered.length - 1, focusedIndex + 1);
        setFocusedIndex(newIndex);
        setSelected(filtered[newIndex]);
        
        // Scroll into view
        const rows = tableRef.current?.querySelectorAll('tbody tr');
        if (rows && rows[newIndex]) {
          rows[newIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, filtered]);

  useEffect(() => {
    let result = [...leads];
    if (statusFilter !== 'all') result = result.filter(lead => lead.status === statusFilter);
    if (search.trim()) {
      result = result.filter(lead =>
        lead.person_name.toLowerCase().includes(search.toLowerCase()) ||
        lead.business_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
    setFocusedIndex(-1); // Reset focus when filters change
  }, [search, statusFilter, leads]);

  useEffect(() => {
    if (!selected?._id) {
      setDocuments([]);
      return;
    }
    fetch(`${IP}/docs/clientDocs/${selected._id}`)
      .then(res => res.json())
      .then(data => setDocuments(data))
      .catch(() => setDocuments([]));
  }, [selected]);

  const handleRating = (star) => {
    if (!selected?._id) return;
    fetch(`${IP}/leads/rateClient/${selected._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: star, ratedBy: email })
    })
      .then(() => {
        const updated = leads.map(lead =>
          lead._id === selected._id ? { ...lead, rating: star } : lead
        );
        setLeads(updated);
        setSelected(prev => ({ ...prev, rating: star }));
      });
  };

  const statusBadge = (status) => {
    const map = {
      'in process': 'bg-yellow-100 text-yellow-800',
      'won': 'bg-green-100 text-green-800',
      'lost': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${map[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="h-[86vh] w-[92vw] bg-gray-50 p-6 flex gap-6">
      <div className="w-2/3 space-y-4">
        <div className="bg-white h-[78.6vh] overflow-hidden hover:overflow-y-auto pr-1 shadow-sm rounded-lg border border-gray-100 p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaUser className="mr-2 text-clr1" /> Clients
            </h2>
            <div className="flex items-center gap-3 flex-wrap flex-1 justify-end">
              <div className="relative min-w-[220px]">
                <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search client..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-clr1/50 focus:border-clr1"
                />
              </div>
              <div className="relative w-[160px]">
                <FaFilter className="absolute left-3 top-3 text-gray-400 text-sm" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-clr1/50 focus:border-clr1"
                >
                  <option value="all">All Status</option>
                  <option value="in process">In Process</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-clr1"></div>
            </div>
          ) : (
            <div className="overflow-hidden h-[40vh]">
              <table ref={tableRef} className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((lead, index) => (
                    <tr
                      key={lead._id}
                      className={`hover:bg-gray-50 cursor-pointer transition ${
                        selected?._id === lead._id ? 'bg-gray-50 ring-1 ring-clr1/30' : ''
                      } ${focusedIndex === index ? 'bg-clr1/10' : ''}`}
                      onClick={() => {
                        setSelected(lead);
                        setFocusedIndex(index);
                      }}
                      tabIndex={0}
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-clr1/10 flex justify-center items-center mr-2">
                            <FaUser className="text-clr1 text-sm" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{lead.person_name}</div>
                            <div className="text-xs text-gray-500">{lead.business_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaEnvelope className="text-xs" />
                          {lead.business_email}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                          <FaPhone className="text-xs" />
                          {lead.business_contact}
                        </div>
                      </td>
                      <td className="px-4 py-3">{statusBadge(lead.status)}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-10 text-center text-gray-400">
                        <FaInfoCircle className="mx-auto text-2xl mb-2" />
                        No clients found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {selected && (
            <div className="mt-6 border-t pt-4 border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <FaFileAlt className="mr-2 text-clr1" />
                Documents ({documents.length})
              </h3>
              {documents.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {documents.map(doc => (
                    <DocumentCard key={doc._id} doc={doc} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No documents available for this client</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-1/3 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:overflow-y-auto flex flex-col">
      <div className="flex justify-between items-start p-5 border-b border-gray-200">
        <div className="flex items-center w-full justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaUser className="mr-2 text-clr1" /> Client Details
          </h2>
          {selected && (
            <div className="ml-4 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <FaStar
                  key={star}
                  size={16}
                  className={`cursor-pointer ${
                    star <= (hoveredStar || selected.rating || 0)
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                />
              ))}
              <span className="text-xs text-gray-600 ml-1">
                {selected.rating || 0}/5
              </span>
            </div>
          )}
        </div>
      </div>

      {selected ? (
        <div className="flex-1 p-5 space-y-5 text-sm">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-clr1/10 rounded-full flex items-center justify-center">
              <FaUser className="text-clr1 text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800">{selected.person_name}</h3>
                {statusBadge(selected.status)}
              </div>
              <p className="text-xs text-gray-500">{selected.business_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Personal Email" icon={<FaEnvelope />} value={selected.personal_email} />
            <Field label="Business Email" icon={<FaEnvelope />} value={selected.business_email} />
            <Field label="Personal Contact" icon={<FaPhone />} value={selected.contact} />
            <Field label="Business Contact" icon={<FaPhone />} value={selected.business_contact} />
            <Field label="Address" icon={<FaMapMarkerAlt />} value={selected.address} />
            <Field label="Date" icon={<FaCalendarAlt />} value={selected.date} />
            <Field label="Time" icon={<FaClock />} value={selected.time} />
            <Field label="DOB" icon={<FaCalendarAlt />} value={selected.dob?.substring(0, 10)} />
            <Field label="SSN" icon={<FaIdCard />} value={selected.ssn} />
            <Field label="License No." icon={<FaIdCard />} value={selected.driversLicenseNumber} />
            <Field label="Ownership %" icon={<FaUserTie />} value={selected.ownershipPercentage + '%'} />
            <Field label="Bank Name" icon={<FaUniversity />} value={selected.bankName} />
            <Field label="RTN" icon={<FaBarcode />} value={selected.rtn} />
            <Field label="Account #" icon={<FaBarcode />} value={selected.accountNumber} />
            <Field label="Account Type" icon={<FaUniversity />} value={selected.accountType} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6">
          <FaUser className="text-4xl mb-3" />
          <p className="text-center">Select a client from the list to view details</p>
        </div>
      )}
    </div>
    </div>
  );
}

function Field({ label, icon, value }) {
  return (
    <div className="bg-gray-50 rounded-md p-3">
      <h4 className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
        {icon} {label}
      </h4>
      <p className="text-gray-800 break-words">{value || '-'}</p>
    </div>
  );
}

export default ClientsPage;