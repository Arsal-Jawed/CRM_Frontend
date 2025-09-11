import React, { useState } from 'react';
import {
  FaStar, FaTrophy, FaTimesCircle, FaFileUpload, FaStickyNote, FaEye, FaTimes,
  FaQuoteLeft, FaToolbox, FaSpinner, FaCalendarAlt
} from 'react-icons/fa';
import CONFIG from '../Configuration';
import { DocForm, AddEquipmentForm, CallForm } from '../Components';

function ClientActions({ client, onUpdate, setCalls }) {
  const userData = JSON.parse(localStorage.getItem('user'));
  const userEmail = userData.email;

  const [showModal, setShowModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [statusModal, setStatusModal] = useState(null);
  const [showDocForm, setShowDocForm] = useState(false);
  const [showRemarksForm, setShowRemarksForm] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showEquipModal, setShowEquipModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusRating, setStatusRating] = useState(null);
  const [hoveredStatusRating, setHoveredStatusRating] = useState(0);
  const [statusLoading, setStatusLoading] = useState(false);

  const IP = CONFIG.API_URL;

  let assignDate = new Date().toISOString().slice(0, 10);
  if (client.closure1 === userEmail && client.assignDate1) {
    assignDate = new Date(client.assignDate1).toISOString().slice(0, 10);
  } else if (client.closure2 === userEmail && client.assignDate2) {
    assignDate = new Date(client.assignDate2).toISOString().slice(0, 10);
  }

  const isFinalStatus = client.status === 'won' || client.status === 'lost';

  const handleRateSubmit = async () => {
    try {
      await fetch(`${IP}/leads/rate/${client._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: selectedRating, ratedBy: userEmail })
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
    try {
      setStatusLoading(true);

      if (statusRating) {
        const res = await fetch(`${IP}/leads/rate/${client._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: statusRating, ratedBy: userEmail })
        });
        if (!res.ok) throw new Error("Failed to submit rating");
      }

      const route = statusModal === "won" ? "won" : "loss";
      const response = await fetch(`${IP}/leads/${route}/${client._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userEmail })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatusModal(null);
      setStatusRating(null);
      setHoveredStatusRating(0);
      onUpdate?.();
    } catch (err) {
      setStatusModal(null);
      setErrorMessage(err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <>
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

      {/* Rating Modal */}
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

      {/* Status Modal */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[300px] space-y-4 shadow-xl">
            <h2 className="text-base font-semibold text-gray-800 text-center">
              Confirm Status Change
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Are you sure you want to mark this lead as{" "}
              <span
                className={`font-semibold ${
                  statusModal === "won" ? "text-green-600" : "text-red-500"
                }`}
              >
                {statusModal}
              </span>
              ?
            </p>

            {/* Rating stars */}
            <div className="flex justify-center gap-1 pt-2">
              {Array(5)
                .fill(0)
                .map((_, i) => {
                  const index = i + 1;
                  return (
                    <div
                      key={i}
                      className="relative cursor-pointer w-6 h-6"
                      onMouseMove={(e) => {
                        if (statusRating !== null) return;
                        const { left, width } = e.currentTarget.getBoundingClientRect();
                        const isHalf = e.clientX - left < width / 2;
                        setHoveredStatusRating(isHalf ? i + 0.5 : i + 1);
                      }}
                      onMouseLeave={() => {
                        if (statusRating === null) setHoveredStatusRating(0);
                      }}
                      onClick={(e) => {
                        const { left, width } = e.currentTarget.getBoundingClientRect();
                        const isHalf = e.clientX - left < width / 2;
                        setStatusRating(isHalf ? i + 0.5 : i + 1);
                      }}
                    >
                      <FaStar
                        className={`absolute top-0 left-0 text-xl ${
                          (statusRating ?? hoveredStatusRating) >= index
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                      {(statusRating ?? hoveredStatusRating) === i + 0.5 && (
                        <FaStar
                          className="absolute top-0 left-0 text-xl text-yellow-400"
                          style={{ width: "50%", overflow: "hidden" }}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
            <div className="flex justify-center text-sm text-gray-600 font-medium">
              {(statusRating ?? hoveredStatusRating) || 0} / 5
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setStatusModal(null)}
                className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                  onClick={handleStatusSubmit}
                  disabled={statusLoading}
                  className={`text-sm px-3 py-1 rounded text-white flex items-center gap-2 hover:opacity-90 ${
                    statusModal === "won" ? "bg-green-600" : "bg-red-500"
                  } ${statusLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {statusLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Form Modal */}
      {showDocForm && (
        <DocForm clientId={client.lead_id} onClose={() => setShowDocForm(false)} onUploaded={onUpdate} />
      )}

      {/* Remarks Form Modal */}
      {showRemarksForm && (
        <CallForm
          onClose={() => setShowRemarksForm(false)}
          onSave={(newCall) => {
            if (typeof setCalls === 'function') {
              setCalls(prev => [...prev, { _id: Date.now().toString(), ...newCall }])
            }
          }}
          clientId={client}
        />
      )}

      {/* Notes Modal */}
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

      {/* Equipment Modal */}
      {showEquipModal && (
        <AddEquipmentForm
          clientId={client.lead_id}
          onClose={() => setShowEquipModal(false)}
          onSuccess={() => {
            setShowEquipModal(false);
          }}
        />
      )}

      {/* Error Modal */}
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

export default ClientActions;