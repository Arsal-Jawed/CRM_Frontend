import React, { useState } from 'react'
import { 
  FaListUl, 
  FaCalendarAlt, 
  FaCalendarCheck, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf, 
  FaUserSlash, 
  FaGlobe,
  FaBan
} from 'react-icons/fa'

function LeadAdminHeader({ 
  leads, 
  users, 
  selectedUser, 
  filterByUser, 
  showTodaysLeads,
  filterByStatus,
  stats,
  searchQuery,
  setSearchQuery,
  loading,
  filterBySpecificDate
}) {
  const [showDateInput, setShowDateInput] = useState(false)
  const [specificDate, setSpecificDate] = useState('')

  const roleGroups = {
    2: 'Sales Closure',
    3: 'Lead Gen'
  }

  const groupedUsers = Object.entries(roleGroups).map(([role, label]) => ({
    label,
    users: users
      .filter(u => !u.isFired && u.role === parseInt(role))
      .sort((a, b) => {
        const nameA = (a.firstName + ' ' + a.lastName).toLowerCase()
        const nameB = (b.firstName + ' ' + b.lastName).toLowerCase()
        return nameA.localeCompare(nameB)
      })
  }))

  const firedGroup = {
    label: 'Fired Users',
    users: users
      .filter(u => u.isFired)
      .sort((a, b) => {
        const nameA = (a.firstName + ' ' + a.lastName).toLowerCase()
        const nameB = (b.firstName + ' ' + b.lastName).toLowerCase()
        return nameA.localeCompare(nameB)
      })
  }

  return (
    <div className="mb-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaListUl className="text-clr1" />
          <span>Leads Pipeline</span>
          <span className="bg-clr1/10 text-clr1 text-xs px-2 py-1 rounded-full">
            {leads.length} showing
          </span>
        </h2>

        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <button onClick={() => filterByStatus('won')} title="Won Leads" className="hover:text-green-600">
            <FaCheckCircle />
          </button>
          <button onClick={() => filterByStatus('loss')} title="Loss Leads" className="hover:text-red-600">
            <FaTimesCircle />
          </button>
          <button onClick={() => filterByStatus('in process')} title="In Process Leads" className="hover:text-yellow-600">
            <FaHourglassHalf />
          </button>
          <button onClick={() => filterByStatus('unassigned')} title="Unassigned Leads" className="hover:text-blue-600">
            <FaUserSlash />
          </button>
          <button onClick={() => filterByStatus('rejected')} title="Rejected Leads" className="hover:text-purple-600">
            <FaBan />
          </button>
          <button onClick={() => filterByStatus('all')} title="All Leads" className="hover:text-gray-800">
            <FaGlobe />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-medium">
        {/* <span className="px-2 py-1 rounded bg-gray-100">Total: {stats.total}</span> */}
        <span className="px-2 py-1 rounded bg-green-100 text-green-700">Won: {stats.won}</span>
        <span className="px-2 py-1 rounded bg-red-100 text-red-700">Loss: {stats.loss}</span>
        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">In Process: {stats.inProcess}</span>
        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">Unassigned: {stats.unassigned}</span>
        <span className="px-2 py-1 rounded bg-purple-100 text-purple-700">Rejected: {stats.rejected}</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={selectedUser}
          onChange={e => filterByUser(e.target.value)}
          className="border px-3 py-2 rounded text-sm text-gray-700 bg-white shadow-sm focus:ring-1 focus:ring-clr1 focus:outline-none w-[18vw]"
        >
          <option value="">Filter by User</option>
          {groupedUsers.map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.users.map(user => (
                <option key={user._id} value={user.email}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </optgroup>
          ))}
          {firedGroup.users.length > 0 && (
            <optgroup key="fired" label={firedGroup.label}>
              {firedGroup.users.map(user => (
                <option key={user._id} value={user.email}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </optgroup>
          )}
        </select>

        <button
          onClick={showTodaysLeads}
          className="p-2 rounded bg-clr1 text-white hover:bg-clr1/80"
          title="Show Today's Leads"
        >
          <FaCalendarAlt className="text-sm" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDateInput(!showDateInput)}
            className="p-2 rounded bg-clr1 text-white hover:bg-clr1/80"
            title="Filter by Specific Date"
          >
            <FaCalendarCheck className="text-sm" />
          </button>
          {showDateInput && (
            <input
              type="date"
              value={specificDate}
              onChange={e => {
                setSpecificDate(e.target.value)
                filterBySpecificDate(e.target.value)
              }}
              className="absolute top-12 left-0 border px-2 py-1 rounded text-sm shadow bg-white"
            />
          )}
        </div>
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search by Person or Business..."
        className="w-full border px-3 py-2 rounded text-sm text-gray-700 bg-white shadow-sm focus:ring-1 focus:ring-clr1 focus:outline-none"
      />
    </div>
  )
}

export default LeadAdminHeader