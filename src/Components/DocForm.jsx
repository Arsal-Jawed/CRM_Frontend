import React, { useState } from 'react';
import { 
  FaTimes, 
  FaFileUpload, 
  FaIdCard, 
  FaReceipt, 
  FaBuilding, 
  FaFileContract, 
  FaMoneyCheckAlt, 
  FaClipboardList,
  FaUpload
} from 'react-icons/fa';
import CONFIG from '../Configuration';

const DOC_TYPES = [
  { name: "Driving License", icon: <FaIdCard className="text-clr1" /> },
  { name: "IRS", icon: <FaReceipt className="text-clr1" /> },
  { name: "Business License", icon: <FaBuilding className="text-clr1" /> },
  { name: "Agreement Form", icon: <FaFileContract className="text-clr1" /> },
  { name: "Void Check", icon: <FaMoneyCheckAlt className="text-clr1" /> },
  { name: "Application Form", icon: <FaClipboardList className="text-clr1" /> }
];

function DocForm({ clientId, onClose, onUploaded }) {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const IP = CONFIG.API_URL;
  const email = JSON.parse(localStorage.getItem('user')).email;

  const handleFileChange = (docName, file) => {
    setFiles((prev) => ({ ...prev, [docName]: file }));
  };

  const handleUpload = async () => {
    if (loading) return;
    const selectedDocs = Object.entries(files).filter(([_, file]) => file);

    if (selectedDocs.length === 0) return;

    const formData = new FormData();
    formData.append("clientId", clientId);
    formData.append("email", email);

    selectedDocs.forEach(([docName, file]) => {
      formData.append("docNames", docName);
      formData.append("files", file);
    });

    setLoading(true);
    try {
      await fetch(`${IP}/docs/uploadMultiple`, {
        method: "POST",
        body: formData
      });
      onUploaded?.();
      onClose();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-[380px] space-y-3 shadow-xl relative h-[82vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          disabled={loading} 
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors text-sm"
        >
          <FaTimes />
        </button>
        
        <div className="text-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Upload Documents</h2>
          <p className="text-xs text-gray-500 mt-1">Select files of your client</p>
        </div>

        <div className="space-y-2 text-xs border rounded-md p-3 bg-gray-50 max-h-[60vh] overflow-y-auto">
          {DOC_TYPES.map((doc) => (
            <div key={doc.name} className="flex items-center gap-2 p-1 hover:bg-white rounded transition-colors">
              <div className="text-base">
                {doc.icon}
              </div>
              <div className="flex-1">
                <label className="block text-gray-600 mb-0.5 font-medium text-xs">{doc.name}</label>
                <input
                  type="file"
                  disabled={loading}
                  onChange={(e) => handleFileChange(doc.name, e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-clr2/30 file:text-clr1 hover:file:bg-clr2/40"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <p className="text-xs text-gray-500">
            {Object.keys(files).filter(key => files[key]).length} file(s) selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1.5 bg-gray-200 text-xs rounded hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-3 py-1.5 bg-clr1 text-white text-xs rounded hover:bg-clr2 transition-colors font-medium flex items-center gap-1"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="text-xs" />
                  Upload All
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocForm;