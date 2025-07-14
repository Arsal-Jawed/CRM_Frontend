import React, { useState } from 'react';
import {
  FaUser, FaEnvelope, FaPhone, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaStar,
  FaEdit, FaUserCircle, FaTrophy, FaTimesCircle, FaFileUpload, FaStickyNote, FaEye, FaTimes,FaQuoteLeft,
  FaLandmark, FaMoneyBillWave, FaCreditCard,FaToolbox
} from 'react-icons/fa';
import CONFIG from '../Configuration';
import { LeadEditForm, DocForm, RemarksForm, EquipementForm, AddEquipmentForm } from '../Components';

function ClientDetails({ client, onUpdate }) {
  const userData = JSON.parse(localStorage.getItem('user'));
  const name = userData.firstName + ' ' + userData.lastName;
  const userEmail = userData.email;

  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [statusModal, setStatusModal] = useState(null);
  const [showDocForm, setShowDocForm] = useState(false);
  const [showRemarksForm, setShowRemarksForm] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showEquipModal, setShowEquipModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const IP = CONFIG.API_URL;

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
  
   let assignDate = new Date().toISOString().slice(0, 10);
  if (client.closure1 === userEmail && client.assignDate1) {
    assignDate = new Date(client.assignDate1).toISOString().slice(0, 10);
  } else if (client.closure2 === userEmail && client.assignDate2) {
    assignDate = new Date(client.assignDate2).toISOString().slice(0, 10);
  }

  const isFinalStatus = client.status === 'won' || client.status === 'lost';
  const rating = client.rating || 0;
  const stars = Array(5).fill(0).map((_, i) => (
    <FaStar key={i} className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} text-xs`} />
  ));

  const handleRateSubmit = async () => {
    try {
      await fetch(`${IP}/leads/rate/${client._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: selectedRating, ratedBy: name })
      });
      setShowModal(false);
      setSelectedRating(null);
      setHoveredRating(0);
      onUpdate?.();
    } catch (err) {
      console.error('Rating update failed', err);
    }
  };

  const handleStatusSubmit = async () => {
    const route = statusModal === 'won' ? 'won' : 'loss';
    try {
      const response = await fetch(`${IP}/leads/${route}/${client._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userEmail })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setStatusModal(null);
    } catch (err) {
      setStatusModal(null);
      setErrorMessage(err.message);
    }
  };

  return (
    <>
      <div className="h-[38vh] bg-white p-4 rounded-xl shadow-xs border border-gray-100 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-clr1 text-lg" />
              <h2 className="text-base font-semibold text-gray-800">
                {client.person_name || 'Client'}
              </h2>
              <div className="flex items-center gap-1 ml-1">
                {stars}
                <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{client.business_name}</p>
          </div>
          <div className="flex flex-col items-end">
            <button
              onClick={() => setShowEdit(true)}
              className="text-gray-400 hover:text-clr1 p-1 rounded-full hover:bg-clr1/10 transition"
            >
              <FaEdit size={12} />
            </button>
            <span className="text-xs text-gray-400 mt-1">{client.lead_gen || 'Lead Source'}</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-3 overflow-y-hidden pr-1 hover:overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {[
            ['Personal Email', client.personal_email],
            ['Contact', client.contact],
            ['Business Email', client.business_email],
            ['Business Contact', client.business_contact],
            ['DOB', client.dob ? new Date(client.dob).toLocaleDateString() : '-'],
            ['SSN', client.ssn],
            ['DL Number', client.driversLicenseNumber],
            ['Ownership %', client.ownershipPercentage],
            ['Years in Business', client.yearsInBusiness],
            ['Business Role', client.businessRole],
            ['Locations', client.locations],
            ['Incorporate State', client.incorporateState],
            ['Sale Type', client.saleType],
            ['Address', client.address, true],
            // Bank related details
            ['Bank Name', client.bankName],
            ['RTN', client.rtn],
            ['Account Number', client.accountNumber],
            ['Account Type', client.accountType]
          ].map(([label, value, wide], i) => (
            <div key={i} className={`bg-gray-50 rounded-lg p-3 ${wide ? 'col-span-2' : ''}`}>
              <p className="text-[11px] text-gray-500 font-medium">{label}</p>
              <p className="text-xs text-gray-800 font-semibold truncate">{value ?? '-'}</p>
            </div>
          ))}
        </div>

        <div className="pt-3 flex flex-wrap gap-5 items-center justify-between">
          <div className="flex flex-wrap gap-4 text-xs font-medium">
            <button onClick={() => setShowModal(true)} disabled={isFinalStatus} className={`flex items-center gap-1 text-clr1 hover:underline ${isFinalStatus ? 'opacity-50 cursor-not-allowed hover:no-underline' : ''}`}>
              <FaStar className="text-yellow-400" /> Rate Lead
            </button>
            <button onClick={() => setShowEquipModal(true)} className="flex items-center gap-1 text-blue-500 hover:underline">
              <FaToolbox /> Equipment
            </button>
            <button onClick={() => setStatusModal('won')} disabled={isFinalStatus} className={`flex items-center gap-1 text-green-600 hover:underline ${isFinalStatus ? 'opacity-50 cursor-not-allowed hover:no-underline' : ''}`}>
              <FaTrophy /> Mark as Won
            </button>
            <button onClick={() => setStatusModal('lost')} disabled={isFinalStatus} className={`flex items-center gap-1 text-red-500 hover:underline ${isFinalStatus ? 'opacity-50 cursor-not-allowed hover:no-underline' : ''}`}>
              <FaTimesCircle /> Mark as Lost
            </button>
            <button onClick={() => setShowDocForm(true)} className="flex items-center gap-1 text-purple-500 hover:underline">
              <FaFileUpload /> Upload Docs
            </button>
            <button onClick={() => setShowRemarksForm(true)} className="flex items-center gap-1 text-gray-600 hover:underline">
              <FaStickyNote /> Add Remarks
            </button>
            <button onClick={() => setShowNotes(true)} className="flex items-center gap-1 text-orange-500 hover:underline">
              <FaEye /> View Notes
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FaCalendarAlt />
            <span>Assigned: {assignDate}</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[300px] space-y-4 shadow-xl">
            <h2 className="text-base font-semibold text-gray-800 text-center">Rate this Lead</h2>
            <div className="flex justify-center gap-1">
              {Array(5).fill(0).map((_, i) => {
                const index = i + 1;
                return (
                  <div
                    key={i}
                    className="relative cursor-pointer w-6 h-6"
                    onMouseMove={(e) => {
                      if (selectedRating !== null) return;
                      const { left, width } = e.currentTarget.getBoundingClientRect();
                      const isHalf = (e.clientX - left) < width / 2;
                      setHoveredRating(isHalf ? i + 0.5 : i + 1);
                    }}
                    onMouseLeave={() => {
                      if (selectedRating === null) setHoveredRating(0);
                    }}
                    onClick={(e) => {
                      const { left, width } = e.currentTarget.getBoundingClientRect();
                      const isHalf = (e.clientX - left) < width / 2;
                      setSelectedRating(isHalf ? i + 0.5 : i + 1);
                    }}
                  >
                    <FaStar
                      className={`absolute top-0 left-0 text-xl ${(selectedRating ?? hoveredRating) >= index ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                    {((selectedRating ?? hoveredRating) === i + 0.5) && (
                      <FaStar className="absolute top-0 left-0 text-xl text-yellow-400" style={{ width: '50%', overflow: 'hidden' }} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center text-sm text-gray-600 font-medium">
              {(selectedRating ?? hoveredRating) || 0} / 5
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => {
                setShowModal(false);
                setSelectedRating(null);
                setHoveredRating(0);
              }} className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={handleRateSubmit} disabled={selectedRating === null} className="text-sm px-3 py-1 bg-clr1 text-white rounded hover:opacity-90">Submit</button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <LeadEditForm lead={client} onClose={() => setShowEdit(false)} onUpdate={onUpdate} />
      )}

      {statusModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[300px] space-y-4 shadow-xl">
            <h2 className="text-base font-semibold text-gray-800 text-center">Confirm Status Change</h2>
            <p className="text-sm text-gray-600 text-center">
              Are you sure you want to mark this lead as <span className={`font-semibold ${statusModal === 'won' ? 'text-green-600' : 'text-red-500'}`}>{statusModal}</span>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setStatusModal(null)} className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={handleStatusSubmit} className={`text-sm px-3 py-1 rounded text-white hover:opacity-90 ${statusModal === 'won' ? 'bg-green-600' : 'bg-red-500'}`}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {showDocForm && (
        <DocForm clientId={client._id} onClose={() => setShowDocForm(false)} onUploaded={onUpdate} />
      )}

      {showRemarksForm && (
        <RemarksForm clientId={client._id} onClose={() => setShowRemarksForm(false)} onUpdated={onUpdate} leadGen={client.lead_gen} />
      )}
      {showNotes && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-5">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div className="flex items-center gap-2 text-clr1">
                <FaStickyNote className="text-lg" />
                <h3 className="text-base font-semibold text-gray-800">
                  {client.lead_gen || 'LeadGen'}'s Notes on this Client
                </h3>
              </div>
              <button
                onClick={() => setShowNotes(false)}
                className="text-gray-400 hover:text-clr1 transition"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-lg border">
              {client.notes ? (
                <>
                  <FaQuoteLeft className="text-gray-300 inline-block mr-2 mb-1" />
                  {client.notes}
                </>
              ) : (
                <p className="italic text-gray-400">No notes available</p>
              )}
            </div>
          </div>
        </div>
      )}
      {showEquipModal && (
        <AddEquipmentForm
          clientId={client.lead_id}
          onClose={() => setShowEquipModal(false)}
          onSuccess={() => {
            setShowEquipModal(false);
          }}
        />
      )}
      {errorMessage && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-[300px] p-5 space-y-4">
            <h2 className="text-base font-semibold text-red-600 text-center">Error</h2>
            <p className="text-sm text-gray-700 text-center whitespace-pre-wrap">{errorMessage}</p>
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setErrorMessage('')}
                className="text-sm px-4 py-1 bg-red-500 text-white rounded hover:opacity-90"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ClientDetails;