import { useState } from 'react';
import { FaEdit, FaShareSquare } from 'react-icons/fa';
import {LeadEditForm} from '../Components';

function LeadDetails({ lead, onUpdate }) {
  const [editing, setEditing] = useState(false);

  if (!lead) {
    return (
      <div className="w-96 h-[80vh] bg-white rounded-xl shadow-md p-6 text-gray-500 flex items-center justify-center">
        No Lead Selected
      </div>
    );
  }

  const display = (value) => value ?? '-';

  return (
    <>
      <div className="w-96 h-[80vh] bg-white rounded-xl shadow-md p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Lead Details</h2>
          <div className="flex gap-2">
            <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200">
              <FaEdit /> Edit
            </button>
            <button className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200">
              <FaShareSquare /> Follow-up
            </button>
          </div>
        </div>

        <div className="text-sm space-y-1">
          <p><strong>Name:</strong> {display(lead.person_name)}</p>
          <p><strong>Email:</strong> {display(lead.personal_email)}</p>
          <p><strong>Business:</strong> {display(lead.business_name)}</p>
          <p><strong>Business Email:</strong> {display(lead.business_email)}</p>
          <p><strong>Contact:</strong> {display(lead.contact)}</p>
          <p><strong>Business Contact:</strong> {display(lead.business_contact)}</p>
          <p><strong>Status:</strong> {display(lead.status)}</p>
          <p><strong>Rating:</strong> {display(lead.rating)}</p>
          <p><strong>Sale Type:</strong> {display(lead.saleType)}</p>
          <p><strong>Sale Close:</strong> {lead.saleCloseDateTime ? new Date(lead.saleCloseDateTime).toLocaleString() : '-'}</p>
          <p><strong>Notes:</strong> {display(lead.notes)}</p>
          <p><strong>Business Role:</strong> {display(lead.businessRole)}</p>
          <p><strong>Ownership %:</strong> {display(lead.ownershipPercentage)}</p>
          <p><strong>Years in Business:</strong> {display(lead.yearsInBusiness)}</p>
          <p><strong>Locations:</strong> {display(lead.locations)}</p>
          <p><strong>DOB:</strong> {lead.dob ? new Date(lead.dob).toLocaleDateString() : '-'}</p>
          <p><strong>SSN:</strong> {display(lead.ssn)}</p>
          <p><strong>Driver License:</strong> {display(lead.driversLicenseNumber)}</p>
          <p><strong>Address:</strong> {display(lead.address)}</p>
          <p><strong>Incorporate State:</strong> {display(lead.incorporateState)}</p>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <LeadEditForm lead={lead} onClose={() => setEditing(false)} onSave={onUpdate} />
        </div>
      )}
    </>
  );
}

export default LeadDetails;