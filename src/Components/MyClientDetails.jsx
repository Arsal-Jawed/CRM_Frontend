import React, { useEffect, useState, useRef } from 'react';
import CONFIG from '../Configuration';
import { DocumentCard, LeadEditForm, EquipementForm, EquipmentCard, AddEquipmentForm,SaleEditForm, DocForm,SelectClosureModel } from '../Components';
import {
  FiUser, FiBriefcase, FiStar, FiMail, FiPhone, FiHome,
  FiCalendar, FiFileText, FiDollarSign, FiCreditCard,
  FiPercent, FiMapPin, FiClock, FiCheckCircle, FiTruck,
  FiAward, FiGlobe, FiLayers, FiEdit2,FiPlus
} from 'react-icons/fi';
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

  const getApplicationStatus = () => {
    if (client?.status === 'won') return client.sale?.approvalStatus || 'Pending';
    return client.sale?.leaseApprovalStatus || 'Pending';
  };
 const handleNotesSave = () => {
  fetch(`${CONFIG.API_URL}/leads/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: client._id,
      notes: notesText
    })
  })
    .then(res => res.json())
    .then(data => {
      client.notes = notesText;
      setShowNotesEdit(false);
    })
    .catch(err => {
      console.error('Error updating notes:', err);
      alert('Failed to update notes.');
    });
};

  const renderStars = (rating) => {
    const filled = '★'.repeat(rating);
    const empty = '☆'.repeat(5 - rating);
    return <span className="text-yellow-500 text-sm ml-1">{filled}{empty}</span>;
  };

  const InfoItem = ({ icon, label, value, colSpan = 1 }) => (
    <div className={`flex items-start space-x-2 col-span-${colSpan}`}>
      <div className="text-clr1 mt-0.5">{icon}</div>
      <div>
        <p className="font-medium text-gray-500 text-xs">{label}</p>
        <p className="text-gray-800 text-[0.8vw]">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden group transition-all duration-200 hover:shadow-md">
      <div
        ref={containerRef}
        className="p-5 h-[82vh] overflow-y-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 group-hover:scrollbar-thumb-gray-400"
        tabIndex="0"
      >
        {client ? (
          <>
            <div className="pb-4 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h2 className="text-[1.1vw] font-semibold text-gray-800 flex items-center">
                  <FiUser className="mr-2 text-clr1" />
                  {client.person_name} {client.legal_name ? `(${client.legal_name})` : ''}
                </h2>
                <p className="text-gray-600 text-[0.9vw] flex items-center mt-1">
                  <FiBriefcase className="mr-2 text-clr2" />
                  {client.business_name}
                </p>
                {client.notes && (
                  <p className="text-gray-500 text-[0.7vw] flex items-center mt-1">
                    <FiFileText className="mr-2 text-clr3" />
                    {client.notes}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end">
                <button
                  className="text-sm text-clr1 hover:text-clr2"
                  onClick={() => setShowLeadEdit(true)}
                >
                  <FiEdit2 className="text-lg" />
                </button>
                <div className="flex flex-col items-end mt-2">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">Rating:</span>
                  {renderStars(client.rating)}
                </div>

                <div className="text-gray-400 text-xs mt-1">
                  {client.ratingDate?.slice(0, 10) || ''}
                </div>

                <div className="flex items-center text-[0.8vw] text-gray-500 mt-1 space-x-2">
                  <FiUser className="text-clr1" />
                  <span>
                    {client.closure1 ? client.closure1Name : 'Not Specified'}
                  </span>
                  <button
                    onClick={() => setShowFollowUpPopup(true)}
                    title="Assign Follow-up"
                    className="text-clr1 hover:text-clr2"
                  >
                    <FiEdit2 className="text-base" />
                  </button>
                </div>
              </div>
                <div className="text-gray-400 text-xs mt-1">
                  {client.ratingDate?.slice(0, 10) || ''}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${client.status === 'won' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {client.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                getApplicationStatus() === 'Approved'
                  ? 'bg-green-100 text-green-800'
                  : getApplicationStatus() === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800' : getApplicationStatus() === 'Underwriting'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {client.status === 'won' ? 'Application' : 'Lease'}: {getApplicationStatus()}
              </span>
              <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                client.sale?.leaseApprovalStatus === 'Approved'
                  ? 'bg-green-100 text-green-800'
                  : client.sale?.leaseApprovalStatus === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              Lease: {client.sale?.leaseApprovalStatus || 'N/A'}
            </span>

                {client.sale?.creditScore && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Credit Score: {client.sale.creditScore}
                  </span>
                )}
            </div>

            {/* Personal Information Section */}
            <div className="mt-6">
              <h3 className="text-clr1 font-medium mb-3 flex items-center">
                <FiUser className="mr-2" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<FiMail />} label="Email" value={client.personal_email} />
                <InfoItem icon={<FiPhone />} label="Contact" value={client.contact} />
                <InfoItem icon={<FiHome />} label="Address" value={client.address} />
                <InfoItem icon={<FiCalendar />} label="Date of Birth" value={client.dob?.slice(0, 10)} />
                <InfoItem icon={<FiCreditCard />} label="SSN" value={client.ssn} />
                <InfoItem icon={<FiCreditCard />} label="Driver License #" value={client.driversLicenseNumber} />
              </div>
            </div>

            {/* Business Information Section */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-clr1 font-medium mb-3 flex items-center">
                <FiBriefcase className="mr-2" />
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<FiMail />} label="Business Email" value={client.business_email} />
                <InfoItem icon={<FiPhone />} label="Business Contact" value={client.business_contact} />
                <InfoItem icon={<FiFileText />} label="Business Role" value={client.businessRole} />
                <InfoItem icon={<FiPercent />} label="Ownership %" value={client.ownershipPercentage} />
                <InfoItem icon={<FiCalendar />} label="Established" value={client.established} />
                <InfoItem icon={<FiHome />} label="Business Address" value={client.business_address} />
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="mt-6 bg-clr1 bg-opacity-5 p-4 rounded-lg border border-clr1 border-opacity-20">
              <h3 className="text-clr1 font-medium mb-3 flex items-center">
                <FiCreditCard className="mr-2" />
                Bank Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<FiBriefcase />} label="Bank" value={client.bankName} />
                <InfoItem icon={<FiCreditCard />} label="RTN" value={client.rtn} />
                <InfoItem icon={<FiCreditCard />} label="Account #" value={client.accountNumber} />
              </div>
            </div>

            {/* Equipment Section */}
            {client.equipment && client.equipment.length > 0 && (
            <div className="mt-6 bg-white p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-clr1 font-medium flex items-center">
                <FiLayers className="mr-2" />
                Equipment Details
              </h3>
              <button
                onClick={() => setShowNewEquipForm(true)}
                className="text-clr1 hover:text-clr2 text-sm p-1 rounded-full border border-clr1"
                title="Add Equipment"
              >
                <FiPlus size={16} />
              </button>
            </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {client.equipment.map((eq, i) => (
                    <EquipmentCard key={i} equipment={eq} />
                  ))}
                </div>

        {showNewEquipForm && (
          <AddEquipmentForm
            clientId={client.lead_id}
            onClose={() => setShowNewEquipForm(false)}
            onSuccess={() => {
              setShowNewEquipForm(false);
              // optionally refetch client details
            }}
          />
        )}
      </div>
        )}
            {/* Sale Details Section */}
            {client.sale && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-clr1 font-medium flex items-center">
                    <FiDollarSign className="mr-2" />
                    Sale Details
                  </h3>
                  <button
                    onClick={() => setShowSaleEdit(true)}
                    className="text-clr1 hover:text-clr2 text-sm p-1 rounded-full border border-clr1"
                    title="Edit Sale"
                  >
                    <FiEdit2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem icon={<FiCalendar />} label="Submit Date" value={client.sale.submitDate?.slice(0, 10)} />
                  <InfoItem icon={<FiCheckCircle />} label="Approval Status" value={client.sale.approvalStatus} />
                  <InfoItem icon={<FiCalendar />} label="Approval Date" value={client.sale.approveDate?.slice(0, 10)} />
                  <InfoItem icon={<FiCalendar />} label="Delivered Date" value={client.sale.deliveredDate?.slice(0, 10)} />
                  <InfoItem icon={<FiUser />} label="Activated By" value={client.sale.activatedBy} />
                  <InfoItem icon={<FiCalendar />} label="Activation Date" value={client.sale.activationDate?.slice(0, 10)} />
                  <InfoItem icon={<FiCalendar />} label="Lease Submit Date" value={client.sale.leaseSubmitDate?.slice(0, 10)} />
                  <InfoItem icon={<FiCheckCircle />} label="Lease Approval Status" value={client.sale.leaseApprovalStatus} />
                  <InfoItem icon={<FiCalendar />} label="Lease Approval Date" value={client.sale.leaseApprovalDate?.slice(0, 10)} />
                  <InfoItem icon={<FiGlobe />} label="Leasing Company" value={client.sale.leasingCompany} />
                </div>
              </div>
            )}
            {showSaleEdit && (
              <SaleEditForm
                sale={client.sale}
                onClose={() => setShowSaleEdit(false)}
                clientId={client._id}
              />
            )}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-clr1 font-medium flex items-center">
                  <FiLayers className="mr-2" />
                  Client Documents
                </h3>
                <button
                  onClick={() => setShowDocForm(true)}
                  className="text-clr1 hover:text-clr2 text-sm p-1 rounded-full border border-clr1"
                  title="Add Document"
                >
                  <FiPlus size={16} />
                </button>
              </div>
              {docs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {docs.map(doc => (
                    <DocumentCard key={doc._id} doc={doc} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No documents uploaded yet.</p>
              )}
            </div>
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
        {showDocForm && (
        <DocForm
          clientId={client.lead_id}
          onClose={() => setShowDocForm(false)}
          onSuccess={() => {
            setShowDocForm(false);
          }}
            />
          )}
          {/* Client Remarks / Notes Section */}
          {client && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg relative">
            <h3 className="text-clr1 font-medium mb-2 flex items-center">
              <FiFileText className="mr-2" />
              Remarks
            </h3>

            <button
              className="absolute top-3 right-3 text-clr1 hover:text-clr2"
              onClick={() => setShowNotesEdit(true)}
              title="Edit Notes"
            >
              <FiEdit2 size={16} />
            </button>

            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mt-2">
              {client.notes || 'No remarks available for this client.'}
            </p>
          </div>
        )}
        {showNotesEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] max-w-md">
              <h3 className="text-lg font-semibold mb-3 text-clr1">Edit Client Notes</h3>
              
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                className="w-full border rounded p-2 text-sm outline-none"
                rows={5}
                placeholder="Enter notes here..."
              />

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => setShowNotesEdit(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-clr1 text-white text-sm px-3 py-1 rounded hover:bg-clr2"
                  onClick={handleNotesSave}
                >
                  Save
                </button>
              </div>
            </div>
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