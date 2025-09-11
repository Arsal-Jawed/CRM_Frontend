import React, { useEffect, useState } from 'react'
import { FaUserCircle, FaEdit, FaStar, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa'
import CONFIG from '../Configuration';

function ClientHeader({ client, onEditClick }) {
  const [leadStats, setLeadStats] = useState({ won: 0, inProcess: 0, lost: 0 })
  const [saleStats, setSaleStats] = useState({ won: 0, inProcess: 0, lost: 0 })

  const IP = CONFIG.API_URL;

  const rating = client.rating || 0
  const stars = Array(5).fill(0).map((_, i) => (
    <FaStar key={i} className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} text-xs`} />
  ))

  useEffect(() => {
    const email = JSON.parse(localStorage.getItem("user")).email

    const fetchLeads = async () => {
      try {
        const res = await fetch(`${IP}/leads/email/${email}`)
        const data = await res.json()
        const won = data.filter(l => l.status === 'won').length
        const lost = data.filter(l => l.status === 'lost').length
        const inProcess = data.filter(l => l.status === 'in process').length
        setLeadStats({ won, lost, inProcess })
      } catch (err) {
        console.error("Error fetching leads:", err)
      }
    }

    const fetchSales = async () => {
      try {
        const res = await fetch(`${IP}/leads/getByClosure/${email}`)
        const data = await res.json()
        const won = data.filter(l => l.status === 'won').length
        const lost = data.filter(l => l.status === 'lost').length
        const inProcess = data.filter(l => l.status === 'in process').length
        setSaleStats({ won, lost, inProcess })
      } catch (err) {
        console.error("Error fetching sales:", err)
      }
    }

    fetchLeads()
    fetchSales()
  }, [])

  return (
  <div className="flex flex-col mb-3">
    <div className="flex justify-between items-start w-full">
      <div>
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-clr1 text-lg" />
          <h2 className="text-base font-semibold text-gray-800">
            {client.person_name || 'Client'}
          </h2>
          <div className="flex items-center gap-1 ml-1">
            {stars}
            <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{client.business_name}</p>
      </div>

      {/* Stats moved here */}
      <div className="flex items-center gap-5 text-xs mx-4">
        <div className="flex items-center gap-1 text-gray-400">
          <FaCheckCircle /> {leadStats.won} Leads
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <FaHourglassHalf /> {leadStats.inProcess} Leads
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <FaTimesCircle /> {leadStats.lost} Leads
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <FaCheckCircle /> {saleStats.won} Sales
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <FaHourglassHalf /> {saleStats.inProcess} Sales
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <FaTimesCircle /> {saleStats.lost} Sales
        </div>
      </div>

      <div className="flex flex-col items-end">
        <button
          onClick={onEditClick}
          className="text-gray-400 hover:text-clr1 p-1 rounded-full hover:bg-clr1/10 transition"
        >
          <FaEdit size={12} />
        </button>
        <span className="text-xs text-gray-400 mt-1">{client.lead_gen || 'Lead Source'}</span>
      </div>
    </div>
  </div>
)

}

export default ClientHeader