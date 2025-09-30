import React, { useEffect, useState } from 'react'
import CONFIG from '../Configuration'
import { MyClientDetails, MyClientTableRow, TicketMiniCard } from '../Components'
import OperationDashboardHeader from '../Components/OperationDashboardHeader'
import { FiClock, FiList } from 'react-icons/fi'

function OperationDashboard() {
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Pending')
  const [tickets, setTickets] = useState([])
  const [ticketView, setTicketView] = useState('pending')

  const user = JSON.parse(localStorage.getItem('user'))
  const email = user.email
  const role = user.role

  useEffect(() => {
    const endpoint = [1, 4, 5].includes(role)
      ? `${CONFIG.API_URL}/leads/allClients`
      : `${CONFIG.API_URL}/leads/getMyClients/${email}`

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const filtered = Array.isArray(data)
          ? data.filter(client => client.status === 'won')
          : []
        setClients(filtered)
        if (filtered.length > 0 && !selectedClient) {
          setSelectedClient(filtered[0])
        }
      })
      .catch(() => setClients([]))
  }, [role, email])

  useEffect(() => {
    fetch(`${CONFIG.API_URL}/tickets/getTickets`)
      .then(res => res.json())
      .then(data => {
        setTickets(Array.isArray(data) ? data : [])
      })
      .catch(() => setTickets([]))
  }, [])

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.person_name?.toLowerCase().includes(search.toLowerCase()) ||
      client.business_name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      client.sale?.approvalStatus === statusFilter ||
      (statusFilter === 'Declined' && client.status === 'lost')
    return matchesSearch && matchesStatus
  })

  const displayedTickets =
    ticketView === 'pending'
      ? tickets.filter(t => t.status?.toLowerCase() === 'pending')
      : tickets

  return (
    <div className="flex flex-col gap-2">
      <OperationDashboardHeader
        clientsCount={clients.length}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onNewTicket={() => console.log('New Ticket')}
        onNewClient={() => console.log('New Client')}
        selectedClient={selectedClient}
      />

      <div className="flex gap-2 w-full">
        <div className="w-[56vw] flex flex-row gap-1">
          {/* 🔹 Tickets Section */}
          <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 w-[26vw] h-[62vh]">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Tickets</h2>
              <div className="flex gap-2">
                <FiClock
                  className={`cursor-pointer ${
                    ticketView === 'pending'
                      ? 'text-blue-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  size={16}
                  onClick={() => setTicketView('pending')}
                />
                <FiList
                  className={`cursor-pointer ${
                    ticketView === 'all'
                      ? 'text-blue-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  size={16}
                  onClick={() => setTicketView('all')}
                />
              </div>
            </div>
            <div className="h-[55vh] overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 space-y-2">
              {displayedTickets.length > 0 ? (
                displayedTickets.map(ticket => (
                  <TicketMiniCard key={ticket._id} ticket={ticket} />
                ))
              ) : (
                <p className="text-gray-400 text-xs text-center mt-10">
                  No tickets found
                </p>
              )}
            </div>
          </div>

          {/* 🔹 Clients Section */}
          <div className="w-[30vw] h-[62vh] bg-white rounded-xl shadow p-4 overflow-hidden group">
            <table className="min-w-full text-[11px] divide-y divide-gray-200">
              <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-semibold sticky top-0 z-10">
                <tr>
                  <th className="px-2 py-2 text-left">#</th>
                  <th className="px-2 py-2 text-left">Name</th>
                  <th className="px-2 py-2 text-left">Date</th>
                  <th className="px-2 py-2 text-left">Status</th>
                </tr>
              </thead>
            </table>
            <div className="max-h-[55vh] overflow-hidden group-hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="min-w-full text-[11px] divide-y divide-gray-200">
                <tbody className="bg-white text-gray-800 divide-y divide-gray-100">
                  {filteredClients.map((client, index) => (
                    <MyClientTableRow
                      key={client._id}
                      client={client}
                      index={index}
                      onSelect={setSelectedClient}
                      setSelectedClient={setSelectedClient}
                      compact={true}
                    />
                  ))}
                  {filteredClients.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-400">
                        No clients found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 🔹 Client Details */}
        <div className="w-[36vw] h-[62vh] [&>*]:h-full">
          <MyClientDetails client={selectedClient} />
        </div>
      </div>
    </div>
  )
}

export default OperationDashboard