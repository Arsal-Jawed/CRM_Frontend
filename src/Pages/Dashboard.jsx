import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, NotificationCard } from '../Components';
import {NotificationContainer,LeadDashboard,Profile,Accounts,LeadAdmin,Schedules,Teams,FollowUp,MessagePage,Clients,MyTeam,Performance,OperationDashbaord,TicketDashboard,MyClient,DataPage,Attendance} from './index';
import CONFIG from '../Configuration';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('');
  const [notifications, setNotifications] = useState([]);

  const IP = CONFIG.API_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      switch (parsedUser.role) {
        case 1: setActivePage('accounts'); break;
        case 2: setActivePage('assigned-leads'); break;
        case 3: setActivePage('dashboard'); break;
        case 4: setActivePage('operation-dashboard'); break;
        case 5: setActivePage('accounts'); break;
        case 6: setActivePage('performance'); break;
        default: setActivePage('profile');
      }
      fetch(`${IP}/schedules/scheduler/${parsedUser.email}`)
  .then(res => res.json())
  .then(data => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todays = data.filter(item =>
      item.schedule_date?.slice(0, 10) === todayStr
    );
    setNotifications(todays);
  })
  .catch(err => console.error('Schedule fetch error:', err));

    }
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <LeadDashboard />;
      case 'accounts': return <Accounts />;
      case 'leads': return <LeadAdmin />;
      case 'teams': return <Teams />;
      case 'messages': return <MessagePage />;
      case 'performance': return <Performance />;
      case 'schedules': return <Schedules />;
      case 'clients': return <Clients />;
      case 'followup': return <FollowUp />;
      case 'assigned-leads': return <FollowUp />;
      case 'client-data': return <Clients />;
      case 'lead-dashboard': return <LeadDashboard />;
      case 'profile': return <Profile />;
      case 'myteam': return <MyTeam />;
      case 'operation-dashboard': return <OperationDashbaord />;
      case 'ticket-dashboard': return <TicketDashboard />;
      case 'myclient': return <MyClient/>;
      case 'data': return <DataPage/>;
      case 'attendance': return <div><Attendance/></div>;
      case 'logout':
        const user = JSON.parse(localStorage.getItem('user'));

        if (user?.email) {
          fetch(`${IP}/attendance/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
          }).catch((err) => console.error('Checkout failed:', err));
        }

        localStorage.clear();
        window.location.href = '/';
        return null;

      default: return <LeadDashboard />;
    }
  };

  if (!user) return <div className="p-8 text-white text-xl">Loading user data...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar role={user.role} onSelect={setActivePage} active={activePage} />

      <div className="flex-1 flex flex-col">
        <Navbar username={user.firstName} onNavigate={setActivePage}/>

        <div className="flex flex-1 overflow-hidden relative">
          <div className="flex-1 p-2 overflow-y-auto bg-gray-50">
            {renderContent()}
          </div>
          {/* {user.role === 1 &&
            !['accounts','followup', 'messages', 'clients','myclient','ticket-dashboard','attendance','performance'].includes(activePage) && (
              <div className="p-4 bg-gray-50">
                <NotificationContainer />
              </div>
            )} */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;