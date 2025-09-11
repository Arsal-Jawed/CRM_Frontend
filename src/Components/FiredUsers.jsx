import { useEffect, useState } from "react"
import { Pencil, X, UserX, AlertCircle } from "lucide-react"
import CONFIG from '../Configuration'

function FiredUsers() {
  const [firedUsers, setFiredUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [reason, setReason] = useState("")

  const IP = CONFIG.API_URL;

  const fetchFiredUsers = async () => {
    try {
      const res = await fetch(`${IP}/users/getAllFiredUsers`)
      const data = await res.json()
      setFiredUsers(data)
    } catch (err) {
      console.error("Error fetching fired users:", err)
    }
  }

  useEffect(() => {
    fetchFiredUsers()
  }, [])

  const handleSave = async () => {
    if (!editingUser) return
    try {
      await fetch(`${IP}/users/editFiredUser/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      })
      setEditingUser(null)
      setReason("")
      fetchFiredUsers()
    } catch (err) {
      console.error("Error updating fired user:", err)
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-5 w-full border border-red-100 flex flex-col" style={{ height: '30vh' }}>
      {/* Fixed Header Section */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-red-200">
        <div className="flex items-center gap-2">
          <UserX size={18} className="text-red-500" />
          <h2 className="text-base font-semibold text-red-700">Fired Employees</h2>
        </div>
        <span className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
          {firedUsers.length}
        </span>
      </div>
      
      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {firedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <AlertCircle size={32} className="text-gray-300 mb-2" />
            <p className="text-xs text-gray-500">No terminated employees</p>
          </div>
        ) : (
          <ul className="space-y-3 pr-1">
            {firedUsers.map(u => (
              <li 
                key={u._id} 
                className="flex justify-between items-start p-3 rounded-lg border border-red-100 bg-gradient-to-r from-red-50 to-red-50/30 hover:from-red-100 transition-all duration-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-red-800">{u.firstName} {u.lastName}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md">{u.designation}</span>
                  </div>
                  {u.reason && (
                    <div className="text-xs text-gray-600 mt-1.5 pl-1 border-l-2 border-red-300">
                      <span className="font-medium text-red-700 mr-1">Reason:</span> 
                      {u.reason}
                    </div>
                  )}
                </div>
                <button 
                  className="p-1.5 rounded-md hover:bg-red-200/50 transition-colors"
                  onClick={() => {
                    setEditingUser(u)
                    setReason(u.reason || "")
                  }}
                >
                  <Pencil size={14} className="text-gray-500 hover:text-red-600" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-96 p-5 relative border border-red-100">
            <button 
              className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setEditingUser(null)}
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <UserX size={18} className="text-red-500" />
              <h3 className="text-lg font-semibold text-red-700">
                Edit Termination Reason
              </h3>
            </div>
            
            <div className="mb-4 p-2.5 bg-red-50 rounded-lg border border-red-100">
              <p className="text-sm font-medium text-red-800">
                {editingUser.firstName} {editingUser.lastName}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{editingUser.designation}</p>
            </div>
            
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Termination Reason
            </label>
            <textarea 
              className="w-full border border-gray-300 outline-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-300 focus:border-red-300 transition-all"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter termination reason..."
            />
            
            <div className="flex gap-2 mt-5">
              <button 
                onClick={() => setEditingUser(null)}
                className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FiredUsers