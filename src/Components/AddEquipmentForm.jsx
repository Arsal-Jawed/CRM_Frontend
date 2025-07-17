import { useState } from 'react';
import {
  FiX, FiPlus, FiDollarSign, FiCreditCard,
  FiTag, FiBox, FiHash, FiList
} from 'react-icons/fi';
import { FaToolbox } from 'react-icons/fa';
import CONFIG from '../Configuration';

function AddEquipementForm({ clientId, onClose, onSuccess }) {
  const [brand, setBrand] = useState('');
  const [equipement, setEquipement] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [leaseAmount, setLeaseAmount] = useState('');
  const [leaseTerm, setLeaseTerm] = useState('');
  const [accessory, setAccessory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const equipementOptions = {
    CardConnect: [
      'CLOVER FLEX', 'CLOVER MINI', 'CLOVER STATION SOLO', 'CLOVER STATION DUO',
      'CLOVER KIOSK', 'CLOVER COMPACT', 'CLOVER GO', 'CLOVER POCKET', 'KITCHEN PRINTER','KITCHEN DISPLAY 14', 'KITCHEN DISPLAY 24', 'BARCODE SCANNER HANDHELD', 'BARCODE SCANNER HANDSFREE'
    ],
    Payroc: [
      'CLOVER FLEX', 'CLOVER MINI', 'CLOVER STATION SOLO', 'CLOVER STATION DUO',
      'CLOVER KIOSK', 'CLOVER COMPACT', 'CLOVER GO', 'CLOVER POCKET', 'KITCHEN PRINTER','KITCHEN DISPLAY 14', 'KITCHEN DISPLAY 24', 'BARCODE SCANNER HANDHELD', 'BARCODE SCANNER HANDSFREE'
    ],
    NRS: ['NRS POS', 'NRS Pay Tablet', 'NRS Register'],
    Elavon: ['Elavon Smart Terminal', 'Elavon Converge']
  };

  const IP = CONFIG.API_URL;

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${IP}/equipments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          equipement,
          quantity,
          leaseAmount,
          leaseTerm,
          Accessory: accessory,
          clientId
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm border border-clr2">
        <div className="flex justify-between items-center p-4 bg-clr1 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <FaToolbox className="text-white" size={18} />
            <h2 className="text-lg font-semibold text-white">Add Equipment</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-clr2 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FiTag className="text-clr1" size={16} />
              <label>Brand</label>
            </div>
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setEquipement('');
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-clr2 bg-opacity-10 focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-clr2"
            >
              <option value="">Select Brand</option>
              <option value="CardConnect">CardConnect</option>
              <option value="Payroc">Payroc</option>
              <option value="NRS">NRS</option>
              <option value="Elavon">Elavon</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FiList className="text-clr1" size={16} />
              <label>Equipment</label>
            </div>
            <select
              value={equipement}
              onChange={(e) => setEquipement(e.target.value)}
              disabled={!brand}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-clr2 bg-opacity-10 focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-clr2"
            >
              <option value="">Select Equipment</option>
              {equipementOptions[brand]?.map((eq) => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiHash className="text-clr1" size={16} />
                <label>Quantity</label>
              </div>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-clr2 bg-opacity-10 focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-clr2"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiCreditCard className="text-clr1" size={16} />
                <label>Lease Term</label>
              </div>
              <select
                value={leaseTerm}
                onChange={(e) => setLeaseTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-clr2 bg-opacity-10 focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-clr2"
              >
                <option value="">Select Term</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
                <option value="48">48 months</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FiDollarSign className="text-clr1" size={16} />
              <label>Lease Amount</label>
            </div>
            <input
              type="number"
              step="0.01"
              value={leaseAmount}
              onChange={(e) => setLeaseAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-clr2 bg-opacity-10 focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-clr2"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FiBox className="text-clr1" size={16} />
              <label>Accessory (Optional)</label>
            </div>
            <input
              type="text"
              value={accessory}
              onChange={(e) => setAccessory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-clr2 bg-opacity-10 focus:outline-none focus:ring-1 focus:ring-clr1 focus:border-clr2"
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-clr1"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-clr1 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-1 focus:ring-clr1 disabled:opacity-70 flex items-center"
          >
            {loading ? 'Processing...' : (<><FiPlus className="mr-1" size={14} /> Save</>)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEquipementForm;