import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaStar, FaClock, FaTimes } from 'react-icons/fa';

function LeadInfo({ lead, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl w-[90%] max-w-3xl p-6 shadow-lg">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-lg"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Lead Information</h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
          <Info icon={<FaUser className="text-clr1" />} label="Person Name" value={lead.person_name} />
          <Info icon={<FaEnvelope className="text-clr1" />} label="Personal Email" value={lead.personal_email} />

          <Info icon={<FaPhone className="text-clr1" />} label="Personal Contact" value={lead.contact} />
          <Info icon={<FaBuilding className="text-clr1" />} label="Business Name" value={lead.business_name} />

          <Info icon={<FaEnvelope className="text-clr1" />} label="Business Email" value={lead.business_email} />
          <Info icon={<FaPhone className="text-clr1" />} label="Business Contact" value={lead.business_contact} />

          <Info icon={<FaMapMarkerAlt className="text-clr1" />} label="Address" value={lead.address} />
          <Info icon={<FaStar className="text-clr1" />} label="Rating" value={lead.rating || '-'} />

          <Info icon={<FaClock className="text-clr1" />} label="Date" value={lead.date} />
          <Info icon={<FaClock className="text-clr1" />} label="Time" value={lead.time} />

          <Info icon={<FaUser className="text-clr1" />} label="Status" value={lead.status} />
          <Info icon={<FaClock className="text-clr1" />} label="Follow Up" value={lead.followUp} />
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <p className="font-medium">{label}:</p>
        <p>{value}</p>
      </div>
    </div>
  );
}

export default LeadInfo;
