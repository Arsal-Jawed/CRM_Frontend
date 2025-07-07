import React from 'react';

const Notification = ({ name, details, datetime }) => (
  <div className="bg-white border-l-4 border-orange-500 shadow p-4 rounded-md mb-3">
    <h3 className="text-sm font-semibold text-gray-800">{name}</h3>
    <p className="text-xs text-gray-600 mt-1">{details}</p>
    <span className="text-[11px] text-gray-400 mt-2 block">{datetime}</span>
  </div>
);

export default Notification;
