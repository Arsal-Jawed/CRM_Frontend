import { useEffect, useState } from 'react';
import CONFIG from '../Configuration';
import PerformanceHeader from '../Components/PerformanceHeader';
import PerformanceTableHeaders from '../Components/PerformanceTableHeaders';
import PerformanceTableRow from '../Components/PerformanceTableRow';
import { calculatePerformance } from '../Components/PerformanceCalculator';

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

  const allData = users
    .filter(u => (activeTab === 'LeadGen' ? u.role === 3 : u.role === 2))
    .map(user => calculatePerformance(user, leads, sales, equipment, docs));

  const filtered = allData
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    .filter(d => parseFloat(d.index) >= indexRange[0] && parseFloat(d.index) <= indexRange[1])
    .sort((a, b) => b.index - a.index);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-clr1"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto z-20">
      <PerformanceHeader
        search={search}
        setSearch={setSearch}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        indexRange={indexRange}
        setIndexRange={setIndexRange}
        role={role}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full h-[67vh] divide-y divide-gray-200 text-sm">
          <PerformanceTableHeaders activeTab={activeTab} />
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((user, i) => (
              <PerformanceTableRow
                key={i}
                user={user}
                index={i}
                activeTab={activeTab}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Performance;