import React, { useEffect, useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { DataCard, DataForm, DataEditForm } from '../Components';
import CONFIG from '../Configuration';

function DataPage() {
  const [dataList, setDataList] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [viewingData, setViewingData] = useState(null);

  const IP = CONFIG.API_URL;
  const email = JSON.parse(localStorage.getItem('user')).email;

  const fetchData = async () => {
    const res = await fetch(`${IP}/data/getByUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setDataList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = dataList.filter(d =>
    d.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg m-[1.2vh] shadow-md h-[84vh] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/2">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-clr1"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-clr1 text-white px-4 py-2 rounded-lg shadow hover:bg-clr2 transition-all duration-200 flex items-center gap-2"
        >
          <FaPlus /> Add Data
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-2 space-y-3 hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {filtered.map(data => (
            <DataCard
              key={data._id}
              data={data}
              onDelete={fetchData}
              onEdit={setSelectedData}
              onView={setViewingData}
            />
          ))}
        </div>
      </div>

      {showForm && (
        <DataForm
          onClose={() => {
            setShowForm(false);
            fetchData();
          }}
        />
      )}
      {selectedData && (
        <DataEditForm
          data={selectedData}
          onClose={() => {
            setSelectedData(null);
            fetchData();
          }}
        />
      )}
      {viewingData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-[400px] relative">
            <h2 className="text-lg font-bold mb-2">Data Details</h2>
            <p>
              <strong>User:</strong> {viewingData.user}
            </p>
            <p>
              <strong>Details:</strong> {viewingData.details}
            </p>
            <p>
              <strong>Created:</strong>{' '}
              {new Date(viewingData.date).toLocaleString()}
            </p>
            <p>
              <strong>Follow-up:</strong>{' '}
              {viewingData.followupDate
                ? new Date(viewingData.followupDate).toLocaleDateString()
                : 'N/A'}
            </p>
            <button
              onClick={() => setSelectedData(viewingData)}
              className="text-clr1 mt-4"
            >
              Edit
            </button>
            <button
              onClick={() => setViewingData(null)}
              className="absolute top-2 right-3 text-gray-500 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataPage;