import { useEffect, useState } from 'react';
import { FiX, FiCheckCircle, FiUser, FiFileText, FiSend } from 'react-icons/fi';
import CONFIG from '../Configuration';

function TicketForm({ onClose }) {
  const [leadId, setLeadId] = useState('');
  const [details, setDetails] = useState('');
  const [leads, setLeads] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const generator = user.firstName + ' ' + user.lastName;
  const generatorType = user.role === 4 ? 'Operation Agent' : 'Sale Agent';

  const IP = CONFIG.API_URL;

  useEffect(() => {
    fetch(`${IP}/leads/all`)
      .then((res) => res.json())
      .then((data) => setLeads(data))
      .catch((err) => console.error('Failed to load leads', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const body = {
      leadId,
      generatorType,
      generator,
      details
    };

    try {
      await fetch(`${IP}/tickets/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      // Show success message
      setShowSuccess(true);
      
      // Close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error creating ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiFileText className="mr-2 text-clr1" />
            Generate New Ticket
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {showSuccess ? (
          <div className="p-4 bg-green-100 border border-green-200 rounded-lg flex items-center">
            <FiCheckCircle className="text-green-600 mr-2" size={20} />
            <span className="text-green-800 font-medium">
              Ticket created successfully!
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUser className="mr-1" /> Client
              </label>
              <select
                className="w-full border border-gray-300 px-3 py-2 outline-none rounded-md"
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                required
              >
                <option value="">Select a client</option>
                {leads.map((lead) => (
                  <option key={lead._id} value={lead.lead_id}>
                    {lead.person_name} ({lead.business_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ticket Details
              </label>
              <textarea
                placeholder="Describe the issue or request..."
                rows={5}
                className="w-full border border-gray-300 px-3 py-2 outline-none rounded-md resize-none"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                <FiX className="mr-1" /> Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md text-white flex items-center ${
                  isSubmitting
                    ? 'bg-orange-400 cursor-not-allowed'
                    : 'bg-clr1 hover:bg-clr2 transition-colors'
                }`}
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <FiSend className="mr-1" /> Generate Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TicketForm;