import React, { useEffect, useState } from 'react';
import { FiCalendar, FiMessageSquare, FiSearch, FiSettings, FiBell, 
  FiUsers, FiBarChart2, FiUserCheck, FiFileText, FiTrendingUp, FiDatabase } from 'react-icons/fi';
import { FaRegAddressCard, FaUserTie, FaUser } from 'react-icons/fa';
import CONFIG from '../Configuration';

const Navbar = ({ onNavigate }) => {
  const [count, setCount] = useState(0);
  const [unseenCount, setUnseenCount] = useState(0);
  const [lastChecked, setLastChecked] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unseenNotifications, setUnseenNotifications] = useState(0);

  const IP = CONFIG.API_URL;
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.firstName + ' ' + user?.lastName || 'User';
  const designation = user?.designation || '';
  const email = user?.email;
  const profilePic = user?.profilePic?.trim() ? user.profilePic : null;

  const roleIconMap = {
    1: [
      { icon: FiTrendingUp, label: 'Leads', page: 'leads' },
      { icon: FiUsers, label: 'Teams', page: 'teams' },
      { icon: FiBarChart2, label: 'Performance', page: 'performance' },
      { icon: FaRegAddressCard, label: 'Clients', page: 'myclient' },
      { icon: FiUserCheck, label: 'Attendance', page: 'attendance' },
      { icon: FiDatabase, label: 'Data', page: 'data' }
    ],
    2: [
      { icon: FaUserTie, label: 'Clients', page: 'myclient' },
      { icon: FiDatabase, label: 'Data', page: 'data' }
    ],
    3: [
      { icon: FiDatabase, label: 'Data', page: 'data' }
    ],
    4: [
      { icon: FiFileText, label: 'Tickets', page: 'ticket-dashboard' },
      { icon: FaUserTie, label: 'Clients', page: 'myclient' },
      { icon: FiSearch, label: 'Data', page: 'data' },
    ],
    5: [
      { icon: FiFileText, label: 'Tickets', page: 'ticket-dashboard' },
      { icon: FiTrendingUp, label: 'Leads', page: 'leads' },
      { icon: FaUserTie, label: 'Clients', page: 'myclient' },
      { icon: FiBarChart2, label: 'Performance', page: 'performance' },
      { icon: FiSearch, label: 'Data', page: 'data' },
      { icon: FiUserCheck, label: 'Attendance', page: 'attendance' },
    ],
    6: [
      { icon: FiTrendingUp, label: 'Leads', page: 'leads' },
      { icon: FaUserTie, label: 'Clients', page: 'myclient' },
      { icon: FiDatabase, label: 'Data', page: 'data' },
      { icon: FiBarChart2, label: 'Performance', page: 'performance' },
      { icon: FiUserCheck, label: 'Attendance', page: 'attendance' },
    ]
  };

  const extraIcons = roleIconMap[user?.role] || [];

  const fetchNotifications = async () => {
    if (!email) return;

    try {
      const scheduleRes = await fetch(`${IP}/schedules/todayCount?email=${email}`);
      const scheduleData = await scheduleRes.json();
      setCount(scheduleData.count);

      const messagesRes = await fetch(`${IP}/messages/reciever/${email}`);
      const messagesData = await messagesRes.json();
      const unseen = messagesData.filter(msg => !msg.seen).length;
      setUnseenCount(unseen);

      const notifRes = await fetch(`${IP}/notifications`);
      const notifData = await notifRes.json();
      const sortedNotifs = notifData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotifications(sortedNotifs);
      const unseenNotifs = sortedNotifs.filter(n => !n.seen).length;
      setUnseenNotifications(unseenNotifs);


      setLastChecked(new Date());
    } catch (err) {
      console.error('Notification fetch error:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 15000);
    return () => clearInterval(intervalId);
  }, [email]);

  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-6 border-b relative">
      <h1 className="text-2xl font-bold text-orange-600">CallSid CRM</h1>

      <div className="flex gap-6 text-gray-500 text-xl relative ml-[8vw]">
        {/* Messages */}
        <div className="relative group">
          <FiMessageSquare className="hover:text-orange-500 cursor-pointer transition-colors" />
          {unseenCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unseenCount}
            </span>
          )}
        </div>

        {/* Schedules */}
        <div
          className="relative group"
          onClick={() => onNavigate('schedules')}
        >
          <FiCalendar className="hover:text-orange-500 cursor-pointer transition-colors" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {count}
            </span>
          )}
        </div>

        {/* Role Icons */}
        {extraIcons.map(({ icon: Icon, label, page }, idx) => (
          <div
            key={idx}
            className="relative group cursor-pointer"
            onClick={() => onNavigate(page)}
          >
            <Icon className="hover:text-orange-500 transition-colors" />
          </div>
        ))}

        {/* Notifications */}
        <div className="relative">
          <FiBell
            className="hover:text-orange-500 cursor-pointer transition-colors"
            onClick={() => setShowNotifications(prev => !prev)}
          />
          {unseenNotifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
              {unseenNotifications}
            </span>
          )}

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 max-h-[60vh] bg-white shadow-xl rounded-lg overflow-y-auto no-scrollbar z-50 border border-orange-200">
              <div className="sticky top-0 bg-orange-50 p-3 rounded-t-lg flex justify-between items-center">
                <h3 className="text-sm font-bold text-orange-700">Notifications</h3>
                <span className="text-xs text-gray-500">
                  {lastChecked?.toLocaleTimeString()}
                </span>
              </div>
              <div className="divide-y">
                {notifications.length > 0 ? (
                  notifications.map((n, i) => (
                    <div
                      key={i}
                      className="p-3 hover:bg-orange-50 transition cursor-pointer"
                    >
                      <p className="text-sm font-medium text-gray-800">{n.notifier}</p>
                      <p className="text-xs text-gray-600">{n.detail}</p>
                      <span className="text-[10px] text-gray-400">
                        {new Date(n.date).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-400">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <FiSettings className="hover:text-orange-500 cursor-pointer transition-colors" />
      </div>

      {/* Right Profile Section */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end text-sm text-right text-gray-700">
          <span className="font-medium">{username}</span>
          <span className="text-gray-400">{designation}</span>
        </div>
        {profilePic ? (
          <img
            src={profilePic}
            alt="User"
            className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-lg border border-gray-300 shadow-sm">
            <FaUser />
          </div>
        )}

        <div className="h-8 w-[1px] bg-gray-200 mx-2" />

        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 rounded-md overflow-hidden transition-all focus-within:ring-2 focus-within:ring-orange-500/50">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-1.5 text-sm bg-transparent focus:outline-none w-40 md:w-56"
          />
          <button className="bg-orange-500 text-white px-3 py-1.5 text-sm hover:bg-orange-600 transition-colors">
            <FiSearch />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;