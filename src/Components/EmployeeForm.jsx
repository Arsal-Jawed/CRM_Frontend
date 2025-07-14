import React, { useState, useRef } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaBriefcase, FaPhone, FaLock, FaImage, FaIdCard, FaUniversity, FaCamera } from 'react-icons/fa';
import CONFIG from '../Configuration';

function EmployeeForm({ onClose, reload }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    designation: '',
    contact: '',
    role: '',
    password: '',
    confirmPassword: '',
    cnic: '',
    accountNo: '',
    achademics: '',
    profilePic: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const IP = CONFIG.API_URL;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    setError('');
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const {
    firstName, lastName, email, designation, contact, role,
    password, confirmPassword, cnic, accountNo, achademics, profilePic
  } = formData;

  if (!firstName || !lastName || !email || !designation || !contact || !role || !password || !confirmPassword) {
    setError('Please fill all required fields');
    setLoading(false);
    return;
  }

  if (!validatePassword(password)) {
    setError('Password must be at least 8 characters and include a special character');
    setLoading(false);
    return;
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    setLoading(false);
    return;
  }

  const roleMap = {
    "Manager": 1,
    "Sales Closure": 2,
    "Lead Gen": 3,
    "Operation Agent": 4
  };

  const payload = new FormData();
  payload.append('firstName', firstName);
  payload.append('lastName', lastName);
  payload.append('email', email);
  payload.append('designation', designation);
  payload.append('contact', contact);
  payload.append('role', roleMap[role] || parseInt(role));
  payload.append('password', password);
  payload.append('joining_date', new Date().toISOString().split('T')[0]);
  if (cnic) payload.append('cnic', cnic);
  if (accountNo) payload.append('accountNo', accountNo);
  if (achademics) payload.append('achademics', achademics);
  if (profilePic) payload.append('profilePic', profilePic);

  try {
    const res = await fetch(`${IP}/users/createUser`, {
      method: 'POST',
      body: payload
    });

    if (res.ok) {
      onClose();
      if (reload) reload();
    } else {
      setError('Failed to create user');
    }
  } catch (err) {
    console.error(err);
    setError('Server error');
  }

  setLoading(false);
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-[90%] sm:w-[500px] p-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-md">
          <FaTimes />
        </button>
        <h2 className="text-lg font-semibold text-center text-clr1 mb-3">Add New Employee</h2>

        <div className="flex justify-center mb-3">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={handleImageClick}
            >
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <FaImage className="text-gray-400 text-2xl" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-clr1 text-white p-1 rounded-full cursor-pointer">
              <FaCamera className="text-xs" />
            </div>
            <input 
              type="file" 
              name="profilePic" 
              accept="image/*" 
              onChange={handleChange} 
              ref={fileInputRef}
              className="hidden" 
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2" encType="multipart/form-data">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center border rounded-md px-2 py-1 text-sm">
              <FaUser className="text-gray-400 mr-1 text-xs" />
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-full outline-none text-xs" />
            </div>

            <div className="flex items-center border rounded-md px-2 py-1 text-sm">
              <FaUser className="text-gray-400 mr-1 text-xs" />
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-full outline-none text-xs" />
            </div>
          </div>

          <div className="flex items-center border rounded-md px-2 py-1 text-sm">
            <FaEnvelope className="text-gray-400 mr-1 text-xs" />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full outline-none text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center border rounded-md px-2 py-1 text-sm">
              <FaLock className="text-gray-400 mr-1 text-xs" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full outline-none text-xs" />
            </div>

            <div className="flex items-center border rounded-md px-2 py-1 text-sm">
              <FaLock className="text-gray-400 mr-1 text-xs" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full outline-none text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center border rounded-md px-2 py-1 text-sm">
              <FaBriefcase className="text-gray-400 mr-1 text-xs" />
              <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} className="w-full outline-none text-xs" />
            </div>

            <div className="flex items-center border rounded-md px-2 py-1 text-sm">
              <FaBriefcase className="text-gray-400 mr-1 text-xs" />
              <select name="role" value={formData.role} onChange={handleChange} className="w-full outline-none text-xs">
                <option value="">Select Role</option>
                <option value="Manager">Manager</option>
                <option value="Sales Closure">Sales Closure</option>
                <option value="Lead Gen">Lead Gen</option>
                <option value="Operation Agent">Operation Agent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center border rounded-md px-2 py-1 text-sm">
              <FaPhone className="text-gray-400 mr-1 text-xs" />
              <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} className="w-full outline-none text-xs" />
            </div>

            <div className="flex items-center border rounded-md px-2 py-1 text-sm">
              <FaIdCard className="text-gray-400 mr-1 text-xs" />
              <input type="text" name="cnic" placeholder="CNIC (Optional)" value={formData.cnic} onChange={handleChange} className="w-full outline-none text-xs" />
            </div>
          </div>

          <div className="flex items-center border rounded-md px-2 py-1 text-sm">
            <FaUniversity className="text-gray-400 mr-1 text-xs" />
            <input type="text" name="accountNo" placeholder="Account No (Optional)" value={formData.accountNo} onChange={handleChange} className="w-full outline-none text-xs" />
          </div>

          <div className="flex items-center border rounded-md px-2 py-1 text-sm">
            <FaBriefcase className="text-gray-400 mr-1 text-xs" />
            <input type="text" name="achademics" placeholder="Academics (Optional)" value={formData.achademics} onChange={handleChange} className="w-full outline-none text-xs" />
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="submit"
              className="w-full bg-clr1 text-white py-1 rounded-md hover:bg-orange-700 transition text-sm"
            >
              Create Employee
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-xs text-gray-500 border py-1 rounded-md hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
          <div className="border-4 border-orange-500 border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default EmployeeForm;