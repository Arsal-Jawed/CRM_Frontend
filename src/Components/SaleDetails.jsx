import { useState } from 'react';
import {LeadEditForm} from './index';
import CONFIG from '../Configuration';
import { 
  FaEdit, 
  FaStar, 
  FaRegStar, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaUser, 
  FaBuilding, 
  FaMoneyBillWave, 
  FaIdCard, 
  FaFileSignature 
} from 'react-icons/fa';

function SaleDetails({ sale,onUpdate }) {
   const lead = sale.lead || {};
  const [rating, setRating] = useState(sale?.lead?.rating ? parseFloat(sale.lead.rating) : 0);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [newCreditScore, setNewCreditScore] = useState(rating.toString());
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [newRemarks, setNewRemarks] = useState(lead.notes || '');
  const [showEdit, setShowEdit] = useState(false);


  const email = JSON.parse(localStorage.getItem('user')).email;

  if (!sale) {
    return (
      <div className="text-gray-400 text-sm text-center pt-16">
        Select a sale to view details
      </div>
    );
  }

  const renderStars = (count) => {
    const stars = [];
    const fullStars = Math.floor(count);
    const hasHalfStar = count % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaRegStar key={i} className="text-gray-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const handleLeaseStatusUpdate = async (status) => {
  try {
    const res = await fetch(`${CONFIG.API_URL}/sales/lease-status/${sale.sale._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, email }),
    });

    if (res.ok) {
      const updatedSale = await res.json();
      sale.leaseSubmitDate = updatedSale.leaseSubmitDate;
      sale.leaseSubmitBy = updatedSale.leaseSubmitBy;
      sale.leaseApprovalStatus = updatedSale.leaseApprovalStatus;
      sale.leaseApprovalDate = updatedSale.leaseApprovalDate;
      sale.leaseApprovedBy = updatedSale.leaseApprovedBy;
    }
  } catch (err) {
    console.error('Failed to update lease status:', err);
  }
};

const handleApplicationStatusUpdate = async (status) => {
  try {
    const res = await fetch(`${CONFIG.API_URL}/sales/application-status/${sale.sale._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, email }),
    });

    if (res.ok) {
      const updatedSale = await res.json();
      sale.sale.currentStatus = updatedSale.currentStatus;
      sale.sale.submitDate = updatedSale.submitDate;
      sale.sale.submitBy = updatedSale.submitBy;
      sale.sale.approvalStatus = updatedSale.approvalStatus;
      sale.sale.approveDate = updatedSale.approveDate;
      sale.sale.approveBy = updatedSale.approveBy;
      sale.sale.deliveredDate = updatedSale.deliveredDate;
      sale.sale.deliveredBy = updatedSale.deliveredBy;
      sale.sale.activationDate = updatedSale.activationDate;
      sale.sale.activatedBy = updatedSale.activatedBy;
    }
  } catch (err) {
    console.error('Failed to update application status:', err);
  }
};

  const getStatusBadge = (status) => {
    const statusMap = {
      Submitted: { color: 'bg-blue-100 text-blue-700', icon: <FaCheckCircle className="mr-1" /> },
      Approved: { color: 'bg-green-100 text-green-700', icon: <FaCheckCircle className="mr-1" /> },
      Declined: { color: 'bg-red-100 text-red-700', icon: <FaTimesCircle className="mr-1" /> },
      Delivered: { color: 'bg-yellow-100 text-yellow-700', icon: <FaCheckCircle className="mr-1" /> },
      Activated: { color: 'bg-purple-100 text-purple-700', icon: <FaCheckCircle className="mr-1" /> },
    };

    const defaultStatus = { color: 'bg-gray-100 text-gray-700', icon: <FaCheckCircle className="mr-1" /> };
    const currentStatus = statusMap[status] || defaultStatus;

    return (
      <span className={`px-3 py-1 text-xs rounded-full flex items-center ${currentStatus.color}`}>
        {currentStatus.icon}
        {status || 'Pending'}
      </span>
    );
  };

  return (
    <div className="pr-2">
      <div className="space-y-6 text-sm relative pb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                {lead.person_name || 'Sale Details'}
                {getStatusBadge(sale.sale.currentStatus)}
              </h2>
              <div className="text-gray-500 text-sm mt-1">
                Closed by: <span className="font-medium text-gray-700">{lead.ratedBy || '-'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className=" p-2 flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(rating)}
                  <span className="ml-2 text-[0.7vw] text-gray-400">
                    {rating.toFixed(1)}/5
                  </span>
                </div>
              </div>
              <button onClick={() => setShowEdit(true)} 
              className="text-clr1 hover:text-clr2 transition p-2 rounded-full hover:bg-clr1 hover:bg-opacity-10">
                <FaEdit size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <FaIdCard className="text-blue-500" />
                  <span className="text-xs font-medium">Credit Score</span>
                </div>
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="text-clr1 hover:text-clr2 p-1 rounded-full hover:bg-clr1 hover:bg-opacity-10"
                >
                  <FaEdit size={12} />
                </button>
              </div><span>{sale.sale.creditScore || '-'}</span>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <FaFileSignature className="text-purple-500" />
                <span className="text-xs font-medium">Lease Status</span>
              </div>
              <div className={`text-sm font-medium ${
                sale.sale.leaseApprovalStatus === 'Approved' ? 'text-green-600' :
                sale.sale.leaseApprovalStatus === 'Rejected' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {sale.sale.leaseApprovalStatus || 'Pending'}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <FaCalendarAlt className="text-clr1" />
                <span className="text-xs font-medium">Closed Date & Time</span>
              </div>
              <div className="text-sm font-medium text-gray-700">
                {formatDate(lead.saleCloseDateTime)}
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <FaMoneyBillWave className="text-clr1" />
            Sale Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Submit Date" value={formatDate(sale.sale.submitDate)} />
            <Detail label="Marked Submitted By" value={sale.sale.submitBy} />
            <Detail label="Approve Date" value={formatDate(sale.sale.approveDate)} />
            <Detail label="Marked Approved By" value={sale.sale.approveBy} />
            <Detail label="Delivered Date" value={formatDate(sale.deliveredDate)} />
            <Detail label="Marked Delivered By" value={sale.sale.deliveredBy} />
            <Detail label="Activation Date" value={formatDate(sale.activationDate)} />
            <Detail label="Marked Activated By" value={sale.sale.activatedBy} />
          </div>
          
          <div className="col-span-2 pt-4 mt-2">
            <div className="flex flex-wrap gap-2">
              <StatusButton label="Mark Submitted" color="blue" icon={<FaCheckCircle size={12} />}
                onClick={() => handleApplicationStatusUpdate('Submitted')}/>
              <StatusButton label="Mark Approved" color="green" icon={<FaCheckCircle size={12} />}
                onClick={() => handleApplicationStatusUpdate('Approved')}/>
              <StatusButton label="Mark Declined" color="red" icon={<FaTimesCircle size={12} />}
                onClick={() => handleApplicationStatusUpdate('Rejected')}/>
              <StatusButton label="Mark Delivered" color="yellow" icon={<FaCheckCircle size={12} />}
                onClick={() => handleApplicationStatusUpdate('Delivered')}/>
              <StatusButton label="Mark Activated" color="purple" icon={<FaCheckCircle size={12} />}
                onClick={() => handleApplicationStatusUpdate('Activated')}/>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <FaBuilding className="text-clr1" />
            Lease Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Lease Submit Date" value={formatDate(sale.sale.leaseSubmitDate)} />
            <Detail label="Marked Submitted By" value={sale.sale.leaseSubmitBy} />
            <Detail label="Approval Status Update Date" value={formatDate(sale.sale.leaseApprovalDate)} />
            <Detail label="Approval Status Updated By" value={sale.sale.leaseApprovedBy} />
          </div>
          
          <div className="col-span-2 pt-4 mt-2">
            <div className="flex flex-wrap gap-2">
              <StatusButton label="Mark Lease Submitted" color="blue" icon={<FaCheckCircle size={12} />}
                onClick={() => handleLeaseStatusUpdate('Submitted')}/>
              <StatusButton label="Mark Lease Approved" color="green" icon={<FaCheckCircle size={12} />}
                onClick={() => handleLeaseStatusUpdate('Approved')}/>
              <StatusButton label="Mark Lease Rejected" color="red" icon={<FaTimesCircle size={12} />}
                onClick={() => handleLeaseStatusUpdate('Rejected')}/>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <FaUser className="text-clr1" />
            Personal Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Client Name" value={lead.person_name} />
            <Detail label="Personal Email" value={lead.personal_email} />
            <Detail label="Contact" value={lead.contact} />
            <Detail label="DOB" value={formatDate(lead.dob)} />
            <Detail label="Address" value={lead.address} />
            <Detail label="SSN" value={lead.ssn} />
            <Detail label="Driver's License #" value={lead.driversLicenseNumber} />
            <Detail label="Ownership %" value={lead.ownershipPercentage} />
            <Detail label="Notes" value={lead.notes} />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <FaBuilding className="text-clr1" />
            Business Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Business Name" value={lead.business_name} />
            <Detail label="Business Email" value={lead.business_email} />
            <Detail label="Business Contact" value={lead.business_contact} />
            <Detail label="Business Role" value={lead.businessRole} />
            <Detail label="Years in Business" value={lead.yearsInBusiness} />
            <Detail label="Incorporate State" value={lead.incorporateState} />
            <Detail label="Locations" value={lead.locations} />
            <Detail label="Sale Type" value={lead.saleType} />
            <Detail label="Sale Closed On" value={formatDate(lead.saleCloseDateTime)} />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <FaMoneyBillWave className="text-clr1" />
            Bank Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Bank Name" value={lead.bankName} />
            <Detail label="RTN" value={lead.rtn} />
            <Detail label="Account #" value={lead.accountNumber} />
            <Detail label="Account Type" value={lead.accountType} />
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <FaEdit className="text-clr1" />
            Remarks
          </h3>
          <button
            onClick={() => setShowRemarksModal(true)}
            className="text-clr1 hover:text-clr2 p-1 rounded-full hover:bg-clr1 hover:bg-opacity-10"
          >
            <FaEdit size={14} />
          </button>
        </div>
        <div className="text-sm text-gray-700 whitespace-pre-wrap">
          {lead.notes || 'No remarks yet'}
        </div>
      </div>
      </div>
      {showCreditModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Update Credit Score</h2>
      
      <select
        value={newCreditScore}
        onChange={(e) => setNewCreditScore(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-clr1"
      >
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="E">E</option>
        <option value="F">F</option>
      </select>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowCreditModal(false)}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            try {
              const res = await fetch(`${CONFIG.API_URL}/sales/credit-score/${sale.sale._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({score: newCreditScore}),
              });
              if (res.ok) {
                sale.sale.creditScore = newCreditScore;
                setShowCreditModal(false);
              }
            } catch (err) {
              console.error('Failed to update credit score:', err);
            }
          }}
          className="px-3 py-1 text-sm bg-clr1 text-white rounded hover:bg-clr2"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}
{showRemarksModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Update Remarks</h2>
      
      <textarea
        value={newRemarks}
        onChange={(e) => setNewRemarks(e.target.value)}
        rows={5}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-clr1 resize-none"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowRemarksModal(false)}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            try {
              const res = await fetch(`${CONFIG.API_URL}/leads/notes/${lead._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: newRemarks }),
              });
              if (res.ok) {
                lead.notes = newRemarks;
                setShowRemarksModal(false);
              }
            } catch (err) {
              console.error('Failed to update remarks:', err);
            }
          }}
          className="px-3 py-1 text-sm bg-clr1 text-white rounded hover:bg-clr2"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}
{showEdit && (<LeadEditForm lead={lead} onClose={() => setShowEdit(false)} onUpdate={onUpdate} />)}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="hover:bg-gray-50 p-2 rounded transition">
      <div className="text-xs text-gray-500 mb-1 font-medium">{label}</div>
      <div className="text-sm text-gray-700 font-semibold">{value || '-'}</div>
    </div>
  );
}

function StatusButton({ label, color, icon, onClick }) {
  const classes = {
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    green: 'bg-green-50 text-green-700 hover:bg-green-100',
    red: 'bg-red-50 text-red-700 hover:bg-red-100',
    yellow: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1 transition ${classes[color]}`}
    >
      {icon}
      {label}
    </button>
  );
}

function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default SaleDetails;