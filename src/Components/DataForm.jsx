import React, { useState } from 'react';
import CONFIG from '../Configuration';

function DataForm({ onClose }) {
  const [form, setForm] = useState({
    owner_name: '',
    business_name: '',
    business_contact: '',
    details: '',
    followupDate: ''
  });

  const IP = CONFIG.API_URL;
  const email = JSON.parse(localStorage.getItem('user')).email;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      user: email,
      ...form
    };
    await fetch(`${IP}/data/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded-lg w-[400px] space-y-5 shadow-xl border border-gray-200"
      >
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-clr1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
            Add New Data
          </h2>
          <p className="text-sm text-gray-500">Fill the form to add new data record</p>
        </div>

        <Input label="Client Name" name="owner_name" value={form.owner_name} onChange={handleChange} required />
        <Input label="Business Name" name="business_name" value={form.business_name} onChange={handleChange} required />
        <Input label="Business Contact" name="business_contact" value={form.business_contact} onChange={handleChange} required />
        <Input label="Remarks" name="details" value={form.details} onChange={handleChange} required />
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Follow Up Date
          </label>
          <input
            type="date"
            name="followupDate"
            className="w-full border border-gray-300 px-4 py-2 rounded-md outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300 transition-all"
            value={form.followupDate}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 text-sm font-medium text-white bg-clr1 rounded-md hover:bg-opacity-90 outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300 transition-all flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, name, value, onChange, required }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}...`}
        className="w-full border border-gray-300 px-4 py-2 rounded-md outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300 transition-all"
      />
    </div>
  );
}

export default DataForm;