import { useEffect, useState } from 'react';
import { 
  FiSearch, FiAward, FiUser, FiTrendingUp, FiThumbsUp, FiThumbsDown, 
  FiClock, FiEye, FiCalendar, FiBarChart2, FiStar, FiZap, 
  FiCheckCircle, FiXCircle 
} from 'react-icons/fi';
import { 
  FaUserTie, FaUserTag, FaCalendarAlt, FaCheckCircle, FaStamp,
  FaMoneyBillWave, FaFileAlt, FaCubes, FaChartLine, FaTimesCircle,
  FaBan, FaUndoAlt, FaCrown, FaMedal
} from 'react-icons/fa';
import CONFIG from '../Configuration';

function Performance() {
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [sales, setSales] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('LeadGen');
  const [indexRange, setIndexRange] = useState([0, 10]);

  const IP = CONFIG.API_URL;
  const role = JSON.parse(localStorage.getItem("user")).role;

useEffect(() => {
  async function fetchData() {
    try {
      const [usersRes, leadsRes, salesRes, equipmentRes, docsRes] = await Promise.all([
        fetch(`${IP}/users/getAllUsers`),
        fetch(`${IP}/leads/allLeads`),
        fetch(`${IP}/sales/all`),
        fetch(`${IP}/equipments/all`),
        fetch(`${IP}/docs/all`)
      ]);

      // First log the responses before parsing
      console.log('Raw Responses:', {
        usersRes,
        leadsRes,
        salesRes,
        equipmentRes,
        docsRes
      });

      const [users, leads, sales, equipment, docs] = await Promise.all([
        usersRes.json(),
        leadsRes.json(),
        salesRes.json(),
        equipmentRes.json(),
        docsRes.json()
      ]);

      // Log the parsed data before setting state
      console.log('Parsed Data:', {
        users,
        leads, 
        sales,
        equipment,
        docs
      });

      setUsers(users);
      setLeads(leads);
      setSales(sales);
      setEquipment(equipment);
      setDocs(docs);
      
      // Log after setting state
      console.log('State should be updated now');
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, []);

  const calculatePerformance = (user) => {
    const joiningDate = new Date(user.joining_date);
    const today = new Date();
    const diffDays = Math.max(1, Math.floor((today - joiningDate) / (1000 * 60 * 60 * 24)));
    const diffMonths = diffDays / 30;

    if (user.role === 3) {
      const userLeads = leads.filter(l => l.email === user.email);
      const total = userLeads.length;
      const won = userLeads.filter(l => l.status === 'won').length;
      const lost = userLeads.filter(l => l.status === 'loss').length;
      const ratings = userLeads.map(l => l.rating || 1);
      const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 1;

      const winScore = total ? (won / total) * 4 : 0;
      const ratingScore = (avgRating / 5) * 2;
      const totalLeadsScore = Math.min(total * 0.07, 3);
      const leadEfficiencyScore = Math.min((total / diffDays) * 0.15, 1);
      const lossPenalty = total ? (lost / total) * 1 : 0;

      const index = Math.min(
        (winScore + ratingScore + totalLeadsScore + leadEfficiencyScore - lossPenalty) * 2,
        10
      ).toFixed(2);

      return {
        name: `${user.firstName} ${user.lastName}`,
        role: 'LeadGen',
        total,
        won,
        lost,
        inProcess: userLeads.filter(l => l.status === 'in process').length,
        index,
        avgRating,
        joinDate: joiningDate.toLocaleDateString(),
        winScore: winScore.toFixed(2),
        ratingScore: ratingScore.toFixed(2),
        leadEfficiencyScore: leadEfficiencyScore.toFixed(2),
        lossPenalty: lossPenalty.toFixed(2)
      };
    } else {
  const userLeads = leads.filter(lead => 
    lead.closure1 === user.email || lead.closure2 === user.email
  );

  const userSales = sales.filter(sale => 
        userLeads.some(lead => lead._id.toString() === sale.clientId || lead.lead_id.toString() === sale.clientId)
      );

  const userEquipment = equipment.filter(eq => 
    userLeads.some(lead => lead.lead_id === eq.clientId)
  );

  const userDocs = docs.filter(doc => 
    userLeads.some(lead => lead._id.toString() === doc.clientId || lead.lead_id.toString() === doc.clientId)
  );

  const totalLeads = userLeads.length;
  const wonLeads = userLeads.filter(lead => lead.status === 'won').length;
  const lostLeads = userLeads.filter(lead => ['rejected', 'loss'].includes(lead.status)).length;
  const approvedSales = userSales.filter(sale => sale.approvalStatus === 'Approved');
  const rejectedSales = userSales.filter(sale => sale.approvalStatus === 'Rejected');
  const buybackCases = userSales.filter(sale => sale.approvalStatus === 'Buyback');
  console.log("Approved: "+approvedSales.length+" Rejected: "+rejectedSales.length+" BuyBack: "+buybackCases.length);
  
  const initialLeaseAmount = userEquipment.reduce((sum, eq) => {
    const leaseAmount = eq.leaseAmount?.$numberDecimal || eq.leaseAmount || 0;
    return sum + parseFloat(leaseAmount);
  }, 0);

  let totalDeductions = 0;

  // Updated rejection deduction calculation
  const rejectedDeductions = rejectedSales.reduce((sum, sale) => {
    const connectedLeads = userLeads.filter(lead => 
      lead._id.toString() === sale.clientId || 
      lead.lead_id.toString() === sale.clientId
    );
    
    const saleEquipment = connectedLeads.flatMap(lead => 
      userEquipment.filter(eq => eq.clientId === lead.lead_id)
    );
    
    return sum + saleEquipment.reduce((equipSum, equip) => {
      const amount = equip.leaseAmount?.$numberDecimal || equip.leaseAmount || 0;
      return equipSum + parseFloat(amount);
    }, 0);
  }, 0);

  // Updated buyback deduction calculation
  const buybackDeductions = buybackCases.reduce((sum, sale) => {
    const connectedLeads = userLeads.filter(lead => 
      lead._id.toString() === sale.clientId || 
      lead.lead_id.toString() === sale.clientId
    );
    
    const saleEquipment = connectedLeads.flatMap(lead => 
      userEquipment.filter(eq => eq.clientId === lead.lead_id)
    );
    
    return sum + saleEquipment.reduce((equipSum, equip) => {
      const amount = equip.leaseAmount?.$numberDecimal || equip.leaseAmount || 0;
      return equipSum + (parseFloat(amount) * 1.5);
    }, 0);
  }, 0);

  totalDeductions = rejectedDeductions + buybackDeductions;
  const adjustedLeaseAmount = Math.max(0, initialLeaseAmount - totalDeductions);

const LOSS_PENALTY_FACTOR = 0.5;
const REJECTION_PENALTY_FACTOR = 0.3;
const BUYBACK_PENALTY_FACTOR = 1;

const winScore = Math.min(wonLeads * 4, 40);
const approvedSalesScore = Math.min(approvedSales.length * 2, 20);
const leaseAmountScore = adjustedLeaseAmount / 1000;
const equipmentScore = userEquipment.length * 0.5;
const docsScore = userDocs.length * 0.2;

const lossPenalty = lostLeads * LOSS_PENALTY_FACTOR;
const rejectionPenalty = rejectedSales.length * REJECTION_PENALTY_FACTOR;
const buybackPenalty = buybackCases.length * BUYBACK_PENALTY_FACTOR;

const totalScore = Math.min(
  winScore +
  approvedSalesScore +
  leaseAmountScore +
  equipmentScore +
  docsScore -
  lossPenalty -
  rejectionPenalty -
  buybackPenalty,
  100
);

  const index = (totalScore / 10).toFixed(2);

  return {
    name: `${user.firstName} ${user.lastName}`,
    role: 'Sales Closure',
    totalLeads,
    wonLeads,
    lostLeads,
    approvedSales: approvedSales.length,
    rejectedSales: rejectedSales.length,
    buybackCases: buybackCases.length,
    totalEquipments: userEquipment.length,
    totalLeaseAmount: adjustedLeaseAmount,
    initialLeaseAmount, // For reference
    rejectedDeductions, // For reference
    buybackDeductions, // For reference
    totalDocuments: userDocs.length,
    joinDate: joiningDate.toLocaleDateString(),
    index,
    performanceDetails: {
      winScore: winScore.toFixed(2),
      approvedSalesScore: approvedSalesScore.toFixed(2),
      leaseAmountScore: leaseAmountScore.toFixed(2),
      equipmentScore: equipmentScore.toFixed(2),
      docsScore: docsScore.toFixed(2),
      lossPenalty: lossPenalty.toFixed(2),
      rejectionPenalty: rejectionPenalty.toFixed(2),
      buybackPenalty: buybackPenalty.toFixed(2)
    }
  };
}
  };

  const allData = users
    .filter(u => (activeTab === 'LeadGen' ? u.role === 3 : u.role === 2))
    .map(calculatePerformance);

  const filtered = allData
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    .filter(d => parseFloat(d.index) >= indexRange[0] && parseFloat(d.index) <= indexRange[1])
    .sort((a, b) => b.index - a.index);

  const getIndexColor = (index) => {
    const num = parseFloat(index);
    if (num >= 8) return 'text-green-600';
    if (num >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-clr1"></div>
      </div>
    );
  }

 return (
  <div className="p-4 max-w-7xl mx-auto z-20">
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FiAward className="text-clr1 text-lg" /> Performance
        </h1>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto items-center">
          <div className="relative flex-1 min-w-[150px]">
            <FiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-clr1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('LeadGen')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'LeadGen' 
                ? 'bg-gradient-to-r from-clr1 to-clr2 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FiUser /> Lead Gens
            </button>
            {role !== 6 && (
              <button
                onClick={() => setActiveTab('Sales')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'Sales' 
                    ? 'bg-gradient-to-r from-clr2 to-clr1 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiTrendingUp /> Sales Closures
              </button>
            )}
          </div>

          <select
            className="text-[0.6vw] px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-clr1"
            value={indexRange.join(',')}
            onChange={(e) => setIndexRange(e.target.value.split(',').map(Number))}
          >
            <option value="0,10">All Scores</option>
            <option value="8,10">Top (8-10)</option>
            <option value="5,7.99">Average</option>
            <option value="0,4.99">Low</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full h-[67vh] divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${activeTab === 'LeadGen' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                  Role
                </span>
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex flex-col items-start">
                  <FiCalendar className="text-lg mb-1" />
                  <span className="text-[0.6vw]">Joining</span>
                </div>
              </th>
              
              {activeTab === 'LeadGen' ? (
                <>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FiTrendingUp className="text-lg mb-1" />
                      <span className="text-[0.6vw]">Leads</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FiThumbsUp className="text-lg text-green-600 mb-1" />
                      <span className="text-[0.6vw]">Won</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FiThumbsDown className="text-lg text-red-600 mb-1" />
                      <span className="text-[0.6vw]">Lost</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FiClock className="text-lg text-yellow-600 mb-1" />
                      <span className="text-[0.6vw]">In-Process</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FiCheckCircle className="text-lg text-blue-600 mb-1" />
                      <span className="text-[0.6vw]">Win Score</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FiStar className="text-lg text-yellow-500 mb-1" />
                      <span className="text-[0.6vw]">Rating Score</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FiZap className="text-lg text-orange-500 mb-1" />
                      <span className="text-[0.6vw]">Lead Efficiency</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FiXCircle className="text-lg text-red-600 mb-1" />
                      <span className="text-[0.6vw]">Loss Penalty</span>
                    </div>
                  </th>
                </>
              ) : (
                <>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FiCheckCircle className="text-lg text-green-600 mb-1" />
                      <span className="text-[0.6vw]">Won Leads</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FaStamp className="text-lg text-blue-600 mb-1" />
                      <span className="text-[0.6vw]">Approved Sales</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FaMoneyBillWave className="text-lg text-green-700 mb-1" />
                      <span className="text-[0.6vw]">Total Lease</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FaFileAlt className="text-lg mb-1" />
                      <span className="text-[0.6vw]">Documents</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FaCubes className="text-lg mb-1" />
                      <span className="text-[0.6vw]">Equipments</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FiTrendingUp className="text-lg mb-1" />
                      <span className="text-[0.6vw]">Total Leads</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FiThumbsDown className="text-lg text-red-600 mb-1" />
                      <span className="text-[0.6vw]">Lost Leads</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FaBan className="text-lg text-red-500 mb-1" />
                      <span className="text-[0.6vw]">Rejected Sales</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                      <FaUndoAlt className="text-lg text-orange-600 mb-1" />
                      <span className="text-[0.6vw]">Buybacks</span>
                    </div>
                  </th>
                </>
              )}
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex flex-col items-start">
                  <FiBarChart2 className="text-lg mb-1" />
                  <span className="text-[0.6vw]">Performance</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((user, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                 <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 text-left">
                <div className="relative inline-block">
                  {user.name}
                  {i === 0 && (
                    <FaCrown className="text-yellow-500 text-sm absolute -top-2 -right-2 transform rotate-12"/>)}
                  {/* {i === 1 && (
                    <FaCrown 
                      className="text-gray-400 text-sm absolute -top-2.5 -right-3 transform rotate-12"
                    />
                  )}
                  {i === 2 && (
                    <FaMedal 
                      className="text-amber-700 text-sm absolute -top-1.5 -right-2 transform rotate-12"
                    />
                  )} */}
                </div>
              </td>

                <td className="px-3 py-2 whitespace-nowrap text-left">
                  <span className={`px-1.5 py-0.5 text-[0.6vw] rounded-full ${
                    user.role === 'LeadGen' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {user.role === 'LeadGen' ? 'Lead Gen' : 'Sales Closure'}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-600 text-left">{user.joinDate}</td>
                
                {activeTab === 'LeadGen' ? (
                  <>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-600 text-left">{user.total}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-green-600 text-left">{user.won}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-red-600 text-left">{user.lost}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-yellow-600 text-left">{user.inProcess}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-blue-600 text-left">{user.winScore}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-yellow-600 text-left">{user.ratingScore}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-orange-500 text-left">{user.leadEfficiencyScore}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-red-600 text-left">{user.lossPenalty}</td>
                  </>
                ) : (
                  <>
                    <td className="px-3 py-2 whitespace-nowrap text-green-600 text-left">{user.wonLeads}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-blue-600 text-left">{user.approvedSales}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-green-700 text-left">
                      {user.totalLeaseAmount?.toLocaleString('en-US', {style: 'currency',currency: 'USD',
                        minimumFractionDigits: 0,maximumFractionDigits: 0})}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-600 text-left">{user.totalDocuments}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-600 text-left">{user.totalEquipments}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-600 text-left">{user.totalLeads}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-red-600 text-left">{user.lostLeads}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-red-500 text-left">{user.rejectedSales}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-orange-600 text-left">{user.buybackCases}</td>
                  </>
                )}
                
                <td className="px-3 py-2 whitespace-nowrap text-left">
                  <div className={`font-semibold ${getIndexColor(user.index)}`}>
                    {user.index}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          parseFloat(user.index) >= 8 ? 'bg-green-500' :
                          parseFloat(user.index) >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${parseFloat(user.index) * 10}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}

export default Performance;