import React from 'react';
import { FaCrown, FaMedal } from 'react-icons/fa';

function PerformanceTableRow({ user, index, activeTab }) {
  const getIndexColor = (index) => {
    const num = parseFloat(index);
    if (num >= 8) return 'text-green-600';
    if (num >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 text-left">
        <div className="relative inline-block">
          {user.name}
          {index === 0 && (
            <FaCrown className="text-yellow-500 text-sm absolute -top-2 -right-2 transform rotate-12"/>
          )}
        </div>
      </td>

      <td className="px-3 py-2 whitespace-nowrap text-left">
        <span className={`px-1.5 py-0.5 text-[0.6vw] rounded-full ${
          user.role === 'LeadGen' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {user.role === 'LeadGen' ? 'Lead Gen' : 'Sales Closure'}
        </span>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-gray-600 text-left">{user.joinDate}</td>
      
      {activeTab === 'LeadGen' ? (
        <>
          <td className="px-3 py-2 whitespace-nowrap text-gray-600 text-left">{user.total}</td>
          <td className="px-3 py-2 whitespace-nowrap text-green-600 text-left">{user.won}</td>
          <td className="px-3 py-2 whitespace-nowrap text-red-600 text-left">{user.lost}</td>
          <td className="px-3 py-2 whitespace-nowrap text-yellow-600 text-left">{user.inProcess}</td>
          <td className="px-3 py-2 whitespace-nowrap text-blue-600 text-left">{user.winScore}</td>
          <td className="px-3 py-2 whitespace-nowrap text-yellow-600 text-left">{user.ratingScore}</td>
          <td className="px-3 py-2 whitespace-nowrap text-orange-500 text-left">{user.leadEfficiencyScore}</td>
          <td className="px-3 py-2 whitespace-nowrap text-red-600 text-left">{user.lossPenalty}</td>
        </>
      ) : (
        <>
          <td className="px-3 py-2 whitespace-nowrap text-green-600 text-left">{user.wonLeads}</td>
          <td className="px-3 py-2 whitespace-nowrap text-blue-600 text-left">{user.approvedSales}</td>
          <td className="px-3 py-2 whitespace-nowrap text-green-700 text-left">
            {user.totalLeaseAmount?.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}
          </td>
          <td className="px-3 py-2 whitespace-nowrap text-gray-600 text-left">{user.totalDocuments}</td>
          <td className="px-3 py-2 whitespace-nowrap text-gray-600 text-left">{user.totalEquipments}</td>
          <td className="px-3 py-2 whitespace-nowrap text-gray-600 text-left">{user.totalLeads}</td>
          <td className="px-3 py-2 whitespace-nowrap text-red-600 text-left">{user.lostLeads}</td>
          <td className="px-3 py-2 whitespace-nowrap text-red-500 text-left">{user.rejectedSales}</td>
          <td className="px-3 py-2 whitespace-nowrap text-orange-600 text-left">{user.buybackCases}</td>
        </>
      )}
      
      <td className="px-3 py-2 whitespace-nowrap text-left">
        <div className={`font-semibold ${getIndexColor(user.index)}`}>
          {user.index}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div
              className={`h-1.5 rounded-full ${
                parseFloat(user.index) >= 8 ? 'bg-green-500' :
                parseFloat(user.index) >= 5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${parseFloat(user.index) * 10}%` }}
            />
          </div>
        </div>
      </td>
    </tr>
  );
}

export default PerformanceTableRow;