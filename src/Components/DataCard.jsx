import React from 'react';
import { FaTrash, FaEdit, FaCalendarAlt, FaEye, FaUserTie, FaBuilding, FaPhoneAlt } from 'react-icons/fa';
import CONFIG from '../Configuration';

function DataCard({ data, onDelete, onEdit, onView }) {
  const IP = CONFIG.API_URL;

  const handleDelete = async () => {
    await fetch(`${IP}/data/delete/${data._id}`, {
      method: 'DELETE'
    });
    onDelete();
  };

  const handleSchedule = async () => {
    await fetch(`${IP}/data/createSchedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheduler: data.user,
        details: data.details,
        schedule_date: data.followupDate
      })
    });
    alert('Schedule created');
  };

  return (
    <div className="relative w-[48%] min-w-[280px] p-3 mb-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all flex flex-col justify-between">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="text-[12px] font-semibold text-gray-800 leading-tight">
          {data.owner_name} <span className="text-gray-500">({data.business_name})</span>
        </div>
        <div className="text-[10px] text-gray-500 mt-0.5">
          {new Date(data.date).toLocaleDateString()}
        </div>
      </div>

      {/* Contact & Details */}
      <div className="mt-1 text-[11px] text-gray-600 space-y-1">
        <div className="flex items-center gap-1">
          <FaPhoneAlt size={9} className="text-gray-400" />
          <span>{data.business_contact}</span>
        </div>
        <div className="flex items-start gap-1">
          <FaUserTie size={9} className="text-gray-400 mt-[2px]" />
          <span className="line-clamp-2">{data.details}</span>
        </div>
        {data.followupDate && (
          <div className="flex items-center gap-1 text-blue-600 text-[10px]">
            <FaCalendarAlt size={9} />
            <span>{new Date(data.followupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end items-center gap-2 mt-3 pt-2 border-t border-gray-100">
        <button onClick={() => onEdit(data)} title="Edit" className="text-gray-500 hover:text-blue-600 p-1">
          <FaEdit size={11} />
        </button>
        <button onClick={handleSchedule} title="Schedule" className="text-gray-500 hover:text-green-600 p-1">
          <FaCalendarAlt size={11} />
        </button>
        <button onClick={handleDelete} title="Delete" className="text-gray-500 hover:text-red-600 p-1">
          <FaTrash size={11} />
        </button>
        <button onClick={() => onView(data)} title="View" className="ml-auto text-clr1 hover:text-clr2 p-1">
          <FaEye size={12} />
        </button>
      </div>
    </div>
  );
}

export default DataCard;