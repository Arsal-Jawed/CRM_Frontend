import React, { useState } from 'react';
import { FaTimes, FaFileUpload } from 'react-icons/fa';
import CONFIG from '../Configuration';

function DocForm({ clientId, onClose, onUploaded }) {
  const [docName, setDocName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const IP = CONFIG.API_URL;
  const email = JSON.parse(localStorage.getItem('user')).email;

  const handleUpload = async () => {
    if (!docName || !file || loading) return;

    const formData = new FormData();
    formData.append('docName', docName);
    formData.append('clientId', clientId);
    formData.append('email', email);
    formData.append('file', file);

    setLoading(true);
    try {
      await fetch(`${IP}/docs/create`, {
        method: 'POST',
        body: formData
      });
      onUploaded?.();
      onClose();
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[300px] space-y-4 shadow-xl relative">
        <button onClick={onClose} disabled={loading} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
          <FaTimes />
        </button>
        <h2 className="text-lg font-semibold text-gray-700 text-center flex items-center gap-2 justify-center">
          <FaFileUpload /> Upload Document
        </h2>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-gray-600 mb-1">Document Type</label>
            <select
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-clr1"
            >
              <option value="" disabled>Select Document</option>
              <option value="Driving License">Driving License</option>
              <option value="IRS">IRS</option>
              <option value="Business License">Business License</option>
              <option value="Agreement Form">Agreement Form</option>
              <option value="Void Check">Void Check</option>
              <option value="Application Form">Application Form</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">File</label>
            <input
              type="file"
              disabled={loading}
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-clr1"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-3 py-1 bg-clr1 text-white text-sm rounded hover:opacity-90 flex items-center gap-2"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocForm;