import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import CONFIG from '../Configuration';

function SaleEditForm({ sale, clientId, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...sale });
  const [opsReps, setOpsReps] = useState([]);

  useEffect(() => {
    fetch(`${CONFIG.API_URL}/users/byRole/4`)
      .then(res => res.json())
      .then(setOpsReps)
      .catch(console.error);
  }, []);

  const handleChange = e => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submitForm = async () => {
    const res = await fetch(`${CONFIG.API_URL}/sales/editSale/${sale._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      onSave?.(await res.json());
      onClose();
    }
  };

  const userOptions = opsReps.map(u => (
    <option key={u.id} value={u.name}>{u.name}</option>
  ));

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-[85vw] max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="bg-clr1 p-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Edit Sale Details</h2>
          <button onClick={onClose} className="text-white hover:text-clr2">
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Submit Date</label>
                <input 
                  type="date" 
                  name="submitDate" 
                  max={new Date().toISOString().slice(0,10)}
                  value={formData.submitDate?.slice(0,10)} 
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-transparent" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Credit Score</label>
                <input 
                  name="creditScore" 
                  value={formData.creditScore} 
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Approval Status</label>
                <select 
                  name="approvalStatus" 
                  value={formData.approvalStatus} 
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-transparent"
                >
                  {['Pending','Approved','Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Approve Date</label>
                <input 
                  type="date" 
                  name="approveDate" 
                  max={new Date().toISOString().slice(0,10)}
                  value={formData.approveDate?.slice(0,10)} 
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Delivered Date</label>
                <input 
                  type="date" 
                  name="deliveredDate" 
                  max={new Date().toISOString().slice(0,10)}
                  value={formData.deliveredDate?.slice(0,10)} 
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-transparent" 
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Activation Date</label>
                <input 
                  type="date" 
                  name="activationDate" 
                  max={new Date().toISOString().slice(0,10)}
                  value={formData.activationDate?.slice(0,10)} 
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-transparent" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Activated By</label>
                <select 
                  name="activatedBy" 
                  value={formData.activatedBy} 
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-transparent"
                >
                  <option value="">Select Person</option>
                  {userOptions}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Leasing Company</label>
                <input 
                  name="leasingCompany" 
                  value={formData.leasingCompany || ''} 
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-transparent"
                  placeholder="Enter leasing company name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lease Approval Status</label>
                <select 
                  name="leaseApprovalStatus" 
                  value={formData.leaseApprovalStatus} 
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-transparent"
                >
                  {['Pending','Approved','Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lease Approval Date</label>
                <input 
                  type="date" 
                  name="leaseApprovalDate" 
                  max={new Date().toISOString().slice(0,10)}
                  value={formData.leaseApprovalDate?.slice(0,10)} 
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-transparent" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 border-t flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={submitForm} 
            className="px-3 py-1 text-sm bg-clr1 text-white rounded-md hover:bg-clr2 transition-colors focus:outline-none focus:ring-1 focus:ring-clr1 focus:ring-offset-1"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaleEditForm;