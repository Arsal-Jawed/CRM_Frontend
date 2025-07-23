import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaBriefcase, FaPhone, FaLock, FaImage, FaIdCard, FaUniversity, FaCamera } from 'react-icons/fa';
import CONFIG from '../Configuration';

function EditUserForm({ onClose, reload, userData }) {
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
    profilePic: null,
    joining_date: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const IP = CONFIG.API_URL;

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        designation: userData.designation || '',
        contact: userData.contact || '',
        role: userData.role === 1 ? 'Manager' : 
              userData.role === 2 ? 'Sales Closure' : 
              userData.role === 3 ? 'Lead Gen' : 
              userData.role === 4 ? 'Operation Agent' :
              userData.role === 5 ? 'HR Manager' : 
              userData.role === 6 ? 'Team Lead' :'',
        password: '',
        confirmPassword: '',
        cnic: userData.cnic || '',
        accountNo: userData.accountNo || '',
        achademics: userData.achademics || '',
        profilePic: null,
        joining_date: userData.joining_date ? userData.joining_date.split('T')[0] : '',

      });
      
      if (userData.profilePic) {
        setPreviewImage(`${IP}/${userData.profilePic}`);
      }
    }
  }, [userData, IP]);

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
    if (!password) return true; // Password is optional in edit form
    const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);

  const {
    firstName, lastName, email, designation, contact, role,
    password, confirmPassword
  } = formData;

  if (!firstName || !lastName || !email || !designation || !contact || !role) {
    setError('Please fill all required fields');
    setLoading(false);
    return;
  }

  if (password && !validatePassword(password)) {
    setError('Password must be at least 8 characters and include a special character');
    setLoading(false);
    return;
  }

  if (password && password !== confirmPassword) {
    setError('Passwords do not match');
    setLoading(false);
    return;
  }

  const roleMap = {
    "Manager": 1,
    "Sales Closure": 2,
    "Lead Gen": 3,
    "Operation Agent": 4,
    "HR Manager": 5,
    "Team Lead": 6
  };

  const payload = new FormData();
  payload.append('firstName', firstName);
  payload.append('lastName', lastName);
  payload.append('email', email);
  payload.append('designation', designation);
  payload.append('contact', contact);
  payload.append('role', roleMap[role] || parseInt(role));
  if (password) payload.append('password', password);
  if (formData.cnic) payload.append('cnic', formData.cnic);
  if (formData.accountNo) payload.append('accountNo', formData.accountNo);
  if (formData.achademics) payload.append('achademics', formData.achademics);
  if (formData.profilePic) payload.append('profilePic', formData.profilePic);
  if (formData.joining_date) payload.append('joining_date', formData.joining_date);

  try {
    const res = await fetch(`${IP}/users/editUser/${userData._id}`, {
      method: 'PUT',
      body: payload
    });

    if (res.ok) {
      onClose();
      if (reload) reload();
    } else {
      setError('Failed to update user');
    }
  } catch (err) {
    console.error(err);
    setError('Server error');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-[90%] sm:w-[500px] p-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-md">
          <FaTimes />
        </button>
        <h2 className="text-lg font-semibold text-center text-clr1 mb-3">Edit Employee</h2>

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

        <form onSubmit={handleUpdate} className="space-y-2" encType="multipart/form-data">
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

          <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center border rounded-md px-2 py-1 text-sm">
            <FaEnvelope className="text-gray-400 mr-1 text-xs" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full outline-none text-xs"
            />
          </div>
          <div className="flex items-center border rounded-md px-2 py-1 text-sm">
            <FaBriefcase className="text-gray-400 mr-1 text-xs" />
            <input
              type="date"
              name="joining_date"
              placeholder="Joining Date"
              value={formData.joining_date}
              onChange={handleChange}
              className="w-full outline-none text-xs"
            />
          </div>
        </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center border rounded-md px-2 py-1 text-sm">
              <FaLock className="text-gray-400 mr-1 text-xs" />
              <input type="password" name="password" placeholder="New Password (Optional)" value={formData.password} onChange={handleChange} className="w-full outline-none text-xs" />
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
                <option value="HR Manager">HR Manager</option>
                <option value="Team Lead">Team Lead</option>
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
              disabled={loading}
              className={`w-full py-1 rounded-md text-sm text-white transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-clr1 hover:bg-orange-700'
              }`}
            >
              {loading ? 'Updating...' : 'Update Employee'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full text-xs text-gray-500 border py-1 rounded-md hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserForm;