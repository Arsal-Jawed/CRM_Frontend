import React, { useEffect, useState, useRef } from 'react';
import CONFIG from '../Configuration';

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const IP = CONFIG.API_URL;

 useEffect(() => {
  const fetchNotifications = () => {
    fetch(`${IP}/notifications`)
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error('Failed to fetch notifications:', err));
  };
  fetchNotifications(); 
  const intervalId = setInterval(fetchNotifications, 10000);
  return () => clearInterval(intervalId);
}, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const newIndex = e.key === 'ArrowUp' 
          ? Math.max(0, focusedIndex - 1)
          : Math.min(notifications.length - 1, focusedIndex + 1);
        setFocusedIndex(newIndex);
        
        const elements = containerRef.current?.querySelectorAll('.notification-item');
        if (elements && elements[newIndex]) {
          elements[newIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }
      }
    };
  }, [focusedIndex, notifications.length]);

  return (
    <div 
      ref={containerRef}
      className="w-[28vw] h-[84vh] mr-4 bg-white rounded-2xl shadow-xl p-0 border border-orange-100 flex flex-col z-10"
    >
      {/* Header - now properly contained */}
      <div className="sticky top-0 bg-white p-6 pb-4 z-10 rounded-2xl">
        <h2 className="text-2xl font-bold text-orange-600 mb-1">Notifications</h2>
        <div className="h-[2px] bg-gradient-to-r from-orange-100 to-orange-300"></div>
      </div>

      {/* Notification List - with custom scroll prevention */}
      <div className="flex-1 overflow-hidden hover:overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="space-y-4 p-6 pt-4">
            {notifications.map((n, i) => (
              <div
                key={i}
                className={`notification-item p-4 border rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 shadow-sm hover:shadow-md ${
                  focusedIndex === i ? 'ring-2 ring-orange-400' : 'border-orange-200'
                }`}
                tabIndex={0}
                onFocus={() => setFocusedIndex(i)}
              >
                <h3 className="text-md font-semibold text-orange-800">{n.notifier}</h3>
                <p className="text-sm text-orange-700 mt-1">{n.detail}</p>
                <p className="text-xs text-orange-500 mt-2 font-medium">
                  {new Date(n.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-orange-400">
            No notifications available
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationContainer;