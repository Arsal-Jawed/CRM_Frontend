import { useEffect, useState } from 'react';
import { FiX, FiCheckCircle, FiFileText, FiSend, FiMessageCircle, FiUser, FiBriefcase } from 'react-icons/fi';
import CONFIG from '../Configuration';

function TicketForm({ onClose, prefill = {} }) {
  const [details, setDetails] = useState('');
  const [comment, setComment] = useState('');
  const [leadId, setLeadId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const generator = user.firstName + ' ' + user.lastName;
  const generatorType = user.role === 4 || user.role === 5 ? 'Operation Agent' : 'Sale Agent';

  const IP = CONFIG.API_URL;

  useEffect(() => {
    // fetch leadId based on clientName & businessName
    if (prefill.clientName && prefill.businessName) {
      fetch(`${IP}/leads/all`)
        .then(res => res.json())
        .then(data => {
          const leads = Array.isArray(data) ? data : data.leads || []; // ensure it's always an array
          const match = leads.find(
            l => l.person_name === prefill.clientName && l.business_name === prefill.businessName
          );
          if (match) setLeadId(match.lead_id);
        }).catch(err => console.error('Failed to load leadId:', err));
    }
  }, [prefill.clientName, prefill.businessName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leadId) {
      alert("Lead not found for the selected client and business!");
      return;
    }

    const body = {
      leadId,
      generatorType,
      generator,
      details,
      comment
    };

    setIsSubmitting(true);
    try {
      await fetch(`${IP}/tickets/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      setShowSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error('Error creating ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiFileText className="mr-2 text-clr1" />
            Generate New Ticket
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>

        {showSuccess ? (
          <div className="p-4 bg-green-100 border border-green-200 rounded-lg flex items-center">
            <FiCheckCircle className="text-green-600 mr-2" size={20} />
            <span className="text-green-800 font-medium">Ticket created successfully!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <FiUser className="text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">{prefill.clientName || 'No Client Selected'}</span>
            </div>

            <div className="flex items-center gap-2">
              <FiBriefcase className="text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">{prefill.businessName || 'No Business Selected'}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Details</label>
              <textarea
                placeholder="Describe the issue or request..."
                rows={4}
                className="w-full border border-gray-300 px-3 py-2 outline-none rounded-md resize-none"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiMessageCircle className="mr-1" /> Optional Comment
              </label>
              <input
                type="text"
                placeholder="Add comment..."
                className="w-full border border-gray-300 px-3 py-2 outline-none rounded-md"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <FiX className="mr-1" /> Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !leadId}
                className={`px-4 py-2 rounded-md text-white flex items-center ${
                  isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-clr1 hover:bg-clr2'
                }`}
              >
                {isSubmitting ? 'Submitting...' : (<><FiSend className="mr-1" /> Generate Ticket</>)}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TicketForm;
