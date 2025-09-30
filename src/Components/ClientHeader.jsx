import React from 'react';
import {
  FiUser, FiBriefcase, FiFileText, FiEdit2
} from 'react-icons/fi';

function ClientHeader({ client, onEditClick, onFollowUpClick, renderStars }) {
  const getApplicationStatus = () => {
    if (client?.status === 'won') return client.sale?.approvalStatus || 'Pending';
    return client.sale?.leaseApprovalStatus || 'Pending';
  };

  return (
    <>
      <div className="pb-4 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h2 className="text-[1.1vw] font-semibold text-gray-800 flex items-center">
            <FiUser className="mr-2 text-clr1" />
            {client.person_name} {client.legal_name ? `(${client.legal_name})` : ''}
          </h2>
          <p className="text-gray-600 text-[0.9vw] flex items-center mt-1">
            <FiBriefcase className="mr-2 text-clr2" />
            {client.business_name}
          </p>
          <div className="flex flex-col mt-2">
            <div className="flex items-center">
              {renderStars(client.rating)}<span className='text-gray-400 text-[0.7vw] ml-[1vw]'> ({client.ratingDate?.slice(0, 10) || ''})</span>
            </div>
            <div className="flex items-center text-[0.8vw] text-gray-500 mt-1 space-x-2">
              <FiUser className="text-clr1" />
              <span>
                {client.closure1 ? client.closure1Name : 'Not Specified'}
              </span>
              <button
                onClick={onFollowUpClick}
                title="Assign Follow-up"
                className="text-clr1 hover:text-clr2"
              >
                <FiEdit2 className="text-base" />
              </button>
            </div>
          </div>
          {client.notes && (
            <p className="text-gray-500 text-[0.7vw] flex items-center mt-1">
              <FiFileText className="mr-2 text-clr3" />
              {client.notes}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <button
            className="text-sm text-clr1 hover:text-clr2"
            onClick={onEditClick}
          >
            <FiEdit2 className="text-lg" />
          </button>
        </div>
      </div>

      <div className="flex space-x-3 mt-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${client.status === 'won' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
          {client.status}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          getApplicationStatus() === 'Approved'
            ? 'bg-green-100 text-green-800'
            : getApplicationStatus() === 'Pending'
              ? 'bg-yellow-100 text-yellow-800' : getApplicationStatus() === 'Underwriting'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
        }`}>
          {client.status === 'won' ? 'Application' : 'Lease'}: {getApplicationStatus()}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            client.sale?.leaseApprovalStatus === 'Approved'
              ? 'bg-green-100 text-green-800'
              : client.sale?.leaseApprovalStatus === 'Pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          Lease: {client.sale?.leaseApprovalStatus || 'N/A'}
        </span>

        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          Credit Score: {client.sale?.creditScore ? client.sale.creditScore : " --"}
        </span>

      </div>
    </>
  );
}

export default ClientHeader;