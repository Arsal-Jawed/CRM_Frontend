import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { LeadEditForm } from '../Components';
import ClientHeader from './ClientHeader';
import ClientInfoGrid from './ClientInfoGrid';
import ClientActions from './ClientActions';

function ClientDetails({ client, onUpdate, setCalls }) {
  const [showEdit, setShowEdit] = useState(false);

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
        <ClientHeader 
          client={client} 
          onEditClick={() => setShowEdit(true)} 
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