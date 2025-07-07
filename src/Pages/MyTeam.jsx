import { useEffect, useState } from 'react';
import { FaUsers, FaUserTie, FaBullseye, FaStar, FaCrown, FaUserCircle } from 'react-icons/fa';
import { FiMail, FiAward } from 'react-icons/fi';
import CONFIG from '../Configuration';

function MyTeam() {
  const IP = CONFIG.API_URL;
  const email = JSON.parse(localStorage.getItem('user')).email;

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetch(`${IP}/teams/getTeamByEmail/${email}`)
    .then(res => res.json())
    .then(data => {
      setTeam(data);
      if (data?.teamId) {
        fetch(`${IP}/users/team-members/${data.teamId}`)
          .then(res => res.json())
          .then(users => {
            setMembers(users);
            setLoading(false);
          })
          .catch(() => {
            setMembers([]);
            setLoading(false);
          });
      } else {
        setLoading(false); // 👈 Add this
      }
    })
    .catch(() => {
      setTeam(null);
      setMembers([]);
      setLoading(false);
    });
}, []);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-clr1"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="bg-clr1/10 p-6 rounded-full mb-4">
          <FaUsers className="text-4xl text-clr1" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700">No team assigned yet</h3>
        <p className="text-gray-500 mt-2">You haven't been assigned to any team yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Team Header Card */}
      <div className="bg-gradient-to-r from-clr1 to-clr2 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-white/10 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <FaUsers className="text-white/80" /> 
                {team.teamName}
              </h2>
              <p className="text-white/90 mt-1"><b>Team Goal:</b> {team.teamGoal}</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
              <FaStar className="text-yellow-300" />
              <span className="font-bold">{team.teamRating}</span>
              <span className="text-white/80">/5</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <FaUserTie className="text-white/80" />
              <span className="font-medium">Leader:</span>
              <span>{team.TeamLeaderName}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <FiAward className="text-white/80" />
              <span className="font-medium">Members:</span>
              <span>{members.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
        </div>
        
        {members.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <FaUserCircle className="text-3xl text-gray-400" />
            </div>
            <h4 className="text-gray-600 font-medium">No members in this team</h4>
            <p className="text-gray-400 text-sm mt-1">Team leader can add members to this team</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {members.map((m, i) => (
              <div key={m._id} className="flex items-center p-4 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-clr1/10 flex items-center justify-center text-clr1 font-bold mr-4">
                  {i + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{m.name}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <FiMail className="mr-1.5" />
                    <span className="truncate">{m.designation}</span>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  m.role === 1 ? 'bg-purple-100 text-purple-800' : 
                  m.role === 2 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {m.role === 1 ? 'Admin' : m.role === 2 ? 'Sales Closure' : 'Lead Gen'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTeam;