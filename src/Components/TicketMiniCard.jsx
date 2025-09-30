import { useState } from 'react'
import {
  FiCheckCircle, FiUser, FiBriefcase, FiClock,
  FiAlertCircle, FiCheck, FiCalendar, FiEdit, FiEye
} from 'react-icons/fi'
import CONFIG from '../Configuration'

function TicketMiniCard({ ticket }) {
  const [status, setStatus] = useState(ticket.status)
  const [resolver, setResolver] = useState(ticket.resolver)
  const [resolveDate, setResolveDate] = useState(ticket.resolveDate)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [newComment, setNewComment] = useState('')

  const IP = CONFIG.API_URL

  const handleResolve = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    try {
      const res = await fetch(`${IP}/tickets/resolve/${ticket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      })
      const updated = await res.json()
      setStatus('Resolved')
      setResolver(updated.resolver)
      setResolveDate(updated.resolveDate)
    } catch (err) {
      console.error('Error resolving ticket:', err)
    }
  }

  const handleEditComment = async () => {
    try {
      const res = await fetch(`${IP}/tickets/edit/${ticket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newComment })
      })
      const updated = await res.json()
      ticket.comment = updated.comment
      setShowEdit(false)
    } catch (err) {
      console.error('Error editing comment:', err)
    }
  }

  return (
    <div
      className={`relative bg-white p-2 rounded-md shadow-sm border-l-2 ${
        status === 'Resolved' ? 'border-green-500' : 'border-orange-500'
      } hover:shadow-md transition-shadow duration-200 text-[11px]`}
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <div className="flex items-center font-medium text-gray-800">
            <FiBriefcase className="mr-1 text-gray-400" size={12} />
            {ticket.businessName || 'No business'}
          </div>
          <div className="flex items-center text-gray-600">
            <FiUser className="mr-1 text-clr1" size={11} />
            {ticket.clientName || 'N/A'}
          </div>
        </div>
        <div
          className={`px-1.5 py-0.5 rounded-full ${
            status === 'Resolved'
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'
          } flex items-center text-[10px]`}
        >
          {status === 'Resolved' ? (
            <FiCheck size={10} className="mr-1" />
          ) : (
            <FiAlertCircle size={10} className="mr-1" />
          )}
          {status}
        </div>
      </div>

      {/* Details + Icons */}
      <div className="flex justify-between items-center mb-1">
        <p className="text-gray-700 truncate pr-2">
          {ticket.details?.length > 25
            ? ticket.details.substring(0, 25) + '...'
            : ticket.details}
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setShowDetails(true)}
            className="text-gray-400 hover:text-blue-500"
          >
            <FiEye size={12} />
          </button>
          <button
            onClick={() => setShowEdit(true)}
            className="text-gray-400 hover:text-blue-500"
          >
            <FiEdit size={11} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center text-gray-500">
        <div className="flex items-center">
          <FiUser size={10} className="mr-1" />
          <span>{ticket.generator}</span>
        </div>
        <div className="flex items-center">
          <FiCalendar size={10} className="mr-1" />
          <span>{new Date(ticket.date).toLocaleDateString()}</span>
        </div>
      </div>

      {status === 'Pending' ? (
        <div className="flex justify-end mt-1">
          <button
            onClick={handleResolve}
            className="text-[10px] border border-clr1 text-clr1 py-0.5 px-1.5 rounded hover:bg-blue-50 flex items-center"
          >
            <FiCheckCircle size={10} className="mr-1" />
            Resolve
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-1 text-gray-500">
          <div className="flex items-center">
            <FiClock size={10} className="mr-1" />
            <span>{new Date(resolveDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-green-600">
            <FiCheckCircle size={10} className="mr-1" />
            <span>{resolver || 'N/A'}</span>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-lg w-[90%] max-w-sm space-y-2">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center">
              <FiEye size={12} className="mr-1" /> Ticket Details
            </h2>
            <p className="text-gray-800 text-sm">{ticket.details}</p>
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Resolver Remarks: </span>
              {ticket.comment || 'No remarks yet.'}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-3 py-1 text-xs bg-clr1 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-3 rounded-md shadow-lg w-[90%] max-w-sm space-y-2">
            <h2 className="text-sm font-semibold text-gray-700">
              Edit Resolver Comment
            </h2>
            <textarea
              className="w-full border px-2 py-1 rounded text-sm resize-none"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEdit(false)}
                className="px-3 py-1 text-xs bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditComment}
                className="px-3 py-1 text-xs bg-clr1 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketMiniCard