import React, { useState, useEffect } from 'react';
import CONFIG from '../Configuration';
import {
  FollowUpTable,
  CallCard,
  ClientDetails,
  DocumentCard,
  CallForm,
  EquipmentCard
} from '../Components';
import {
  FaPlus,
  FaSearch,
  FaFileAlt,
  FaPhoneAlt,
  FaTools
} from 'react-icons/fa';

function FollowUp() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [calls, setCalls] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [docSearch, setDocSearch] = useState('');
  const [activeTab, setActiveTab] = useState('calls');
  const [showCallForm, setShowCallForm] = useState(false);

  const filteredCalls = calls.filter(call =>
    (call.caller || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocuments = documents.filter(doc =>
    doc.docName.toLowerCase().includes(docSearch.toLowerCase())
  );

  const fetchDocs = async () => {
    try {
      const res = await fetch(`${CONFIG.API_URL}/docs/clientDocs/${selectedClient._id}`);
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const fetchEquipments = async () => {
    try {
      const res = await fetch(`${CONFIG.API_URL}/equipments/client/${selectedClient.lead_id}`);
      const data = await res.json();
      setEquipments(data);
    } catch (err) {
      console.error('Failed to fetch equipments:', err);
    }
  };

  useEffect(() => {
    if (selectedClient?._id) {
      fetchDocs();
      fetchEquipments();
    }
  }, [selectedClient]);

  return (
    <div className="p-4 flex gap-4 z-20">
      <div className="w-[64vw] space-y-2">
        <ClientDetails client={selectedClient} />
        <FollowUpTable onSelectClient={setSelectedClient} setCalls={setCalls} />
      </div>

      <div className="w-[24vw] bg-white rounded-xl p-4 shadow border border-gray-200 h-[81.5vh] overflow-auto space-y-3">
        <div className="flex justify-between border-b pb-2 mb-3">
          <button
            onClick={() => setActiveTab('calls')}
            className={`flex items-center gap-1 px-3 py-1 text-sm font-semibold border-b-2 transition ${
              activeTab === 'calls'
                ? 'border-clr1 text-clr1'
                : 'border-transparent text-gray-500 hover:text-clr1'
            }`}
          >
            <FaPhoneAlt size={12} />
            Calls
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-1 px-3 py-1 text-sm font-semibold border-b-2 transition ${
              activeTab === 'docs'
                ? 'border-clr1 text-clr1'
                : 'border-transparent text-gray-500 hover:text-clr1'
            }`}
          >
            <FaFileAlt size={12} />
            Docs
          </button>

          <button
            onClick={() => setActiveTab('equipments')}
            className={`flex items-center gap-1 px-3 py-1 text-sm font-semibold border-b-2 transition ${
              activeTab === 'equipments'
                ? 'border-clr1 text-clr1'
                : 'border-transparent text-gray-500 hover:text-clr1'
            }`}
          >
            <FaTools size={12} />
            Equipments
          </button>
        </div>

        {activeTab === 'calls' && (
          <>
            <div className="flex items-center gap-2">
              <div className="relative w-[14vw]">
                <FaSearch className="absolute top-2.5 left-3 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search calls..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-clr1"
                />
              </div>

              <button
                onClick={() => setShowCallForm(true)}
                className="bg-clr1 w-[7vw] text-white px-3 py-[1.7vh] text-xs rounded-md hover:bg-clr1/90 flex items-center gap-2 shadow"
              >
                <FaPlus size={10} />
                Add Call
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {filteredCalls.length > 0 ? (
                filteredCalls.map(call => <CallCard key={call._id} call={call} />)
              ) : (
                <p className="text-sm text-gray-500 text-center">No Calls Yet</p>
              )}
            </div>
          </>
        )}

        {activeTab === 'docs' && (
          <>
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                <FaSearch className="absolute top-2.5 left-3 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  onChange={(e) => setDocSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-clr1"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 text-sm text-gray-700">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map(doc => (
                  <DocumentCard
                    key={doc._id}
                    doc={doc}
                    onEdit={fetchDocs}
                    onRemove={(id) =>
                      setDocuments(prev => prev.filter(d => d._id !== id))
                    }
                  />
                ))
              ) : (
                <p className="text-center text-gray-400 mt-5">No matching documents.</p>
              )}
            </div>
          </>
        )}

        {activeTab === 'equipments' && (
          <div className="space-y-3 pt-1">
            {equipments.length > 0 ? (
              equipments.map(equip => (
                <EquipmentCard key={equip._id} equipment={equip} />
              ))
            ) : (
              <p className="text-center text-gray-400 mt-5">No Equipments Found.</p>
            )}
          </div>
        )}
      </div>

      {showCallForm && (
        <CallForm
          onClose={() => setShowCallForm(false)}
          onSave={(newCall) =>
            setCalls(prev => [...prev, { _id: Date.now().toString(), ...newCall }])
          }
          clientId={selectedClient._id}
        />
      )}
    </div>
  );
}

export default FollowUp;