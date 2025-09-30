import React, { useState } from 'react';
import { FaUserCircle, FaStar, FaRegStar } from 'react-icons/fa'; // Import star icons
import { LeadEditForm } from '../Components';
import ClientHeader from './ClientHeader';
import ClientInfoGrid from './ClientInfoGrid';
import ClientActions from './ClientActions';

function ClientDetails({ client, onUpdate, setCalls }) {
  const [showEdit, setShowEdit] = useState(false);
  
  // 1. Define the renderStars function
  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = rating || 0;
    const stars = [];

    for (let i = 0; i < totalStars; i++) {
      if (i < filledStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return <div className="flex items-center">{stars}</div>;
  };

  // 2. Define the onFollowUpClick function (add your logic here)
  const handleFollowUpClick = () => {
    console.log("Follow-up button clicked for client:", client.person_name);
    // You can add logic here to open a follow-up modal, for example.
  };

  if (!client) {
    return (
      <div className="h-[36vh] bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <FaUserCircle className="mx-auto text-3xl text-gray-300 mb-2" />
          <p className="text-sm text-gray-500 font-medium">Select a client to view details</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-[38vh] bg-white p-4 rounded-xl shadow-xs border border-gray-100 flex flex-col">
        {/* 3. Pass the missing props to ClientHeader */}
        <ClientHeader 
          client={client} 
          onEditClick={() => setShowEdit(true)} 
          renderStars={renderStars}
          onFollowUpClick={handleFollowUpClick}
        />
        
        <ClientInfoGrid client={client} />
        
        <ClientActions 
          client={client} 
          onUpdate={onUpdate} 
          setCalls={setCalls} 
        />
      </div>

      {showEdit && (
        <LeadEditForm lead={client} onClose={() => setShowEdit(false)} onUpdate={onUpdate} />
      )}
    </>
  );
}

export default ClientDetails;