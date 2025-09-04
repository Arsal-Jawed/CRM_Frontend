import React from 'react';
import { FaUser, FaBuilding, FaCalendarAlt } from 'react-icons/fa';

function LeadCard({ lead, onSelect, selected, users }) {
  const isClosureAssigned = lead.closure1 && lead.closure1 !== 'not specified';
  const truncateText = (text, maxLength = 15) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  // User mapping
  const createdByUser = users.find(u => u.email === lead.email);
  const displayName = createdByUser
    ? `${createdByUser.firstName} ${createdByUser.lastName}${createdByUser.isFired ? ' (Fired)' : ''}`
    : 'Unknown User';

  return (
    <div
      className={`cursor-pointer w-[100%] p-3 rounded-md shadow-sm transition-all duration-200 mb-2 border-l-4
      ${selected ? 'border-clr1 bg-gradient-to-r from-clr1/10 to-white'
        : isClosureAssigned ? 'border-green-500 bg-green-50 hover:shadow-md'
        : 'border-gray-200 bg-white hover:shadow-md'}`}
      onClick={() => onSelect(lead)}
    >
      <div className="flex items-start">
        <div className="w-6 h-6 rounded-full bg-clr1 flex items-center justify-center mr-2 mt-0.5">
          <FaUser className="text-white text-xs" />
        </div>

        <div className="space-y-[2px]">
          <h3 className="font-semibold text-sm text-gray-800 leading-tight">{displayName}</h3>

          <div className="flex items-center text-xs">
            <FaUser className="text-clr2 mr-1" size={10} />
            <span className="text-gray-600 truncate">{lead.person_name}</span>
          </div>

          <div className="flex items-center text-xs">
            <FaBuilding className="text-clr2 mr-1" size={10} />
            <span className="text-gray-600 truncate">{truncateText(lead.business_name, 15)}</span>
          </div>

          <div className="flex items-center text-xs text-gray-500">
            <FaCalendarAlt className="text-gray-400 mr-1" size={10} />
            <span>
              {new Date(lead.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadCard;