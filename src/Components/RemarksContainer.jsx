import { useEffect, useState, useRef } from 'react'
import { CheckCircle2, Clock4, XCircle, User, Building2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import CONFIG from '../Configuration'

function QACard({ remark, active, innerRef }) {
  const [expanded, setExpanded] = useState(false)

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase()
    if (s === 'approved' || s === 'in process')
      return { text: 'Approved', color: 'text-green-600', icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> }
    if (s === 'pending')
      return { text: 'Pending', color: 'text-orange-500', icon: <Clock4 className="w-3.5 h-3.5 text-orange-500" /> }
    if (s === 'rejected')
      return { text: 'Rejected', color: 'text-red-600', icon: <XCircle className="w-3.5 h-3.5 text-red-600" /> }
    return { text: 'Approved', color: 'text-green-600', icon: <Clock4 className="w-3.5 h-3.5 text-gray-500" /> }
  }

  const { text, color, icon } = getStatusStyle(remark.status)
  const qaText = remark.QARemarks || 'No QA remarks available.'
  const shortText = qaText.split(' ').slice(0, 10).join(' ') + (qaText.split(' ').length > 10 ? '...' : '')

  return (
    <div
      ref={innerRef}
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
        active ? 'ring-1 ring-[var(--clr1)] scale-[1.01]' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="text-gray-800 font-medium text-sm flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[var(--clr1)]" />
            {remark.person_name || 'N/A'}
          </h3>
          <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
            <Building2 className="w-3.5 h-3.5 text-[var(--clr1)]" />
            {remark.business_name || 'N/A'}
          </p>
          <div className="flex items-start justify-between mt-1">
            <p className="text-gray-500 italic text-[11px] flex-1">
              {expanded ? qaText : shortText}
            </p>
            {qaText.split(' ').length > 10 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-2 text-[var(--clr1)] hover:opacity-80 transition"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className={`text-xs font-semibold flex items-center justify-end gap-1 ${color}`}>
            {icon}
            {text}
          </p>
          <p className="text-gray-400 text-[10px] mt-1">
            {remark.createdAt?.slice(0, 10) || remark.date?.slice(0, 10) || '—'}
          </p>
        </div>
      </div>
    </div>
  )
}

function RemarksContainer() {
  const user = JSON.parse(localStorage.getItem('user'))
  const email = user?.email
  const [remarks, setRemarks] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const IP = CONFIG.API_URL
  const remarkRefs = useRef([])

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`${IP}/leads/email/${email}`)
        const data = await res.json()
        setRemarks(data)
      } catch (err) {
        console.error('Error fetching leads:', err)
      }
    }
    fetchLeads()
  }, [IP, email])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') setActiveIndex((prev) => Math.min(prev + 1, remarks.length - 1))
      else if (e.key === 'ArrowUp') setActiveIndex((prev) => Math.max(prev - 1, 0))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [remarks.length])

  useEffect(() => {
    if (remarkRefs.current[activeIndex]) {
      remarkRefs.current[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeIndex])

  const points = remarks.filter(l => l.status?.toLowerCase() === 'in process').length

  return (
    <div className="w-80 h-[80vh] bg-white rounded-xl shadow-md p-5 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center justify-between">
        Performance
        <span className="text-gray-400 text-sm">{points} points</span>
      </h2>
      <div className="space-y-3">
        {remarks.slice().reverse().map((r, i) => (
          <QACard key={i} remark={r} active={activeIndex === i} innerRef={(el) => (remarkRefs.current[i] = el)} />
        ))}
      </div>
    </div>
  )
}

export default RemarksContainer