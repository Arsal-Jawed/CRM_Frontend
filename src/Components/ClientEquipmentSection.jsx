import React from 'react';
import { FiLayers, FiPlus } from 'react-icons/fi';
import { EquipmentCard, AddEquipmentForm } from '../Components';

function ClientEquipmentSection({ 
  client, 
  showNewEquipForm, 
  setShowNewEquipForm 
}) {
  if (!client.equipment || client.equipment.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-white p-4 rounded-lg border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-clr1 font-medium flex items-center">
          <FiLayers className="mr-2" />
          Equipment Details
        </h3>
        <button
          onClick={() => setShowNewEquipForm(true)}
          className="text-clr1 hover:text-clr2 text-sm p-1 rounded-full border border-clr1"
          title="Add Equipment"
        >
          <FiPlus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {client.equipment.map((eq, i) => (
          <EquipmentCard key={i} equipment={eq} />
        ))}
      </div>

      {showNewEquipForm && (
        <AddEquipmentForm
          clientId={client.lead_id}
          onClose={() => setShowNewEquipForm(false)}
          onSuccess={() => {
            setShowNewEquipForm(false);
            // optionally refetch client details
          }}
        />
      )}
    </div>
  );
}

export default ClientEquipmentSection;