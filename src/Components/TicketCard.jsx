import { useState } from 'react';
import {
  FiCheckCircle, FiUser, FiBriefcase, FiClock,
  FiAlertCircle, FiCheck, FiCalendar, FiEdit
} from 'react-icons/fi';
import CONFIG from '../Configuration';

function TicketCard({ ticket }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [status, setStatus] = useState(ticket.status);
  const [resolver, setResolver] = useState(ticket.resolver);
  const [resolveDate, setResolveDate] = useState(ticket.resolveDate);
  const [showEdit, setShowEdit] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [shouldResolveAfterComment, setShouldResolveAfterComment] = useState(false);

  const IP = CONFIG.API_URL;

  const handleResolve = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const res = await fetch(`${IP}/tickets/resolve/${ticket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      const updated = await res.json();
      setStatus('Resolved');
      setResolver(updated.resolver);
      setResolveDate(updated.resolveDate);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error resolving ticket:', err);
    }
  };

  const handleEditComment = async () => {
    try {
      const res = await fetch(`${IP}/tickets/edit/${ticket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newComment })
      });
      const updated = await res.json();
      ticket.comment = updated.comment;
      setShowEdit(false);
      if (shouldResolveAfterComment) handleResolve();
    } catch (err) {
      console.error('Error editing comment:', err);
    }
  };

  return (
    <div className={`relative bg-white p-3 rounded-lg shadow-md border-l-4 ${
      status === 'Resolved' ? 'border-green-500' : 'border-orange-500'
    } hover:shadow-lg transition-shadow duration-200`}>

      {showSuccess && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full shadow flex items-center">
          <FiCheckCircle size={10} className="mr-1" /> Resolved
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center text-sm font-semibold text-gray-800">
            <FiBriefcase className="mr-1 text-gray-400" size={14} />
            {ticket.businessName || 'No business name'}
          </div>
          <div className="flex items-center text-xs text-gray-600 mt-0.5">
            <FiUser className="mr-1 text-clr1" size={12} />
            {ticket.clientName || 'N/A'}
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-xs ${
          status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
        } flex items-center`}>
          {status === 'Resolved' ? <FiCheck size={12} className="mr-1" /> : <FiAlertCircle size={12} className="mr-1" />}
          {status}
        </div>
      </div>

      <div className="bg-gray-50 p-2 rounded-lg mb-2 text-xs">
        <p className="text-gray-700 pr-6">{ticket.details}</p>
      </div>

      <div className="bg-gray-50 p-2 rounded-lg mb-2 text-xs relative">
        <label className="block text-[11px] font-medium text-gray-500 mb-0.5">Resolver Remarks</label>
        <p className="text-gray-700 pr-6">{ticket.comment || 'No remarks yet.'}</p>
        <button
          onClick={() => {
            setShowEdit(true);
            setShouldResolveAfterComment(false);
          }}
          className="absolute top-1 right-1 text-gray-400 hover:text-blue-500"
        >
          <FiEdit size={12} />
        </button>
      </div>

      <div className="flex flex-wrap justify-between text-xs text-gray-500 mb-2">
        <div className="flex items-center">
          <FiUser size={12} className="mr-1" />
          <span>{ticket.generator} ({ticket.generatorType})</span>
        </div>
        <div className="flex items-center">
          <FiCalendar size={12} className="mr-1" />
          <span>{new Date(ticket.date).toLocaleDateString()}</span>
        </div>
      </div>

      {status === 'Pending' ? (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setShouldResolveAfterComment(true);
              setShowEdit(true);
            }}
            className="text-xs border border-clr1 text-clr1 py-1 px-2 rounded hover:bg-blue-50 transition-colors"
          >
            <FiCheckCircle size={12} className="inline-block mr-1" />
            Resolve
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center text-gray-500">
            <FiClock size={12} className="mr-1" />
            <span>Resolved On: {new Date(resolveDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-green-600">
            <FiCheckCircle size={12} className="mr-1" />
            <span>{resolver || 'N/A'}</span>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-xl w-[90%] max-w-sm space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">Edit Resolver Comment</h2>
            <textarea
              className="w-full border px-2 py-1 outline-none rounded text-sm resize-none"
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowEdit(false);
                  setShouldResolveAfterComment(false);
                }}
                className="text-xs px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditComment}
                className="text-xs px-3 py-1 bg-clr1 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketCard;