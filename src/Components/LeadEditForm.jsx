import React, { useState } from 'react';
import {
  FaTimes, FaUser, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSave,
  FaIdCard, FaUserTag, FaPercentage, FaCalendarAlt, FaLocationArrow,
  FaIdBadge, FaLandmark, FaMoneyBillWave, FaCreditCard
} from 'react-icons/fa';
import CONFIG from '../Configuration';

function LeadEditForm({ lead, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    person_name: lead.person_name || '',
    business_name: lead.business_name || '',
    contact: lead.contact || '',
    personal_email: lead.personal_email || '',
    dob: lead.dob ? lead.dob.slice(0, 10) : '',
    ssn: lead.ssn || '',
    driversLicenseNumber: lead.driversLicenseNumber || '',
    incorporateState: lead.incorporateState || '',
    business_email: lead.business_email || '',
    business_contact: lead.business_contact || '',
    businessRole: lead.businessRole || '',
    ownershipPercentage: lead.ownershipPercentage || '',
    yearsInBusiness: lead.yearsInBusiness || '',
    locations: lead.locations || '',
    address: lead.address || '',
    // Bank related fields
    bankName: lead.bankName || '',
    rtn: lead.rtn || '',
    accountNumber: lead.accountNumber || '',
    accountType: lead.accountType || ''
  });
  const [errors, setErrors] = useState({});

  const IP = CONFIG.API_URL;

  const fieldIcons = {
    person_name: <FaUser size={12} className="text-clr1" />,
    business_name: <FaBuilding size={12} className="text-clr1" />,
    contact: <FaPhone size={12} className="text-clr1" />,
    personal_email: <FaEnvelope size={12} className="text-clr1" />,
    business_email: <FaEnvelope size={12} className="text-clr1" />,
    business_contact: <FaPhone size={12} className="text-clr1" />,
    address: <FaMapMarkerAlt size={12} className="text-clr1" />,
    businessRole: <FaUserTag size={12} className="text-clr1" />,
    ownershipPercentage: <FaPercentage size={12} className="text-clr1" />,
    yearsInBusiness: <FaCalendarAlt size={12} className="text-clr1" />,
    locations: <FaLocationArrow size={12} className="text-clr1" />,
    dob: <FaCalendarAlt size={12} className="text-clr1" />,
    ssn: <FaIdCard size={12} className="text-clr1" />,
    driversLicenseNumber: <FaIdBadge size={12} className="text-clr1" />,
    incorporateState: <FaMapMarkerAlt size={12} className="text-clr1" />,
    // Bank related icons
    bankName: <FaLandmark size={12} className="text-clr1" />,
    rtn: <FaMoneyBillWave size={12} className="text-clr1" />,
    accountNumber: <FaCreditCard size={12} className="text-clr1" />,
    accountType: <FaCreditCard size={12} className="text-clr1" />
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const validators = {
  personal_email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  business_email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ssn: /^\d{3}-\d{2}-\d{4}$/,
  driversLicenseNumber: /^[A-Za-z0-9]{5,20}$/,
  rtn: /^\d{9}$/,
  accountNumber: /^\d{4,17}$/,
  // contact: /^\d{10,15}$/,
  // business_contact: /^\d{10,15}$/,
  ownershipPercentage: /^(100(\.0{1,2})?|[1-9]?[0-9](\.\d{1,2})?)$/
};

const placeholders = {
  personal_email: 'e.g., john@example.com',
  business_email: 'e.g., contact@company.com',
  ssn: 'e.g., 123-45-6789',
  driversLicenseNumber: 'e.g., D1234567',
  rtn: 'e.g., 021000021',
  accountNumber: '4-17 digit number',
  contact: '10-15 digit mobile number',
  business_contact: '10-15 digit business number',
  ownershipPercentage: '0 - 100 (up to 2 decimals)',
  accountType: 'e.g., Checking or Savings'
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  for (const key in validators) {
    const value = formData[key];
    if (value && !validators[key].test(value)) {
      newErrors[key] = `Invalid format for ${key.replace(/([A-Z])/g, ' $1')}`;
    }
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  try {
    const response = await fetch(`${IP}/leads/edit/${lead._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      onClose();
      if (onUpdate) onUpdate();
    } else {
      throw new Error('Update failed');
    }
  } catch (err) {
    console.error('Update failed', err);
  }
};


  const fieldGroups = [
    ['person_name', 'business_name'],
    ['contact', 'personal_email'],
    ['dob', 'ssn'],
    ['driversLicenseNumber', 'incorporateState'],
    ['business_email', 'business_contact'],
    ['businessRole', 'ownershipPercentage'],
    ['locations', 'yearsInBusiness'],
    ['address'],
    // Bank related fields
    ['bankName', 'rtn'],
    ['accountNumber', 'accountType']
  ];

  return (
  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h2 className="text-sm font-semibold text-gray-800">Edit Lead Information</h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-clr1 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <FaTimes size={14} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {fieldGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className={`grid gap-2 ${group.length === 1 ? 'grid-cols-1 md:col-span-2' : 'grid-cols-1 md:grid-cols-2'}`}
            >
              {group.map((key) => (
                <div key={key} className="flex flex-col gap-0.5">
                  <label className="text-xs text-gray-600 font-medium flex items-center gap-1 capitalize">
                    {fieldIcons[key]}
                    {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                  </label>
                  <input
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    type={
                      key === 'dob' ? 'date' :
                      key === 'locations' || key === 'yearsInBusiness' || key === 'ownershipPercentage' ? 'number' :
                      'text'
                    }
                    className={`w-full border px-2 py-1 text-xs rounded focus:outline-none focus:ring-1 ${
                      errors[key] ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-clr1'
                    }`}
                    placeholder={placeholders[key] || `Enter ${key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}`}
                    min={key === 'yearsInBusiness' || key === 'locations' || key === 'ownershipPercentage' ? '0' : undefined}
                    step={key === 'ownershipPercentage' ? '0.01' : '1'}
                  />
                  {errors[key] && <span className="text-[10px] text-red-500 mt-0.5">{errors[key]}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 mt-4 sticky bottom-0 bg-white pb-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 text-xs bg-clr1 text-white rounded hover:bg-clr1/90 flex items-center gap-1"
          >
            <FaSave size={10} />
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
);

}

export default LeadEditForm;