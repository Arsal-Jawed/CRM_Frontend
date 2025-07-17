import React, { useState } from 'react';
import {
  FaTimes, FaUser, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSave,
  FaIdCard, FaUserTag, FaPercentage, FaCalendarAlt, FaIdBadge,
  FaLandmark, FaMoneyBillWave, FaCreditCard
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
    legal_name: lead.legal_name || '',
    address: lead.address || '',
    driversLicenseNumber: lead.driversLicenseNumber || '',
    business_email: lead.business_email || '',
    business_contact: lead.business_contact || '',
    businessRole: lead.businessRole || '',
    ownershipPercentage: lead.ownershipPercentage || '',
    established: lead.established || '',
    business_address: lead.business_address || '',
    bankName: lead.bankName || '',
    rtn: lead.rtn || '',
    accountNumber: lead.accountNumber || ''
  });

  const [errors, setErrors] = useState({});
  const IP = CONFIG.API_URL;

  const fieldIcons = {
    person_name: <FaUser size={14} className="text-clr1" />,
    business_name: <FaBuilding size={14} className="text-clr1" />,
    contact: <FaPhone size={14} className="text-clr1" />,
    personal_email: <FaEnvelope size={14} className="text-clr1" />,
    business_email: <FaEnvelope size={14} className="text-clr1" />,
    business_contact: <FaPhone size={14} className="text-clr1" />,
    business_address: <FaMapMarkerAlt size={14} className="text-clr1" />,
    businessRole: <FaUserTag size={14} className="text-clr1" />,
    ownershipPercentage: <FaPercentage size={14} className="text-clr1" />,
    established: <FaCalendarAlt size={14} className="text-clr1" />,
    dob: <FaCalendarAlt size={14} className="text-clr1" />,
    ssn: <FaIdCard size={14} className="text-clr1" />,
    driversLicenseNumber: <FaIdBadge size={14} className="text-clr1" />,
    legal_name: <FaUserTag size={14} className="text-clr1" />,
    address: <FaMapMarkerAlt size={14} className="text-clr1" />,
    bankName: <FaLandmark size={14} className="text-clr1" />,
    rtn: <FaMoneyBillWave size={14} className="text-clr1" />,
    accountNumber: <FaCreditCard size={14} className="text-clr1" />
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
    ownershipPercentage: '0 - 100 (up to 2 decimals)'
  };

  const validators = {
    driversLicenseNumber: /^[A-Za-z0-9]{5,20}$/,
    rtn: /^\d{9}$/,
    accountNumber: /^\d{4,17}$/,
    ownershipPercentage: /^(100(\.0{1,2})?|[1-9]?[0-9](\.\d{1,2})?)$/
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const renderField = (key, colSpan = 1) => (
    <div key={key} className={`flex flex-col gap-1 col-span-${colSpan}`}>
      <label className="text-[13px] text-gray-700 font-medium flex items-center gap-2 capitalize">
        {fieldIcons[key]}
        {key === 'person_name' ? 'Client Name' :
         key === 'businessRole' ? 'Designation' :
         key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
      </label>
      <input
        name={key}
        value={formData[key]}
        onChange={handleChange}
        type={
          key === 'dob' || key === 'established' ? 'date' :
          key === 'ownershipPercentage' ? 'number' : 'text'
        }
        className={`w-full border px-3 py-[7px] text-[13px] rounded focus:outline-none focus:ring-1 ${
          errors[key] ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-clr1'
        }`}
        placeholder={placeholders[key] || `Enter ${key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}`}
        min={key === 'ownershipPercentage' ? '0' : undefined}
        step={key === 'ownershipPercentage' ? '0.01' : '1'}
      />
      {errors[key] && <span className="text-[11px] text-red-500 mt-0.5">{errors[key]}</span>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-gray-800">Edit Lead Information</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-clr1 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {renderField('person_name')}
            {renderField('personal_email')}
            {renderField('contact')}
            {renderField('dob')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {renderField('legal_name')}
            {renderField('address')}
            {renderField('ssn')}
            {renderField('driversLicenseNumber')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {renderField('business_name')}
            {renderField('businessRole')}
            {renderField('business_email')}
            {renderField('business_contact')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {renderField('business_address', 2)}
            {renderField('established')}
            {renderField('ownershipPercentage')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {renderField('bankName')}
            {renderField('rtn')}
            {renderField('accountNumber', 2)}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-6 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-clr1 text-white rounded hover:bg-clr1/90 flex items-center gap-2"
            >
              <FaSave size={14} />
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default LeadEditForm;