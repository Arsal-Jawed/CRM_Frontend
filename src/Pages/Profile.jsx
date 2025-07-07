import {
  FaUser, FaEnvelope, FaBriefcase, FaUsers, FaCheckCircle,
  FaPhoneAlt, FaIdBadge, FaUserShield
} from 'react-icons/fa';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="bg-white max-w-3xl mx-auto mt-10 p-8 rounded-xl shadow-md">
      <div className="flex flex-col items-center mb-8">
        <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center text-clr1 text-4xl shadow-inner">
          <FaUser />
        </div>
        <h2 className="text-2xl font-bold mt-4 text-gray-800">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-500">{user.designation}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-gray-700">
        <div className="flex items-center gap-3">
          <FaEnvelope className="text-clr1" />
          <span className="font-medium">Email:</span>
          <span>{user.email}</span>
        </div>

        <div className="flex items-center gap-3">
          <FaPhoneAlt className="text-clr1" />
          <span className="font-medium">Contact:</span>
          <span>{user.contact}</span>
        </div>

        <div className="flex items-center gap-3">
          <FaUserShield className="text-clr1" />
          <span className="font-medium">Role:</span>
          <span>{user.role === 1 ? 'Admin' : user.role === 2 ? 'Sales Closure' : user.role === 3 ? 'Lead Gen' : 'Unknown'}</span>
        </div>

        <div className="flex items-center gap-3">
          <FaBriefcase className="text-clr1" />
          <span className="font-medium">Designation:</span>
          <span>{user.designation}</span>
        </div>

        <div className="flex items-center gap-3">
          <FaUsers className="text-clr1" />
          <span className="font-medium">Team:</span>
          <span>{user.team === 0 ? 'No Team' : `Team ${user.team}`}</span>
        </div>

        <div className="flex items-center gap-3">
          <FaCheckCircle className={`text-sm ${user.verified ? 'text-green-600' : 'text-red-500'}`} />
          <span className="font-medium">Verified:</span>
          <span>{user.verified ? 'Yes' : 'No'}</span>
        </div>

        <div className="flex items-center gap-3">
          <FaIdBadge className="text-clr1" />
          <span className="font-medium">User ID:</span>
          <span className="text-xs text-gray-500">{user._id}</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;