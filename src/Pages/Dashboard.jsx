import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar } from '../Components';
import {NotificationContainer,LeadDashboard,Profile,Accounts,LeadAdmin,Schedules,Teams,FollowUp,MessagePage,Clients,MyTeam,Performance,OperationDashbaord,TicketDashboard} from './index';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Set default page based on role
      switch(parsedUser.role) {
        case 1: // Admin
          setActivePage('accounts');
          break;
        case 2: // Team Member
          setActivePage('assigned-leads');
          break;
        case 3: // Lead
          setActivePage('dashboard');
          break;
          case 4: // Operation
          setActivePage('operation-dashboard');
          break;
        default:
          setActivePage('profile');
      }
    }
  }, []);

  if (!user) return <div className="p-8 text-white text-xl">Loading user data...</div>;

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <div><LeadDashboard/></div>;
      case 'accounts': return <div><Accounts/></div>;
      case 'leads': return <div><LeadAdmin/></div>;
      case 'teams': return <div><Teams/></div>;
      case 'messages': return <div><MessagePage/></div>;
      case 'performance': return <div><Performance/></div>;
      case 'schedules': return <div><Schedules/></div>;
      case 'clients': return <div><Clients/></div>;
      case 'followup': return <div><FollowUp/></div>;
      case 'assigned-leads': return <div><FollowUp/></div>;
      case 'client-data': return <div><Clients/></div>;
      case 'lead-dashboard': return <div><LeadDashboard/></div>;
      case 'profile': return <div><Profile/></div>;
      case 'myteam': return <div><MyTeam/></div>;
      case 'operation-dashboard': return <div><OperationDashbaord/></div>;
      case 'ticket-dashboard': return <div><TicketDashboard/></div>
      case 'logout':
        localStorage.clear();
        window.location.href = '/';
        return null;
      default: return <div><LeadDashboard/></div>; // Fallback to dashboard
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar role={user.role} onSelect={setActivePage} active={activePage} />

      <div className="flex-1 flex flex-col">
        <Navbar username={user.firstName} />

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-2 overflow-y-auto bg-gray-50">{renderContent()}</div>

          {user.role === 1 && activePage != 'followup' && activePage != 'messages' && activePage != 'clients' && (
            <div className="p-4 bg-gray-50">
              <NotificationContainer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;