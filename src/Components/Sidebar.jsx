import React from 'react';
import {
  FiUserCheck,
  FiUser,
  FiTrendingUp,
  FiBarChart2,
  FiLogOut,
  FiMessageSquare,
  FiClock,
  FiBriefcase,
  FiUsers,
  FiRepeat,
  FiGrid,
  FiDatabase,
  FiList,
  FiUsers as FiMyTeam
} from 'react-icons/fi';

const menuByRole = {
  1: [
    { label: 'Accounts', icon: FiUserCheck, key: 'accounts' },
    { label: 'Leads', icon: FiTrendingUp, key: 'leads' },
    { label: 'Teams', icon: FiUsers, key: 'teams' },
    { label: 'Messages', icon: FiMessageSquare, key: 'messages' },
    { label: 'Performance', icon: FiBarChart2, key: 'performance' },
    { label: 'Schedules', icon: FiClock, key: 'schedules' },
    { label: 'Clients', icon: FiBriefcase, key: 'clients' },
    { label: 'Follow Ups', icon: FiRepeat, key: 'followup' }
  ],
  2: [
    { label: 'Assigned Leads', icon: FiTrendingUp, key: 'assigned-leads' },
    { label: 'MyTeam', icon: FiUsers, key: 'myteam' },
    { label: 'Schedules', icon: FiClock, key: 'schedules' },
    { label: 'Messages', icon: FiMessageSquare, key: 'messages' }
  ],
  3: [
    { label: 'Lead Dashboard', icon: FiList, key: 'lead-dashboard' },
    { label: 'MyTeam', icon: FiUsers, key: 'myteam' },
    { label: 'Messages', icon: FiMessageSquare, key: 'messages' }
  ],
  4: [
    { label: 'OperationDashboard', icon: FiGrid, key: 'operation-dashboard' },
    { label: 'TicketDashboard', icon: FiDatabase, key: 'ticket-dashboard' },
    { label: 'Schedules', icon: FiClock, key: 'schedules' },
    { label: 'Messages', icon: FiMessageSquare, key: 'messages' }
  ]
};


const Sidebar = ({ role, onSelect, active }) => {
  const menu = menuByRole[role] || [];
  const common = [
    { label: 'Profile', icon: FiUser, key: 'profile' },
    { label: 'Logout', icon: FiLogOut, key: 'logout' }
  ];

  const allItems = [...menu, ...common];

  return (
    <div className="w-20 h-screen bg-clr1 shadow-lg border-r flex flex-col items-center py-6 space-y-[2vh]">
      {allItems.map(item => {
        const Icon = item.icon;
        const isActive = active === item.key;

        return (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 
              ${isActive ? 'bg-white text-clr1 scale-125' : 'text-white'} 
              hover:bg-white hover:text-clr1`}
          >
            <Icon className="text-2xl" />
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;