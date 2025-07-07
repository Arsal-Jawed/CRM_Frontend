import React, { useState } from 'react';
import { FaFileAlt, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import CONFIG from '../Configuration';

function DocumentCard({ doc, onEdit, onRemove }) {
  const [showPreview, setShowPreview] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [newName, setNewName] = useState(doc.docName);
  const IP = CONFIG.API_URL;

  const handleCardClick = async () => {
    if (doc.type === 'pdf') {
      const response = await fetch(doc.path.replace('/image/', '/raw/'));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      const fileName = doc.docName.endsWith('.pdf') ? doc.docName : `${doc.docName}.pdf`;
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      setShowPreview(true);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${IP}/docs/edit/${doc._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docName: newName })
      });
      if (res.ok) {
        onEdit?.();
        setShowEditModal(false);
      }
    } catch (err) {
      console.error('Edit failed', err);
    }
  };

  const handleRemove = async () => {
    try {
      const res = await fetch(`${IP}/docs/remove/${doc._id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        onRemove?.(doc._id);
        setShowConfirmDelete(false);
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <>
      <div
        className="relative p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-2 font-medium text-gray-800">
          <FaFileAlt className="text-clr1" size={14} />
          {doc.docName}
        </div>
        <p className="text-xs text-gray-500">{doc.type.toUpperCase()} - {new Date(doc.date).toLocaleDateString()}</p>

        <div className="absolute top-2 right-2 flex gap-2 z-10" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setShowEditModal(true)} className="text-gray-500 hover:text-gray-600">
            <FaEdit size={12} />
          </button>
          <button onClick={() => setShowConfirmDelete(true)} className="text-red-500 hover:text-red-600">
            <FaTrash size={12} />
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-[90vw] max-h-[90vh] overflow-auto relative p-5">
            <button onClick={() => setShowPreview(false)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
              <FaTimes />
            </button>
            <h2 className="text-base font-semibold text-gray-800 mb-3">{doc.docName}</h2>
            {doc.type === 'image' ? (
              <img src={doc.path} alt="Document" className="max-w-full max-h-[80vh] rounded" />
            ) : (
              <p className="text-sm text-gray-500">No preview available for this file type.</p>
            )}
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-[300px] relative shadow-xl">
            <button onClick={() => setShowEditModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
              <FaTimes />
            </button>
            <h2 className="text-base font-semibold text-gray-800 mb-4 text-center">Edit Document Name</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-clr1"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowEditModal(false)} className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-3 py-1 bg-clr1 text-white text-sm rounded hover:opacity-90">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-[300px] relative shadow-xl">
            <h2 className="text-base font-semibold text-gray-800 mb-4 text-center">Delete this document?</h2>
            <p className="text-sm text-gray-600 text-center mb-4">{doc.docName}</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowConfirmDelete(false)} className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleRemove} className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:opacity-90">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DocumentCard;
