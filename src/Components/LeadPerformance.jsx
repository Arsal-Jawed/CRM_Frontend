import { useEffect, useState } from 'react';
import { FaUsers, FaTrophy, FaTimes, FaSync, FaStar, FaClock } from 'react-icons/fa';
import CONFIG from '../Configuration';

function LeadPerformance() {
  const [performanceData, setPerformanceData] = useState({
    totalLeads: 0,
    wonLeads: 0,
    lostLeads: 0,
    inProcess: 0,
    pending: 0,
    rejected: 0,
    rating: 0,
    points: 0
  });

  const IP = CONFIG.API_URL;
  const email = JSON.parse(localStorage.getItem('user')).email;

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`${IP}/leads/email/${email}`);
        const leads = await res.json();

        const total = leads.length;
        const won = leads.filter(l => l.status === 'won').length;
        const lost = leads.filter(l => l.status === 'lost').length;
        const inProcess = leads.filter(l => l.status === 'in process').length;
        const pending = leads.filter(l => l.status === 'pending').length;
        const rejected = leads.filter(l => l.status === 'rejected').length;

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyInProcess = leads.filter(l => {
          const date = new Date(l.createdAt);
          return (
            l.status === 'in process' &&
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        }).length;

        const ratings = leads.map(l => l.rating).filter(Boolean);
        const avgRating = ratings.length
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;

        setPerformanceData({
          totalLeads: total,
          wonLeads: won,
          lostLeads: lost,
          inProcess,
          pending,
          rejected,
          rating: avgRating,
          points: monthlyInProcess
        });
      } catch (err) {
        console.error('Failed to fetch leads by email', err);
      }
    };

    fetchLeads();
  }, [email]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      else if (i === fullStars && hasHalfStar) stars.push(<FaStar key={i} className="text-yellow-400 opacity-50 text-sm" />);
      else stars.push(<FaStar key={i} className="text-gray-300 text-sm" />);
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-700 flex items-center gap-2">
          <span className="flex items-center">
            <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="..." clipRule="evenodd" />
            </svg>
            Performance
          </span>
          <span className="text-xs text-gray-400 font-normal">
            ({performanceData.points} pts)
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(performanceData.rating)}</div>
          <p className="text-sm font-bold text-purple-800">
            {performanceData.rating.toFixed(1)}/5
          </p>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <FaUsers className="text-blue-500 text-lg" />
            <p className="text-sm font-medium text-blue-700">Total</p>
          </div>
          <p className="text-lg font-bold text-blue-900">{performanceData.totalLeads}</p>
        </div>

        <div className="bg-green-50 p-3 rounded-lg border border-green-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <FaTrophy className="text-green-500 text-lg" />
            <p className="text-sm font-medium text-green-700">Won</p>
          </div>
          <p className="text-lg font-bold text-green-900">{performanceData.wonLeads}</p>
        </div>

        <div className="bg-red-50 p-3 rounded-lg border border-red-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <FaTimes className="text-red-500 text-lg" />
            <p className="text-sm font-medium text-red-700">Lost</p>
          </div>
          <p className="text-lg font-bold text-red-900">{performanceData.lostLeads}</p>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <FaSync className="text-yellow-500 text-lg" />
            <p className="text-sm font-medium text-yellow-700">In Process</p>
          </div>
          <p className="text-lg font-bold text-yellow-900">{performanceData.inProcess}</p>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <FaClock className="text-purple-500 text-lg" />
            <p className="text-sm font-medium text-purple-700">Pending</p>
          </div>
          <p className="text-lg font-bold text-purple-900">{performanceData.pending}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <FaTimes className="text-gray-500 text-lg" />
            <p className="text-sm font-medium text-gray-700">Rejected</p>
          </div>
          <p className="text-lg font-bold text-gray-900">{performanceData.rejected}</p>
        </div>
      </div>
    </div>
  );
}

export default LeadPerformance;