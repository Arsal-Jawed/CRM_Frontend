import React from 'react';

function ClientInfoGrid({ client }) {
  const clientData = [
    ['Client Name', client.person_name],
    ['Personal Email', client.personal_email],
    ['Contact', client.contact],
    ['DOB', client.dob ? new Date(client.dob).toLocaleDateString() : '-'],
    ['SSN', client.ssn],
    ['DL Number', client.driversLicenseNumber],
    ['Business Name', client.business_name],
    ['Designation', client.businessRole],
    ['Business Email', client.business_email],
    ['Business Contact', client.business_contact],
    ['Business Address', client.business_address, true],
    ['Established', client.established],
    ['Ownership %', client.ownershipPercentage],
    ['Bank Name', client.bankName],
    ['RTN', client.rtn],
    ['Account Number', client.accountNumber, true]
  ];

  return (
    <div className="flex-1 grid grid-cols-3 gap-3 overflow-y-hidden pr-1 hover:overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {clientData.map(([label, value, wide], i) => (
        <div key={i} className={`bg-gray-50 rounded-lg p-3 ${wide ? 'col-span-2' : ''}`}>
          <p className="text-[11px] text-gray-500 font-medium">{label}</p>
          <p className="text-xs text-gray-800 font-semibold truncate">{value ?? '-'}</p>
        </div>
      ))}
    </div>
  );
}

export default ClientInfoGrid;