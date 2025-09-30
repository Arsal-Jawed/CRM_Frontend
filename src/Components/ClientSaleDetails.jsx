import React from 'react';
import {
  FiDollarSign, FiCalendar, FiCheckCircle, FiUser, FiGlobe, FiEdit2
} from 'react-icons/fi';
import { SaleEditForm } from '../Components';

function ClientSaleDetails({ client, showSaleEdit, setShowSaleEdit }) {
  const InfoItem = ({ icon, label, value, colSpan = 1 }) => (
    <div className={`flex items-start space-x-2 col-span-${colSpan}`}>
      <div className="text-clr1 mt-0.5">{icon}</div>
      <div>
        <p className="font-medium text-gray-500 text-xs">{label}</p>
        <p className="text-gray-800 text-[0.8vw]">{value || '—'}</p>
      </div>
    </div>
  );

  if (!client.sale) {
    return null;
  }

  return (
    <>
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-clr1 font-medium flex items-center">
            <FiDollarSign className="mr-2" />
            Sale Details
          </h3>
          <button
            onClick={() => setShowSaleEdit(true)}
            className="text-clr1 hover:text-clr2 text-sm p-1 rounded-full border border-clr1"
            title="Edit Sale"
          >
            <FiEdit2 size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={<FiCalendar />} label="Submit Date" value={client.sale.submitDate?.slice(0, 10)} />
          <InfoItem icon={<FiCheckCircle />} label="Approval Status" value={client.sale.approvalStatus} />
          <InfoItem icon={<FiCalendar />} label="Approval Date" value={client.sale.approveDate?.slice(0, 10)} />
          <InfoItem icon={<FiCalendar />} label="Delivered Date" value={client.sale.deliveredDate?.slice(0, 10)} />
          <InfoItem icon={<FiUser />} label="Activated By" value={client.sale.activatedBy} />
          <InfoItem icon={<FiCalendar />} label="Activation Date" value={client.sale.activationDate?.slice(0, 10)} />
          <InfoItem icon={<FiCalendar />} label="Lease Submit Date" value={client.sale.leaseSubmitDate?.slice(0, 10)} />
          <InfoItem icon={<FiCheckCircle />} label="Lease Approval Status" value={client.sale.leaseApprovalStatus} />
          <InfoItem icon={<FiCalendar />} label="Lease Approval Date" value={client.sale.leaseApprovalDate?.slice(0, 10)} />
          <InfoItem icon={<FiGlobe />} label="Leasing Company" value={client.sale.leasingCompany} />
        </div>
      </div>
      
      {showSaleEdit && (
        <SaleEditForm
          sale={client.sale}
          onClose={() => setShowSaleEdit(false)}
          clientId={client._id}
        />
      )}
    </>
  );
}

export default ClientSaleDetails;