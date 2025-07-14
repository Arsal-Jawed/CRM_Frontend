import React, { useState } from 'react';
import CONFIG from '../Configuration';

function DataEditForm({ data, onClose }) {
  const [form, setForm] = useState({
    owner_name: data.owner_name || '',
    business_name: data.business_name || '',
    business_contact: data.business_contact || '',
    details: data.details || '',
    followupDate: data.followupDate?.substring(0, 10) || ''
  });

  const IP = CONFIG.API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${IP}/data/edit/${data._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded-lg w-[400px] space-y-5 shadow-xl border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-800">Edit Data</h2>

        <Input label="Owner Name" name="owner_name" value={form.owner_name} onChange={handleChange} required />
        <Input label="Business Name" name="business_name" value={form.business_name} onChange={handleChange} required />
        <Input label="Business Contact" name="business_contact" value={form.business_contact} onChange={handleChange} required />
        <Input label="Details" name="details" value={form.details} onChange={handleChange} required />
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Follow-up Date</label>
          <input
            type="date"
            name="followupDate"
            value={form.followupDate}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300 transition-all"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 text-sm font-medium text-white bg-clr1 rounded-md hover:bg-opacity-90"
          >
            Save
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

export default DataEditForm;