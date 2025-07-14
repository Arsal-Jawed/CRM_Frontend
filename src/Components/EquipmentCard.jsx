import React, { useState } from 'react';
import {
  FiFileText, FiBriefcase, FiTruck, FiDollarSign, FiLayers,
  FiX, FiEdit2, FiTrash2
} from 'react-icons/fi';
import { EquipementForm } from '../Components';
import CONFIG from '../Configuration';

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-2">
    <div className="text-clr1 mt-0.5">{icon}</div>
    <div>
      <p className="font-medium text-gray-500 text-xs">{label}</p>
      <p className="text-gray-800 text-sm">{value || '—'}</p>
    </div>
  </div>
);

function EquipmentCard({ equipment, onDeleted }) {
  const [showModal, setShowModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`${CONFIG.API_URL}/equipments/deleteEquipment/${equipment._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        onDeleted?.(equipment._id);
        setShowModal(false);
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (err) {
      alert('Error deleting equipment');
    }
  };

  return (
    <>
      <div className="relative w-[22vw] border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition-all bg-white">
        <div className="absolute top-2 right-2 flex space-x-2 z-10">
          <button onClick={() => setShowEditForm(true)} className="text-clr1 hover:text-blue-500">
            <FiEdit2 />
          </button>
          <button onClick={() => setShowConfirmDelete(true)} className="text-red-500 hover:text-red-600">
            <FiTrash2 />
          </button>
        </div>

        <div onClick={() => setShowModal(true)} className="cursor-pointer">
          <h4 className="text-clr1 font-semibold flex items-center mb-1">
            <FiLayers className="mr-2" /> {equipment.equipement}
          </h4>
          <p className="text-sm text-gray-600 flex items-center">
            <FiBriefcase className="mr-2" /> {equipment.brand}
          </p>
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <FiTruck className="mr-2" /> Qty: {equipment.quantity}
          </p>
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <FiDollarSign className="mr-2" /> ${equipment.leaseAmount?.$numberDecimal}
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              onClick={() => setShowModal(false)}
            >
              <FiX className="text-lg" />
            </button>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-clr1 flex items-center">
                <FiLayers className="mr-2" /> Equipment Details
              </h3>
              <div className="space-x-3">
                <button
                  onClick={() => {
                    setShowEditForm(true);
                    setShowModal(false);
                  }}
                  className="text-clr1 hover:text-blue-500"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={<FiFileText />} label="Equipment" value={equipment.equipement} />
              <InfoItem icon={<FiBriefcase />} label="Brand" value={equipment.brand} />
              <InfoItem icon={<FiTruck />} label="Quantity" value={equipment.quantity} />
              <InfoItem icon={<FiDollarSign />} label="Lease Amount" value={`$${equipment.leaseAmount?.$numberDecimal}`} />
              <InfoItem icon={<FiLayers />} label="Accessory" value={equipment.Accessory} />
            </div>
          </div>
        </div>
      )}

      {showEditForm && (
        <EquipementForm
          equipmentId={equipment._id}
          clientId={equipment.clientId}
          onClose={() => setShowEditForm(false)}
        />
      )}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this equipment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowConfirmDelete(false);
                }}
                className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

    </>
  );
}

export default EquipmentCard;