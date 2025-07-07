import React from 'react';
import { FaUser, FaBuilding, FaCalendarAlt, FaEnvelope } from 'react-icons/fa';

function SaleCard({ sale, isSelected, onClick }) {
  const lead = sale.lead || {};
  const formattedDate = lead.saleCloseDateTime 
    ? new Date(lead.saleCloseDateTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    : null;

  return (
    <div
      className={`cursor-pointer p-3 rounded-md shadow-sm transition-all duration-200 mb-2 border-l-4 relative
      ${isSelected ? 'border-clr1 bg-gradient-to-r from-clr1/10 to-white' : 'border-gray-200 bg-white hover:shadow-md hover:border-gray-300'}`}
      onClick={onClick}
    >
      {/* Date in top right corner */}
      {formattedDate && (
        <div className="absolute top-2 right-2 bg-clr1/10 text-clr1 text-xs px-2 py-0.5 rounded-full">
          {formattedDate}
        </div>
      )}

      <div className="flex items-start pr-8"> {/* Added pr-8 to prevent text overlap with date */}
        <div className="w-6 h-6 rounded-full bg-clr1 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
          <FaUser className="text-white text-xs" />
        </div>

        <div className="space-y-1 text-xs w-full">
          <div className="flex items-baseline flex-wrap">
            <h3 className="font-semibold text-sm text-gray-800 mr-1">{lead.person_name}</h3>
            {lead.ratedBy && (
              <span className="text-xs text-gray-500">({lead.ratedBy})</span>
            )}
          </div>

          <div className="flex items-center text-gray-800">
            <FaBuilding className="text-clr2 mr-1 flex-shrink-0" size={10} />
            <span className="truncate font-medium text-sm">{lead.business_name}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <FaEnvelope className="text-clr2 mr-1 flex-shrink-0" size={10} />
            <span className="truncate">{lead.personal_email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaleCard;