import React from 'react';
import {
  FiUser, FiBriefcase, FiMail, FiPhone, FiHome,
  FiCalendar, FiFileText, FiCreditCard, FiPercent
} from 'react-icons/fi';

function ClientPersonalInfo({ client }) {
  const InfoItem = ({ icon, label, value, colSpan = 1 }) => (
    <div className={`flex items-start space-x-2 col-span-${colSpan}`}>
      <div className="text-clr1 mt-0.5">{icon}</div>
      <div>
        <p className="font-medium text-gray-500 text-xs">{label}</p>
        <p className="text-gray-800 text-[0.8vw]">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Personal Information Section */}
      <div className="mt-6">
        <h3 className="text-clr1 font-medium mb-3 flex items-center">
          <FiUser className="mr-2" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={<FiMail />} label="Email" value={client.personal_email} />
          <InfoItem icon={<FiPhone />} label="Contact" value={client.contact} />
          <InfoItem icon={<FiHome />} label="Address" value={client.address} />
          <InfoItem icon={<FiCalendar />} label="Date of Birth" value={client.dob?.slice(0, 10)} />
          <InfoItem icon={<FiCreditCard />} label="SSN" value={client.ssn} />
          <InfoItem icon={<FiCreditCard />} label="Driver License #" value={client.driversLicenseNumber} />
        </div>
      </div>

      {/* Business Information Section */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-clr1 font-medium mb-3 flex items-center">
          <FiBriefcase className="mr-2" />
          Business Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={<FiMail />} label="Business Email" value={client.business_email} />
          <InfoItem icon={<FiPhone />} label="Business Contact" value={client.business_contact} />
          <InfoItem icon={<FiFileText />} label="Business Role" value={client.businessRole} />
          <InfoItem icon={<FiPercent />} label="Ownership %" value={client.ownershipPercentage} />
          <InfoItem icon={<FiCalendar />} label="Established" value={client.established} />
          <InfoItem icon={<FiHome />} label="Business Address" value={client.business_address} />
        </div>
      </div>

      {/* Bank Details Section */}
      <div className="mt-6 bg-clr1 bg-opacity-5 p-4 rounded-lg border border-clr1 border-opacity-20">
        <h3 className="text-clr1 font-medium mb-3 flex items-center">
          <FiCreditCard className="mr-2" />
          Bank Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={<FiBriefcase />} label="Bank" value={client.bankName} />
          <InfoItem icon={<FiCreditCard />} label="RTN" value={client.rtn} />
          <InfoItem icon={<FiCreditCard />} label="Account #" value={client.accountNumber} />
        </div>
      </div>
    </>
  );
}

export default ClientPersonalInfo;