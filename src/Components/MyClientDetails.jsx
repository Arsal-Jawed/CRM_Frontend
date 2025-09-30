import React, { useEffect, useState, useRef } from 'react';
import CONFIG from '../Configuration';
import {
  DocumentCard, LeadEditForm, EquipementForm, EquipmentCard, AddEquipmentForm,
  SaleEditForm, DocForm, SelectClosureModel, ClientPersonalInfo,
  ClientEquipmentSection, ClientSaleDetails, ClientDocumentsAndNotes
} from '../Components';
import MyClientHeader from './MyClientHeader';
import { FiUser } from 'react-icons/fi';
import { FaUserPlus } from 'react-icons/fa';

function MyClientDetails({ client }) {
  const [docs, setDocs] = useState([]);
  const [showLeadEdit, setShowLeadEdit] = useState(false);
  const [showEquipEdit, setShowEquipEdit] = useState(false);
  const [showNewEquipForm, setShowNewEquipForm] = useState(false);
  const [showSaleEdit, setShowSaleEdit] = useState(false);
  const [showDocForm, setShowDocForm] = useState(false);
  const [showNotesEdit, setShowNotesEdit] = useState(false);
  const [notesText, setNotesText] = useState(client?.notes || '');
  const [showFollowUpPopup, setShowFollowUpPopup] = useState(false);


  const containerRef = useRef(null);

 useEffect(() => {
  if (client?.lead_id || client?._id) {
    const params = new URLSearchParams();
    if (client.lead_id) params.append('lead_id', client.lead_id);
    if (client._id) params.append('client_id', client._id);

    fetch(`${CONFIG.API_URL}/docs/clientDocs?${params.toString()}`)
      .then(res => res.json())
      .then(data => setDocs(data || []))
      .catch(() => setDocs([]));
  } else {
    setDocs([]);
  }
}, [client]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current) return;
      if (e.key === 'ArrowDown') {
        containerRef.current.scrollBy({ top: 50, behavior: 'smooth' });
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        containerRef.current.scrollBy({ top: -50, behavior: 'smooth' });
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderStars = (rating) => {
    const filled = '★'.repeat(rating);
    const empty = '☆'.repeat(5 - rating);
    return <span className="text-yellow-500 text-sm ml-1">{filled}{empty}</span>;
  };

  return (
    <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden group transition-all duration-200 hover:shadow-md">
      <div
        ref={containerRef}
        className="p-5 h-full overflow-y-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 group-hover:scrollbar-thumb-gray-400"
        tabIndex="0"
      >
        {client ? (
          <>
            <MyClientHeader
              client={client}
              onEditClick={() => setShowLeadEdit(true)}
              onFollowUpClick={() => setShowFollowUpPopup(true)}
              renderStars={renderStars}
            />

            <ClientPersonalInfo client={client} />

            <ClientEquipmentSection
              client={client}
              showNewEquipForm={showNewEquipForm}
              setShowNewEquipForm={setShowNewEquipForm}
            />

            <ClientSaleDetails
              client={client}
              showSaleEdit={showSaleEdit}
              setShowSaleEdit={setShowSaleEdit}
            />

            <ClientDocumentsAndNotes
              client={client}
              docs={docs}
              showDocForm={showDocForm}
              setShowDocForm={setShowDocForm}
              showNotesEdit={showNotesEdit}
              setShowNotesEdit={setShowNotesEdit}
              notesText={notesText}
              setNotesText={setNotesText}
            />

            {showLeadEdit && (
              <LeadEditForm
                lead={client}
                onClose={() => setShowLeadEdit(false)}
              />
            )}

            {showEquipEdit && (
              <EquipementForm
                clientId={client.lead_id}
                equipment={client.equipment[0]}
                onClose={() => setShowEquipEdit(false)}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400">
            <FiUser className="text-4xl mb-3" />
            <p className="text-sm">Select a client to view details</p>
          </div>
        )}
        
        {showFollowUpPopup && (
          <SelectClosureModel
            lead={client}
            onClose={() => setShowFollowUpPopup(false)}
          />
        )}
      </div>
    </div>
  );
}

export default MyClientDetails;