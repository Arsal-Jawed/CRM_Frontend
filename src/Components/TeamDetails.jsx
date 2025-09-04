import React from 'react';
import { FaUserTie, FaBullseye, FaStar as FaSolidStar } from 'react-icons/fa';

function TeamDetails({ selectedTeam }) {
  const renderStars = rating => {
    const full = Math.floor(rating || 0);
    const hasHalf = (rating || 0) % 1 >= 0.5;
    return Array(5).fill().map((_, i) => (
      <FaSolidStar
        key={i}
        className={`text-${i < full ? 'yellow' : 'gray'}-400 ${i === full && hasHalf ? 'opacity-50' : ''}`}
      />
    ));
  };

  if (!selectedTeam) return null;

  return (
    <div className="bg-gradient-to-r from-clr1/5 to-white p-6 rounded-xl border border-gray-100 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedTeam.teamName}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <FaUserTie className="text-clr1 mr-2" />
              <span>Leader: {selectedTeam.TeamLeaderName}</span>
            </div>
            <div className="flex items-center">
              <FaBullseye className="text-clr1 mr-2" />
              <span>{selectedTeam.teamGoal}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            {renderStars(selectedTeam.teamRating)}
            <span className="ml-2 text-sm font-medium text-gray-700">
              {(selectedTeam.teamRating || 0).toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-1">Team Rating</span>
        </div>
      </div>
    </div>
  );
}

export default TeamDetails;