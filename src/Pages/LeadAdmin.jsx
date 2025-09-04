import React, { useEffect, useState } from 'react';
import CONFIG from '../Configuration';
import { LeadCard, FollowUpPopup, LeadAdminHeader, LeadAdminDetails } from '../Components';

function LeadAdmin() {
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allLeads, setAllLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const role = JSON.parse(localStorage.getItem("user")).role;
  
  const filterByUser = (userEmail) => {
    setLoading(true);
    setSelectedUser(userEmail);
    setTimeout(() => {
      applyFilters(userEmail, searchQuery);
      setLoading(false);
    }, 300);
  };
  
  const showTodaysLeads = () => {
    console.log("Button Clicked !");
  const today = new Date();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(today.getDate() - 2);

  const filtered = allLeads.filter(lead => {
    if (!lead.date) return false;
    const [month, day, year] = lead.date.split('/').map(Number);
    const leadDate = new Date(year, month - 1, day);
    return leadDate >= threeDaysAgo && leadDate <= today;
  });

  setLeads(filtered);
  setSelected(filtered[0] || null);
};

const filterBySpecificDate = (dateStr) => {
  if (!dateStr) return setLeads(allLeads);
  const selectedDate = new Date(dateStr);
  const filtered = allLeads.filter(lead => {
    if (!lead.date) return false;
    const leadDate = new Date(lead.date);
    return leadDate.toDateString() === selectedDate.toDateString();
  });
  setLeads(filtered);
  setSelected(filtered[0] || null);
};


  const applyFilters = (userEmail, searchValue) => {
    let filtered = [...allLeads];

    if (userEmail) {
      filtered = filtered.filter(lead => lead.email === userEmail);
    }

    if (searchValue) {
      filtered = filtered.filter(
        lead =>
          lead.person_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          lead.business_name?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setLeads(filtered);
    setSelected(filtered[0] || null);
  };

  const filterByStatus = (status) => {
  setLoading(true);
  setTimeout(() => {
    if (status === 'all') {
      setLeads(allLeads);
    } else if (status === 'unassigned') {
      setLeads(allLeads.filter(lead => lead.closure1 === 'not specified'));
    } else {
      setLeads(allLeads.filter(lead => lead.status === status));
    }
    setSelected(null);
    setLoading(false);
  }, 300);
};

  useEffect(() => {
    const fetchAllLeads = async () => {
      try {
        const res = await fetch(`${CONFIG.API_URL}/leads/all`);
        const data = await res.json();
        setAllLeads(data);
        const unassigned = data.filter(lead => lead.closure1 === 'not specified');
        setLeads(unassigned);
        setSelected(unassigned[0] || null);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const [allRes, firedRes] = await Promise.all([
          fetch(`${CONFIG.API_URL}/users/getAllUsers`),
          fetch(`${CONFIG.API_URL}/users/getAllFiredUsers`)
        ]);

        const allUsers = await allRes.json();
        const firedUsers = await firedRes.json();

        const sortedActive = allUsers.sort((a, b) => {
          if (a.role !== b.role) return a.role - b.role;
          const nameA = (a.firstName + ' ' + a.lastName).toLowerCase();
          const nameB = (b.firstName + ' ' + b.lastName).toLowerCase();
          return nameA.localeCompare(nameB);
        });

        const sortedFired = firedUsers.sort((a, b) => {
          const nameA = (a.firstName + ' ' + a.lastName).toLowerCase();
          const nameB = (b.firstName + ' ' + b.lastName).toLowerCase();
          return nameA.localeCompare(nameB);
        });

        setUsers([...sortedActive, ...sortedFired.map(u => ({ ...u, isFired: true }))]);
      } catch (err) {
        console.error(err);
      }
    };


    fetchAllLeads();
    fetchUsers();
  }, []);

  const stats = {
    total: allLeads.length,
    won: allLeads.filter(l => l.status === 'won').length,
    loss: allLeads.filter(l => l.status === 'loss').length,
    inProcess: allLeads.filter(l => l.status === 'in process').length,
    unassigned: allLeads.filter(l => l.closure1 === 'not specified').length,
  };

  return (
    <div className="flex h-[85vh] bg-white rounded-xl overflow-hidden shadow z-20">
      <div className="w-[38%] border-r border-gray-100 p-4 bg-white flex flex-col">
        <LeadAdminHeader
          leads={leads}
          users={users}
          selectedUser={selectedUser}
          filterByUser={filterByUser}
          filterByStatus={filterByStatus}
          stats={stats}
          loading={loading}
          showTodaysLeads={showTodaysLeads}
          searchQuery={searchQuery}
          filterBySpecificDate={filterBySpecificDate}
          setSearchQuery={(val) => {
            setSearchQuery(val);
            applyFilters(selectedUser, val);
          }}
        />

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
                users={users}
                onSelect={setSelected}
                selected={selected?._id === lead._id}
              />
            ))
          )}
        </div>
      </div>

      <div className="w-[65%] flex flex-col">
        <LeadAdminDetails
          selected={selected}
          users={users}
          role={role}
          setShowFollowUp={setShowFollowUp}
          showNotes={showNotes}
          setShowNotes={setShowNotes}
        />

        {showFollowUp && selected && (
          <FollowUpPopup lead={selected} onClose={() => setShowFollowUp(false)} />
        )}
      </div>
    </div>
  );
}

export default LeadAdmin;