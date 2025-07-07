import React, { useState } from 'react';
import { FaPhone, FaCalendarAlt, FaClock, FaStickyNote, FaUser, FaEdit } from 'react-icons/fa';
import CONFIG from '../Configuration';

function CallCard({ call }) {
  const [showModal, setShowModal] = useState(false);
  const [editedRemarks, setEditedRemarks] = useState(call.remarks || '');

  const callDate = new Date(call.date);
  const formattedDate = callDate.toLocaleDateString();
  const formattedTime = callDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const IP = CONFIG.API_URL;

  const handleSave = async () => {
  try {
    const response = await fetch(`${IP}/calls/edit/${call._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remarks: editedRemarks })
    });

    if (response.ok) {
      call.remarks = editedRemarks;
      setShowModal(false);
    } else {
      console.error('Failed to update remarks');
    }
  } catch (err) {
    console.error('Error while updating remarks:', err);
  }
};


  return (
    <>
      <div className="relative bg-white border-l-4 border-clr1 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 text-sm">
        {/* Edit icon */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-clr1"
          onClick={() => setShowModal(true)}
        >
          <FaEdit size={12} />
        </button>

        <div className="flex gap-2 items-start">
          <div className="w-8 h-8 rounded-full bg-clr1 flex items-center justify-center mt-0.5">
            <FaUser className="text-white text-xs" />
          </div>

          <div className="flex-1 space-y-1">
            <p className="font-semibold text-gray-800">{call.caller}</p>

            {call.phoneNumber && (
              <div className="flex items-center text-xs text-gray-600">
                <FaPhone className="mr-1 text-gray-400" size={10} />
                <span>{call.phoneNumber}</span>
              </div>
            )}

            <div className="flex items-center text-xs text-gray-600">
              <FaClock className="mr-1 text-gray-400" size={10} />
              <span>{formattedTime}</span>
            </div>

            <div className="flex items-center text-xs text-gray-600">
              <FaCalendarAlt className="mr-1 text-gray-400" size={10} />
              <span>{formattedDate}</span>
            </div>

            {call.duration && (
              <div className="flex items-center text-xs text-gray-600">
                <FaClock className="mr-1 text-gray-400" size={10} />
                <span>Duration: {call.duration}</span>
              </div>
            )}

            {call.remarks && (
              <div className="pt-2 border-t border-gray-100 flex items-start gap-2 text-xs text-gray-700">
                <FaStickyNote className="text-clr2 mt-0.5" size={12} />
                <p className="italic leading-snug">{call.remarks}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for editing remarks */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white p-5 rounded-lg w-[90%] max-w-md shadow-xl space-y-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">Edit Remarks</h3>
            <textarea
              className="w-full h-24 border border-gray-300 rounded p-2 text-sm focus:ring-clr1 focus:outline-none"
              value={editedRemarks}
              onChange={(e) => setEditedRemarks(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm rounded bg-clr1 text-white hover:bg-clr1/90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CallCard;