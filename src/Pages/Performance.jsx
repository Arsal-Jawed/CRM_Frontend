import { useEffect, useState } from 'react';
import { FiSearch, FiAward, FiUser, FiTrendingUp, FiThumbsUp, FiThumbsDown, FiClock, FiEye, FiCalendar, FiBarChart2, FiStar, FiZap, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import CONFIG from '../Configuration';

function Performance() {
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [calls, setCalls] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('LeadGen');
  const [indexRange, setIndexRange] = useState([0, 10]);

  const IP = CONFIG.API_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, leadsRes, callsRes, docsRes] = await Promise.all([
          fetch(`${IP}/users/getAllUsers`),
          fetch(`${IP}/leads/allLeads`),
          fetch(`${IP}/calls/all`),
          fetch(`${IP}/docs/all`)
        ]);

        const [users, leads, calls, docs] = await Promise.all([
          usersRes.json(),
          leadsRes.json(),
          callsRes.json(),
          docsRes.json()
        ]);

        setUsers(users);
        setLeads(leads);
        setCalls(calls);
        setDocs(docs);
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
      const lost = userLeads.filter(l => l.status === 'lost').length;
      const ratings = userLeads.map(l => l.rating || 1);
      const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 1;

      const winScore = total ? (won / total) * 4 : 0;
      const ratingScore = (avgRating / 5) * 2;
      const leadEfficiencyScore = Math.min((total / diffDays) * 90, 3);
      const lossPenalty = total ? (lost / total) * 1 : 0;

      const index = Math.min(
        winScore + ratingScore + leadEfficiencyScore - lossPenalty,
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
      const assignedLeads = leads.filter(l => l.closure1 === user.email);
      const assigned = assignedLeads.length;
      const won = assignedLeads.filter(l => l.status === 'won').length;
      const lost = assignedLeads.filter(l => l.status === 'lost').length;
      const rated = assignedLeads.filter(l => l.rating > 1).length;
      const userCalls = calls.filter(c => assignedLeads.find(l => l._id === c.clientId));
      const userDocs = docs.filter(d => assignedLeads.find(l => l._id === d.clientId));

      const winScore = assigned ? (won / assigned) * 0.5 * 3 : 0;
      const activityScore = Math.min(assigned / 50, 1.5);
      const docsScore = assigned ? Math.min(userDocs.length / assigned, 1) * 2 : 0;
      const ratingFlagScore = rated >= assigned * 0.5 ? 1 : 0;
      const callScore = assigned ? Math.min(userCalls.length / assigned, 1) * 2 : 0;
      const experienceScore = Math.min(diffMonths / 24, 1) + (diffMonths >= 4 ? 0.5 : 0);
      const lossPenalty = assigned ? (lost / assigned) * 1 : 0;

      const index = Math.min(
        winScore + activityScore + docsScore + ratingFlagScore + callScore + experienceScore - lossPenalty,
        10
      ).toFixed(2);

      return {
        name: `${user.firstName} ${user.lastName}`,
        role: 'Sales Closure',
        total: assigned,
        won,
        lost,
        inProcess: assignedLeads.filter(l => l.status === 'in process').length,
        index,
        calls: userCalls.length,
        docs: userDocs.length,
        joinDate: joiningDate.toLocaleDateString()
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
              <button
                onClick={() => setActiveTab('Sales')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'Sales' 
                  ? 'bg-gradient-to-r from-clr2 to-clr1 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <FiTrendingUp /> Sales Closures
              </button>
            </div>

            <select
              className="text-xs px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-clr1"
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
                  <div className="group relative inline-block">
                    Employee
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 border border-gray-200 min-w-[120px] text-center">
                      <div className="text-xs font-semibold text-gray-700">Name</div>
                    </div>
                  </div>
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  <div className="group relative inline-block">
                    <span className={`px-1.5 py-0.5 text-xs rounded-full ${activeTab === 'LeadGen' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      Role
                    </span>
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 border border-gray-200 min-w-[120px] text-center">
                      <div className="text-xs font-semibold text-gray-700">Role</div>
                    </div>
                  </div>
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  <div className="group relative inline-block">
                    <FiTrendingUp className="inline text-lg" />
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 border border-gray-200 min-w-[120px] text-center">
                      <div className="text-xs font-semibold text-gray-700">Total Leads</div>
                    </div>
                  </div>
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  <div className="group relative inline-block">
                    <FiThumbsUp className="inline text-lg text-green-600" />
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 border border-gray-200 min-w-[120px] text-center">
                      <div className="text-xs font-semibold text-gray-700">Won</div>
                    </div>
                  </div>
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  <div className="group relative inline-block">
                    <FiThumbsDown className="inline text-lg text-red-600" />
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 border border-gray-200 min-w-[120px] text-center">
                      <div className="text-xs font-semibold text-gray-700">Lost</div>
                    </div>
                  </div>
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  <div className="group relative inline-block">
                    <FiClock className="inline text-lg text-yellow-600" />
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 border border-gray-200 min-w-[120px] text-center">
                      <div className="text-xs font-semibold text-gray-700">In Process</div>
                    </div>
                  </div>
                </th>
                
                {activeTab === 'LeadGen' && (
                  <>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      <div className="group relative inline-block">
                        <FiCalendar className="inline text-lg" />
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 border border-gray-200 min-w-[120px] text-center">
                          <div className="text-xs font-semibold text-gray-700">Joining Date</div>
                        </div>
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      <div className="group relative inline-block">
                        <FiCheckCircle className="inline text-lg text-blue-600" />
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 border border-gray-200 min-w-[120px] text-center">
                          <div className="text-xs font-semibold text-gray-700">Win Score</div>
                        </div>
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      <div className="group relative inline-block">
                        <FiStar className="inline text-lg text-yellow-500" />
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 border border-gray-200 min-w-[120px] text-center">
                          <div className="text-xs font-semibold text-gray-700">Rating Score</div>
                        </div>
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      <div className="group relative inline-block">
                        <FiZap className="inline text-lg text-orange-500" />
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 border border-gray-200 min-w-[120px] text-center">
                          <div className="text-xs font-semibold text-gray-700">Lead Efficiency</div>
                        </div>
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      <div className="group relative inline-block">
                        <FiXCircle className="inline text-lg text-red-600" />
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 border border-gray-200 min-w-[120px] text-center">
                          <div className="text-xs font-semibold text-gray-700">Loss Penalty</div>
                        </div>
                      </div>
                    </th>
                  </>
                )}
                
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  <div className="group relative inline-block">
                    <FiBarChart2 className="inline text-lg" />
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 border border-gray-200 min-w-[120px] text-center">
                      <div className="text-xs font-semibold text-gray-700">Performance Score</div>
                    </div>
                  </div>
                </th>
                
                {activeTab === 'Sales' && (
                  <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <div className="group relative inline-block">
                      <FiEye className="inline text-lg" />
                      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-md p-2 border border-gray-200 min-w-[120px] text-center">
                        <div className="text-xs font-semibold text-gray-700">View Details</div>
                      </div>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((user, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                      user.role === 'LeadGen' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role === 'LeadGen' ? 'Lead Gen' : 'Sales Closure'}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-600">{user.total}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-green-600">{user.won}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-red-600">{user.lost}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-yellow-600">{user.inProcess}</td>
                  
                  {activeTab === 'LeadGen' && (
                    <>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">{user.joinDate}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-blue-600">{user.winScore}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-yellow-600">{user.ratingScore}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-orange-500">{user.leadEfficiencyScore}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-red-600">{user.lossPenalty}</td>
                    </>
                  )}
                  
                  <td className="px-3 py-2 whitespace-nowrap">
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