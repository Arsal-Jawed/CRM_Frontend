import React from 'react';
import { FaCalendarPlus, FaEdit, FaUserPlus } from 'react-icons/fa';

function FollowUpTableRow({ 
  lead, 
  index, 
  handleClick, 
  setShowScheduleModal, 
  setSelectedLead, 
  setEditLead, 
  setShowSecondClosureModal, 
  email 
}) {
  const getBadge = (status) => {
    const map = {
      'in process': 'bg-yellow-100 text-yellow-700',
      won: 'bg-green-100 text-green-700',
      lost: 'bg-red-100 text-red-700',
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          map[status] || 'bg-gray-100 text-gray-700'
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <tr
      className="hover:bg-gray-50 transition cursor-pointer"
      onClick={() => handleClick(lead)}
      tabIndex={0}
    >
      <td className="px-2 py-2">{index + 1}</td>
      <td className="px-2 py-2">
        <div className="font-medium">{lead.person_name}</div>
        <div className="text-[10px] text-gray-500">{lead.business_name}</div>
      </td>
      <td className="px-2 py-2">{lead.personal_email}</td>
      <td className="px-2 py-2">{lead.contact}</td>
      <td className="px-2 py-2">{getBadge(lead.status)}</td>
      <td className="px-2 py-2">{lead.date}</td>
      <td className="px-2 py-2 flex mt-3 gap-2 items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowScheduleModal(true);
            setSelectedLead(lead);
          }}
          className="text-clr1 hover:text-orange-700"
          title="Schedule Follow-up"
        >
          <FaCalendarPlus />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditLead(lead);
          }}
          className="text-blue-500 hover:text-blue-700"
          title="Edit Lead"
        >
          <FaEdit />
        </button>

        {lead.closure1 === email && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSecondClosureModal(true);
              setSelectedLead(lead);
            }}
            className="text-purple-500 hover:text-purple-700"
            title="Assign Second Closure"
          >
            <FaUserPlus />
          </button>
        )}
      </td>
    </tr>
  );
}

export default FollowUpTableRow;