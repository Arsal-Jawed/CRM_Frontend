import { useState, useEffect } from 'react';
import { FiSearch, FiBriefcase, FiUser, FiFlag, FiChevronDown, FiPlus, FiRotateCcw } from 'react-icons/fi';
import { TicketCard, TicketForm } from '../Components';
import CONFIG from '../Configuration';

function TicketDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [showForm, setShowForm] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [leads, setLeads] = useState([]);
  const [businessList, setBusinessList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [prefillData, setPrefillData] = useState(null);

  const IP = CONFIG.API_URL;

  useEffect(() => {
    fetch(`${IP}/tickets/getTickets`)
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(err => console.error('Failed to fetch tickets:', err));

    fetch(`${IP}/leads/all`)
      .then(res => res.json())
      .then(data => {
        const wonLeads = data.filter(l => l.status?.toLowerCase() === 'won');
        setLeads(wonLeads);
        setBusinessList([...new Set(wonLeads.map(l => l.business_name).filter(Boolean))].sort());
        setClientList([...new Set(wonLeads.map(l => l.person_name).filter(Boolean))].sort());
      })
      .catch(err => console.error('Failed to fetch leads:', err));
  }, [showForm]);

  const handleClientChange = (e) => {
    const client = e.target.value;
    setSelectedClient(client);
    const matchedLead = leads.find(l => l.person_name === client);
    if (matchedLead) setSelectedBusiness(matchedLead.business_name);
  };

  const handleBusinessChange = (e) => {
    const business = e.target.value;
    setSelectedBusiness(business);
    const matchedLead = leads.find(l => l.business_name === business);
    if (matchedLead) setSelectedClient(matchedLead.person_name);
  };

  const handleResetFilters = () => {
    setSelectedBusiness('');
    setSelectedClient('');
  };

  const filteredTickets = tickets.filter(t =>
    (filterStatus === 'All' || t.status === filterStatus) &&
    (selectedBusiness ? t.businessName === selectedBusiness : true) &&
    (selectedClient ? t.clientName === selectedClient : true) &&
    (
      t.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.leadId?.toString().includes(searchTerm) ||
      t.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleGenerateTicket = () => {
    setPrefillData({
      clientName: selectedClient,
      businessName: selectedBusiness
    });
    setShowForm(true);
  };

  return (
    <div className="p-4 md:p-6 relative z-20">
      <div className="bg-white shadow-sm rounded-lg p-3 mb-4 flex flex-wrap items-center gap-2 overflow-x-auto">
        
        <div className="relative flex-shrink-0 w-[180px]">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 text-xs" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-200 pl-7 pr-2 outline-none py-1.5 text-xs rounded-md focus:ring-1 focus:ring-blue-200 focus:border-blue-300 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative flex-shrink-0 w-[140px]">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <FiBriefcase className="text-gray-400 text-xs" />
          </div>
          <select
            className="w-full border border-gray-200 pl-7 pr-5 py-1.5 text-xs rounded-md outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300 transition appearance-none bg-white"
            value={selectedBusiness}
            onChange={handleBusinessChange}
          >
            <option value="">All Businesses</option>
            {businessList.map((b, idx) => (
              <option key={idx} value={b}>{b}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
        </div>

        <div className="relative flex-shrink-0 w-[140px]">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <FiUser className="text-gray-400 text-xs" />
          </div>
          <select
            className="w-full border border-gray-200 pl-7 pr-5 py-1.5 text-xs rounded-md outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300 transition appearance-none bg-white"
            value={selectedClient}
            onChange={handleClientChange}
          >
            <option value="">All Clients</option>
            {clientList.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
        </div>

        <div className="relative flex-shrink-0 w-[120px]">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <FiFlag className="text-gray-400 text-xs" />
          </div>
          <select
            className="w-full border border-gray-200 pl-7 pr-5 py-1.5 text-xs rounded-md outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300 transition appearance-none bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
          <FiChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
        </div>

        <FiRotateCcw
          onClick={handleResetFilters}
          className="cursor-pointer text-gray-500 hover:text-black transition ml-1"
          size={18}
          title="Reset Business & Client"
        />

        <button
          onClick={handleGenerateTicket}
          className="flex-shrink-0 bg-clr1 hover:bg-clr1/90 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition ml-auto"
        >
          <FiPlus size={12} />
          <span>Generate Ticket</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-inner p-4 h-[66vh] overflow-y-hidden hover:overflow-y-auto transition-all">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-2">
          {filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
              <FiSearch size={48} className="mb-4 text-gray-300" />
              <p className="text-lg">No tickets found</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <TicketForm onClose={() => setShowForm(false)} prefill={prefillData} />
        </div>
      )}
    </div>
  );
}

export default TicketDashboard;