import { useEffect, useState } from 'react';
import { SaleCard, SaleDetails } from '../Components';
import CONFIG from '../Configuration';
import { FaSearch, FaFilter, FaTrophy } from 'react-icons/fa';

function OperationDashboard() {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const IP = CONFIG.API_URL;

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`${IP}/sales/getSales`);
        const data = await res.json();
        setSales(data);
      } catch (err) {
        console.error('Failed to fetch sales:', err);
      }
    };
    fetchSales();
  }, []);

  const filteredSales = sales.filter((sale) => {
    const lead = sale.lead || {};
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      lead.person_name?.toLowerCase().includes(term) ||
      lead.business_name?.toLowerCase().includes(term) ||
      lead.business_email?.toLowerCase().includes(term) ||
      lead.ratedBy?.toLowerCase().includes(term);

    const matchesStatus = statusFilter ? sale.currentStatus === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-[87vh] w-[92vw] flex gap-6 bg-gray-50 p-6 z-20">
      {/* Left Panel - Sales List */}
      <div className="w-[35%] bg-white rounded-lg shadow-sm p-4 overflow-hidden group border border-gray-100">
        {/* Header with title */}
        <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
          <FaTrophy className="text-clr1 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Won Sales</h2>
          <span className="ml-auto bg-clr1 text-white text-xs px-2 py-1 rounded-full">
            {filteredSales.length}
          </span>
        </div>

        {/* Search and Filter Row */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name, business or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-clr1 focus:border-clr1"
            />
          </div>
          <div className="relative w-40">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-clr1 focus:border-clr1 appearance-none bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Activated">Activated</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
        </div>

        {/* Sales List */}
        <div className="overflow-hidden h-[calc(100%-110px)] group-hover:overflow-y-auto space-y-3 pr-2">
          {filteredSales.length > 0 ? (
            filteredSales.map((sale) => (
              <SaleCard
                key={sale._id}
                sale={sale}
                isSelected={selectedSale?._id === sale._id}
                onClick={() => setSelectedSale(sale)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No sales match your criteria
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Sale Details */}
      <div className="flex-1 bg-white rounded-lg shadow-sm p-5 overflow-hidden group border border-gray-100">
        <div className="overflow-hidden h-full group-hover:overflow-y-auto pr-2">
          {selectedSale ? (
            <SaleDetails sale={selectedSale} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-5xl mb-2">👈</div>
                <p>Select a sale to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OperationDashboard;