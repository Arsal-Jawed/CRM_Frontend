import { FaUsers, FaBriefcase, FaUserTie, FaUserAltSlash, FaUserCog, FaCogs } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import CONFIG from '../Configuration';

function UserStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${CONFIG.API_URL}/users/getUserStats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  if (!stats) return null;

  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-800', label: 'text-blue-600' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-800', label: 'text-yellow-600' },
    green: { bg: 'bg-green-50', text: 'text-green-800', label: 'text-green-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-800', label: 'text-purple-600' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-800', label: 'text-indigo-600' },
    red: { bg: 'bg-red-50', text: 'text-red-800', label: 'text-red-600' }
  };

  const items = [
    { label: 'Total Employees', value: stats.total, icon: <FaUsers className="text-blue-500 text-2xl" />, color: 'blue' },
    { label: 'Managers', value: stats.managers, icon: <FaUserCog className="text-yellow-500 text-2xl" />, color: 'yellow' },
    { label: 'Sales Closures', value: stats.salesClosures, icon: <FaBriefcase className="text-green-500 text-2xl" />, color: 'green' },
    { label: 'Lead Gens', value: stats.leadGens, icon: <FaUserTie className="text-purple-500 text-2xl" />, color: 'purple' },
    { label: 'Operation Agents', value: stats.operations, icon: <FaCogs className="text-indigo-500 text-2xl" />, color: 'indigo' },
    { label: 'Fired', value: stats.fired, icon: <FaUserAltSlash className="text-red-500 text-2xl" />, color: 'red' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Accounts Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {items.map((s, i) => {
          const color = colorMap[s.color];
          return (
            <div
              key={i}
              className={`${color.bg} rounded-lg p-3 shadow hover:shadow-md transform hover:scale-[1.02] transition duration-200`}
            >
              <div className="flex items-center justify-between">
                {React.cloneElement(s.icon, { className: s.icon.props.className + ' text-lg' })}
                <p className={`${color.text} font-semibold text-lg`}>{s.value}</p>
              </div>
              <p className={`${color.label} text-[0.7vw] mt-2 font-medium`}>{s.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserStats;
