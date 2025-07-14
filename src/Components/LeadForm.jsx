import { FaUser, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTimes, FaCalendarAlt, FaStickyNote } from 'react-icons/fa';
import { useState } from 'react';
import CONFIG from '../Configuration';

function LeadForm({ onClose }) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    address: '',
    followupDate: '',
    remarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const IP = CONFIG.API_URL;
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user.email;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName.trim()) newErrors.clientName = true;
    if (!formData.clientEmail.trim()) newErrors.clientEmail = true;
    else if (!validateEmail(formData.clientEmail)) newErrors.clientEmail = true;
    if (!formData.clientPhone.trim()) newErrors.clientPhone = true;
    if (!formData.businessName.trim()) newErrors.businessName = true;
    if (!formData.followupDate.trim()) newErrors.followupDate = true;
    else {
      const selected = new Date(formData.followupDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) newErrors.followupDate = true;
    }
    if (formData.businessEmail && !validateEmail(formData.businessEmail)) newErrors.businessEmail = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const leadData = {
    email,
    person_name: formData.clientName,
    personal_email: formData.clientEmail,
    business_name: formData.businessName,
    business_email: formData.businessEmail,
    contact: formData.clientPhone,
    business_contact: formData.businessPhone,
    address: formData.address,
    followupDate: formData.followupDate,
    notes: formData.remarks
  };

  try {
    setLoading(true);
    const response = await fetch(`${IP}/leads/create`, {
      method: 'POST',
      body: JSON.stringify(leadData),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create lead');
    }

    alert(`Lead created successfully!\nClient: ${formData.clientName}`);
    onClose();
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error('Error creating lead:', error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-4 w-[90vw] max-w-[450px] shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Add New Lead</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Client Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Information</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <InputField icon={<FaUser size={14} />} name="clientName" placeholder="Full Name" value={formData.clientName} onChange={handleChange} error={errors.clientName} />
              </div>
              <div className="col-span-1">
                <InputField icon={<FaEnvelope size={14} />} name="clientEmail" placeholder="Email" value={formData.clientEmail} onChange={handleChange} error={errors.clientEmail} />
              </div>
              <div className="col-span-1">
                <InputField icon={<FaPhone size={14} />} name="clientPhone" placeholder="Phone" value={formData.clientPhone} onChange={handleChange} error={errors.clientPhone} />
              </div>
            </div>
          </div>

          {/* Business Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Information</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <InputField icon={<FaBuilding size={14} />} name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} error={errors.businessName} />
              </div>
              <div className="col-span-1">
                <InputField icon={<FaEnvelope size={14} />} name="businessEmail" placeholder="Business Email" value={formData.businessEmail} onChange={handleChange} error={errors.businessEmail} />
              </div>
              <div className="col-span-1">
                <InputField icon={<FaPhone size={14} />} name="businessPhone" placeholder="Business Phone" value={formData.businessPhone} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</h4>
            <div className="flex items-start border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-transparent">
              <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1 text-sm" size={14} />
              <textarea
                name="address"
                placeholder="Full Address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                className="w-full text-sm focus:outline-none resize-none"
              ></textarea>
            </div>
          </div>

          {/* Follow-up Date & Remarks */}
          <div className="flex flex-col">
            <div className="col-span-1 space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Follow-up</h4>
              <div className={`flex items-center border rounded-lg px-3 py-2 ${errors.followupDate ? 'border-red-500' : 'border-gray-300'} focus-within:ring-1 focus-within:ring-blue-500`}>
                <FaCalendarAlt className="text-gray-400 mr-2 text-sm" size={14} />
                <input
                  name="followupDate"
                  type="date"
                  value={formData.followupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={handleChange}
                  className="w-full text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="col-span-1 space-y-2 mt-[1vh]">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Remarks</h4>
              <div className="flex items-start border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-transparent">
                <FaStickyNote className="text-gray-400 mr-2 mt-1 text-sm" size={14} />
                <textarea
                  name="remarks"
                  rows={1}
                  placeholder="Notes"
                  value={formData.remarks}
                  onChange={handleChange}
                  className="w-full text-sm focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Error Notice */}
          {Object.keys(errors).length > 0 && (
            <p className="text-red-500 text-xs text-right mt-1">Please fill all required fields correctly</p>
          )}

          <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-medium text-white bg-clr1 rounded-lg hover:bg-clr2 transition-colors flex items-center gap-2"
            disabled={loading}
          >
            {loading && <span className="animate-spin rounded-full w-3 h-3 border-t-2 border-white border-solid"></span>}
            {loading ? 'Saving...' : 'Save Lead'}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ icon, name, value, onChange, placeholder, error }) {
  return (
    <div className="relative">
      <div className={`flex items-center border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-blue-500`}>
        <span className="text-gray-400 mr-2">{icon}</span>
        <input
          name={name}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

export default LeadForm;