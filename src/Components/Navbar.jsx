import React, { useEffect, useState } from 'react';
import { FiBell, FiSettings, FiSearch, FiMessageSquare, FiCalendar } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import CONFIG from '../Configuration';

const Navbar = ({onNavigate}) => {
  const [count, setCount] = useState(0);
  const [unseenCount, setUnseenCount] = useState(0);
  const [lastChecked, setLastChecked] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.firstName + ' ' + user?.lastName || 'User';
  const designation = user?.designation || '';
  const email = user?.email;
  const profilePic = user?.profilePic?.trim() ? user.profilePic : null;
  const IP = CONFIG.API_URL;

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
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-6 border-b">
      <h1 className="text-2xl font-bold text-orange-600">CallSid CRM</h1>

      <div className="flex gap-6 text-gray-500 text-xl relative">
        <div className="relative group">
          <FiMessageSquare className="hover:text-orange-500 cursor-pointer transition-colors" />
          {unseenCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unseenCount}
            </span>
          )}
          <div className="absolute hidden group-hover:block right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md p-2 z-50">
            <p className="text-xs text-gray-500">You have {unseenCount} new message(s)</p>
            <p className="text-xs text-gray-400 mt-1">Last checked: {lastChecked?.toLocaleTimeString()}</p>
          </div>
        </div>
        <div
          className="relative group"
          onClick={() => onNavigate(user?.role === 1 || user?.role === 2 ? 'followup' : 'schedules')}
        >
          <FiCalendar className="hover:text-orange-500 cursor-pointer transition-colors" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {count}
            </span>
          )}
          <div className="absolute hidden group-hover:block right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md p-2 z-50">
            <p className="text-xs text-gray-500">You have {count} schedule(s) today</p>
            <p className="text-xs text-gray-400 mt-1">Last checked: {lastChecked?.toLocaleTimeString()}</p>
          </div>
        </div>
        <FiBell className="hover:text-orange-500 cursor-pointer transition-colors" />
        <FiSettings className="hover:text-orange-500 cursor-pointer transition-colors" />
      </div>

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