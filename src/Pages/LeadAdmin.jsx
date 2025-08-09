import React, { useEffect, useState } from 'react';
import CONFIG from '../Configuration';
import { LeadCard, FollowUpPopup } from '../Components';
import {
  FaUser, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaStar, FaCalendarAlt, FaClock, FaCalendarPlus, FaListUl,
  FaEye
} from 'react-icons/fa';

function LeadAdmin() {
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allLeads, setAllLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [showAllLeads, setShowAllLeads] = useState(true);
  const [showTodayLeads, setShowTodayLeads] = useState(false);


  const role = JSON.parse(localStorage.getItem("user")).role;

  const toggleShowAll = () => {
    const filtered = allLeads.filter(lead =>
      lead.status === 'in process' &&
      (showAllLeads || lead.closure1 === 'not specified')
    );
    setLeads(filtered);
    setSelected(filtered[0] || null);
    setSelectedUser('');
    setShowAllLeads(prev => !prev);
  };

  const filterByUser = (userEmail) => {
    setSelectedUser(userEmail);
    const filtered = allLeads.filter(
      lead => lead.email === userEmail && lead.status === 'in process'
    );
    setLeads(filtered);
    setSelected(filtered[0] || null);
  };
  
  const showTodaysLeads = () => {
  const today = new Date().toLocaleDateString();
  const filtered = allLeads.filter(
    lead => new Date(lead.date).toLocaleDateString() === today
  );
  setLeads(filtered);
  setSelected(filtered[0] || null);
  setShowTodayLeads(true);
  };


  useEffect(() => {
    const fetchAllLeads = async () => {
      try {
        const res = await fetch(`${CONFIG.API_URL}/leads/all`);
        const data = await res.json();
        setAllLeads(data);
        setLeads(data.filter(lead => lead.status === 'in process' && lead.closure1 === 'not specified'));
        setSelected(data[0] || null);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${CONFIG.API_URL}/users/getAllUsers`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllLeads();
    fetchUsers();
  }, []);

  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < full) stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      else if (i === full && half) stars.push(<FaStar key={i} className="text-yellow-400 opacity-50 text-sm" />);
      else stars.push(<FaStar key={i} className="text-gray-300 text-sm" />);
    }

    return (
      <div className="flex items-center gap-1 mt-1">
        {stars}
        <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const formatDate = (date) => date || 'N/A';
  const formatTime = (time) => time || 'N/A';

  const getUserNameByEmail = (email) => {
  if (!email || email === 'not specified') return 'Not Assigned';
  const user = users.find(u => u.email === email);
  return user ? `${user.firstName} ${user.lastName}` : email;
};


  return (
    <div className="flex h-[85vh] bg-white rounded-xl overflow-hidden shadow z-20">
      <div className="w-[38%] border-r border-gray-100 p-4 bg-white flex flex-col">
        <div className="mb-4 space-y-3">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaListUl className="text-clr1" />
            <span>Leads Pipeline</span>
            <span className="bg-clr1/10 text-clr1 text-xs px-2 py-1 rounded-full">
              {leads.length} leads
            </span>
            <button
                onClick={toggleShowAll}
                title="Toggle Leads View"
                className="hover:scale-110 transition-transform relative"
              >
                <FaEye className={`text-lg ${showAllLeads ? 'text-blue-500' : 'text-red-500'}`} />
                {!showAllLeads && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-red-500"></span>
                )}
              </button>
          </h2>
          <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <select
              value={selectedUser}
              onChange={e => filterByUser(e.target.value)}
              className="border px-3 py-2 rounded text-sm text-gray-700 bg-white shadow-sm focus:ring-1 focus:ring-clr1 focus:outline-none w-[18vw]"
            >
              <option value="">Filter by User</option>
              {users.map(user => (
                <option key={user._id} value={user.email}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
            <button
              onClick={showTodaysLeads}
              className="p-2 rounded bg-clr1 text-white hover:bg-clr1/80"
              title="Show Today's Leads"
            >
              <FaCalendarAlt className="text-sm" />
            </button>
          </div>
          </div>

        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent hover:scrollbar-thumb-gray-300 hover:scrollbar-track-gray-100">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-t-transparent border-clr1 rounded-full animate-spin"></div>
            </div>
          ) : (
            leads.map(lead => (
              <LeadCard
                key={lead._id}
                lead={lead}
                onSelect={setSelected}
                selected={selected?._id === lead._id}
              />
            ))
          )}
        </div>
      </div>
      <div className="w-[65%] flex flex-col">
        {selected ? (
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-clr1 to-blue-500 flex items-center justify-center text-white">
                    <FaUser className="text-lg" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selected.person_name}</h2>
                    <p className="text-gray-500 flex items-center gap-1 text-[0.8vw]">
                      <FaBuilding className="text-sm" />
                      <span>{selected.business_name}</span>
                    </p>
                  </div>
                </div>
                {renderStars(selected.rating)}
              </div>
              <div className="text-right space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selected.status === 'won' ? 'bg-green-100 text-green-800' :
                  selected.status === 'lost' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {selected.status.toUpperCase()}
                </span>
                <p className="text-xs text-gray-500">Generated by: <span className="font-medium text-gray-700">{selected.userName}</span></p>
                <div className="flex items-center gap-2 text-xs text-gray-500 justify-end">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>{formatDate(selected.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 justify-end">
                  <FaClock className="text-gray-400" />
                  <span>{formatTime(selected.time)}</span>
                </div>
                <div className="flex flex-col text-xs text-gray-500 mt-1">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="font-medium text-gray-500">Closure 1:</span>
                    <span>{getUserNameByEmail(selected.closure1)}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="font-medium text-gray-500">Closure 2:</span>
                    <span>{getUserNameByEmail(selected.closure2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-5 mt-[-2vw]">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2 text-base border-b pb-2">
                  <FaEnvelope className="text-clr1" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem icon={<FaEnvelope className="text-gray-400" />} label="Email" value={selected.personal_email} />
                  <DetailItem icon={<FaPhone className="text-gray-400" />} label="Phone" value={selected.contact} />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2 text-base border-b pb-2">
                  <FaBuilding className="text-clr1" />
                  Business Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem icon={<FaEnvelope className="text-gray-400" />} label="Business Email" value={selected.business_email} />
                  <DetailItem icon={<FaPhone className="text-gray-400" />} label="Business Phone" value={selected.business_contact} />
                  <DetailItem icon={<FaMapMarkerAlt className="text-gray-400" />} label="Address" value={selected.business_address} />
                  <DetailItem icon={<FaCalendarAlt className="text-gray-400" />} label="Follow-up Date" value={selected.followupDate ? selected.followupDate.slice(0, 10) : '-'} />
                </div>
              </div>
            </div>
            {role === 1 && (
              <div className="mt-8 flex justify-between gap-3">
                <ActionButton
                  onClick={() => setShowFollowUp(true)}
                  className="bg-white text-clr1 border border-clr1 hover:text-white hover:bg-clr1"
                  icon={<FaCalendarPlus className="text-lg" />}
                  label="Followup"
                  disabled={selected?.status === 'won' || selected?.status === 'lost'}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>Select a lead to view details</p>
          </div>
        )}
        {showFollowUp && selected && (
          <FollowUpPopup lead={selected} onClose={() => setShowFollowUp(false)} />
        )}
      </div>
    </div>
  );
}

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <span className="mt-0.5 mr-3">{icon}</span>
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-700 break-words">{value || '-'}</p>
    </div>
  </div>
);

const ActionButton = ({ onClick, icon, label, className, disabled }) => (
  <button
    onClick={disabled ? null : onClick}
    disabled={disabled}
    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all text-sm font-medium shadow-sm
      ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    {icon}
    {label}
  </button>
);

export default LeadAdmin;
