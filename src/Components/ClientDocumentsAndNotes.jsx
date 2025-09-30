import React from 'react';
import { FiLayers, FiPlus, FiFileText, FiEdit2 } from 'react-icons/fi';
import { DocumentCard, DocForm } from '../Components';
import CONFIG from '../Configuration';

function ClientDocumentsAndNotes({ 
  client,
  docs,
  showDocForm,
  setShowDocForm,
  showNotesEdit,
  setShowNotesEdit,
  notesText,
  setNotesText
}) {
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

  return (
    <>
      {/* Documents Section */}
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

      {/* Notes Edit Modal */}
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
    </>
  );
}

export default ClientDocumentsAndNotes;