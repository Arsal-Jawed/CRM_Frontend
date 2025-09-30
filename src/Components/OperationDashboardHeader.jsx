import React, { useEffect, useState } from 'react'
import CONFIG from '../Configuration'
import { TicketForm, ClientForm } from './index'
import {User,Search,Filter,Ticket,Users,UserPlus,Briefcase,Target,ChevronDown,DollarSign,Package,UserCheck,UserCog,
  FileText,FileClock,CheckCircle2,Zap,XCircle,Clock} from 'lucide-react'
import { FaBuilding } from "react-icons/fa"

function OperationDashboardHeader({ search, setSearch, statusFilter, setStatusFilter, selectedClient }) {
  const [stats, setStats] = useState({
    tickets: {},
    sales: {},
    leads: {},
    equipments: {},
    users: {}
  })

  const [showTicketForm, setShowTicketForm] = useState(false)
  const [showClientForm, setShowClientForm] = useState(false)
  const [prefillData, setPrefillData] = useState(null)

  const IP = CONFIG.API_URL

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${IP}/data/dashboardStats`)
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error('Error fetching stats:', err)
      }
    }
    fetchStats()
  }, [IP])

  useEffect(() => {
    if (!selectedClient?._id) {
      setPrefillData(null)
      return
    }
    const fetchLead = async () => {
      try {
        const res = await fetch(`${IP}/leads/all`)
        const data = await res.json()
        const match = data.find(l => l._id === selectedClient._id)
        if (match) {
          setPrefillData({
            clientName: match.person_name,
            businessName: match.business_name,
            leadId: match.lead_id
          })
        }
      } catch (err) {
        console.error('Error fetching lead for client:', err)
      }
    }
    fetchLead()
  }, [selectedClient, IP])

  return (
    <>
      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 flex flex-col gap-4 text-xs">
        {/* --- ROW 1: Unchanged general stats --- */}
        <div className="flex flex-wrap items-center gap-3 text-gray-600">
          <div className="flex items-center gap-1.5 bg-clr1/10 px-2.5 py-1.5 rounded-lg">
            <Ticket size={14} className="text-clr1" />
            <span>Tickets:</span>
            <span className="font-semibold text-gray-800">
              {stats?.tickets.pendingTickets || 0} Pending
            </span>
            <span className="text-gray-400">|</span>
            <span className="font-semibold text-gray-800">
              {stats?.tickets.totalTickets || 0} Total
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1.5 rounded-lg">
            <Briefcase size={14} className="text-amber-600" />
            <span>Leads:</span>
            <span className="font-semibold text-green-600">
              {stats?.leads.wonLeads || 0} Won
            </span>
            <span className="text-gray-400">|</span>
            <span className="font-semibold text-red-600">
              {stats?.leads.lostLeads || 0} Lost
            </span>
            <span className="text-gray-400">|</span>
            <span className="font-semibold text-blue-600">
              {stats?.leads.inProcessLeads || 0} In-Process
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-50 px-2.5 py-1.5 rounded-lg">
            <UserCog size={14} className="text-purple-600" />
            <span>Ops:</span>
            <span className="font-semibold text-gray-800">
              {stats?.users.managers || 0} Managers
            </span>
            <span className="text-gray-400">|</span>
            <span className="font-semibold text-gray-800">
              {stats?.users.opsExecs || 0} Execs
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-cyan-50 px-2.5 py-1.5 rounded-lg">
            <Target size={14} className="text-cyan-600" />
            <span>Sales Closures:</span>
            <span className="font-semibold text-gray-800">
              {stats?.users.closures || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-pink-50 px-2.5 py-1.5 rounded-lg">
            <Users size={14} className="text-pink-600" />
            <span>Lead Gens:</span>
            <span className="font-semibold text-gray-800">
              {stats?.users.leadGens || 0}
            </span>
          </div>
        <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1.5 rounded-lg">
          <FaBuilding size={14} className="text-green-600" />
          <span>Leasing Company:</span>
          <span className="font-semibold text-gray-800">Finova / PCL</span>
        </div>
        </div>

        {/* --- ROW 2: Updated with Pending and "Deals" labels --- */}
        <div className="flex flex-wrap items-center gap-3 text-gray-600">
          <div className="flex items-center gap-1.5 bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-100">
            <Clock size={14} className="text-sky-600" />
            <span className="font-medium text-gray-700">Pending Deals:</span>
            <span className="font-semibold text-sky-700">
              {stats?.sales.pendingApprovals || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100">
            <FileClock size={14} className="text-amber-600" />
            <span className="font-medium text-gray-700">Submitted Deals:</span>
            <span className="font-semibold text-amber-700">
              {stats?.sales.submittedApprovals || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100">
            <CheckCircle2 size={14} className="text-green-600" />
            <span className="font-medium text-gray-700">Approved Deals:</span>
            <span className="font-semibold text-green-700">
              {stats?.sales.approvedApprovals || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100">
            <Zap size={14} className="text-blue-600" />
            <span className="font-medium text-gray-700">Activated Deals:</span>
            <span className="font-semibold text-blue-700">
              {stats?.sales.activatedApprovals || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100">
            <XCircle size={14} className="text-red-600" />
            <span className="font-medium text-gray-700">Rejected Deals:</span>
            <span className="font-semibold text-red-700">
              {stats?.sales.rejectedApprovals || 0}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100">
            <DollarSign size={14} className="text-green-600" />
            <span className="font-medium text-gray-700">Total Lease:</span>
            <span className="font-semibold text-clr2">
              ${stats?.equipments.totalLeaseAmount || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100">
            <Package size={14} className="text-amber-600" />
            <span className="font-medium text-gray-700">Equipments Sold:</span>
            <span className="font-semibold text-amber-700">
              {stats?.equipments.totalEquipments || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-pink-50 px-2.5 py-1.5 rounded-lg border border-pink-100">
            <FileText size={14} className="text-pink-600" />
            <span className="font-medium text-gray-700">Documents:</span>
            <span className="font-semibold text-pink-700">
              {stats?.sales.totalDocs || 0}
            </span>
          </div>
        </div>

        {/* --- ROW 3: Controls, Manager Info, and Action Buttons --- */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm hover:shadow transition">
              <Search size={14} className="text-gray-400 mr-1.5" />
              <input
                type="text"
                placeholder="Search clients..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="outline-none text-xs w-36"
              />
            </div>
            <div className="flex items-center border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm hover:shadow transition relative">
              <Filter size={14} className="text-gray-400 mr-1.5" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="outline-none text-xs bg-transparent appearance-none pr-6"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Activated">Activated</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown
                size={14}
                className="text-gray-400 absolute right-2 pointer-events-none"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200">
                <UserCog size={14} className="text-gray-600" />
                <span className="font-medium text-gray-700">Ops Manager:</span>
                <span className="font-semibold text-gray-800">Yazan Adnan</span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1.5 rounded-lg">
          <User size={14} className="text-green-600" />
          <span>Clients:</span>
          <span className="font-semibold text-gray-800">
            {stats?.sales.totalClients || 0}
          </span>
        </div>
            {selectedClient && (
              <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100">
                <UserCheck size={14} className="text-blue-600" />
                <span className="font-medium text-gray-700">
                  {selectedClient.person_name}
                </span>
                <span className="text-gray-400">|</span>
                <span className="font-semibold text-clr1">
                  {selectedClient.business_name}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTicketForm(true)}
              className="px-3 py-1.5 bg-clr1 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow hover:shadow-md transition"
            >
              <UserPlus size={14} />
              <span>New Ticket</span>
            </button>
            <button
              onClick={() => setShowClientForm(true)}
              className="px-3 py-1.5 bg-clr2 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow hover:shadow-md transition"
            >
              <UserPlus size={14} />
              <span>New Client</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- Modals are unchanged --- */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800 text-sm">
                New Ticket {prefillData ? `for ${prefillData.clientName}` : ''}
              </h2>
              <button
                onClick={() => setShowTicketForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>
            <TicketForm onClose={() => setShowTicketForm(false)} prefill={prefillData || {}} />
          </div>
        </div>
      )}

      {showClientForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800 text-sm">New Client</h2>
              <button
                onClick={() => setShowClientForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>
            <ClientForm onClose={() => setShowClientForm(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export default OperationDashboardHeader