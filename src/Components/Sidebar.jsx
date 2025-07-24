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
  FiUsers as FiMyTeam,
  FiFileText,
  FiFolderPlus
} from 'react-icons/fi';

const menuByRole = {
  1: [
    { label: 'Accounts', icon: FiUserCheck, key: 'accounts' },
    { label: 'Leads', icon: FiTrendingUp, key: 'leads' },
    { label: 'Messages', icon: FiMessageSquare, key: 'messages' },
    { label: 'Schedules', icon: FiClock, key: 'schedules' },
    { label: 'Clients', icon: FiBriefcase, key: 'myclient' },
    { label: 'Tickets', icon: FiFileText, key: 'ticket-dashboard' },
    { label: 'Follow Ups', icon: FiRepeat, key: 'followup' }
  ],
  2: [
    { label: 'FollowUps', icon: FiTrendingUp, key: 'assigned-leads' },
    { label: 'Data', icon: FiDatabase, key: 'data' },
    { label: 'MyTeam', icon: FiUsers, key: 'myteam' },
    { label: 'Schedules', icon: FiClock, key: 'schedules' },
    { label: 'MyClients', icon: FiBriefcase, key: 'myclient' },
    { label: 'Messages', icon: FiMessageSquare, key: 'messages' }
  ],
  3: [
    { label: 'Leads', icon: FiList, key: 'lead-dashboard' },
    { label: 'MyTeam', icon: FiUsers, key: 'myteam' },
    { label: 'Messages', icon: FiMessageSquare, key: 'messages' },
    { label: 'Data', icon: FiDatabase, key: 'data' },
    { label: 'Schedules', icon: FiClock, key: 'schedules' },
  ],
  4: [
    { label: 'Operation', icon: FiGrid, key: 'operation-dashboard' },
    { label: 'Tickets', icon: FiFileText, key: 'ticket-dashboard' },
    { label: 'MyClients', icon: FiBriefcase, key: 'myclient' },
    { label: 'Schedules', icon: FiClock, key: 'schedules' },
    { label: 'Messages', icon: FiMessageSquare, key: 'messages' },
    { label: 'Data', icon: FiDatabase, key: 'data' }
  ],
  5: [
    { label: 'Accounts', icon: FiUserCheck, key: 'accounts' },
    { label: 'Operation', icon: FiGrid, key: 'operation-dashboard' },
    { label: 'Tickets', icon: FiFileText, key: 'ticket-dashboard' },
    { label: 'MyClients', icon: FiBriefcase, key: 'myclient' },
    { label: 'Schedules', icon: FiClock, key: 'schedules' },
    { label: 'Messages', icon: FiMessageSquare, key: 'messages' },
    { label: 'Data', icon: FiDatabase, key: 'data' }
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
          <div key={item.key} className="flex flex-col items-center">
          <button
            onClick={() => onSelect(item.key)}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 
              ${isActive ? 'bg-white text-clr1 scale-110' : 'text-white'} 
              hover:bg-white hover:text-clr1`}
          >
            <Icon className="text-[2vw]" />
          </button>
          <span className={`text-[0.7rem] font-medium ${isActive ? 'text-white' : 'text-white/70'}`}>
            {item.label}
          </span>
        </div>
        );
      })}
    </div>
  );
};

export default Sidebar;