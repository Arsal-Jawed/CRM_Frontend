import React, { useEffect, useState } from 'react';
import CONFIG from '../Configuration';
import {
  FaCheck,
  FaTimes,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaHourglassHalf
} from 'react-icons/fa';
import moment from 'moment';

function Attendance() {
  const [data, setData] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [loading, setLoading] = useState(true);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showHalfDayModal, setShowHalfDayModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [remarks, setRemarks] = useState('');
  const [halfDayDate, setHalfDayDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedRemarks, setSelectedRemarks] = useState('');

  const fetchAttendance = async (monthStr) => {
    setLoading(true);
    const res = await fetch(`${CONFIG.API_URL}/attendance/monthly?month=${monthStr}`);
    const json = await res.json();
    setData(json);
    const totalDays = moment(monthStr, 'YYYY-MM').daysInMonth();
    setDaysInMonth(Array.from({ length: totalDays }, (_, i) => i + 1));
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance(currentMonth.format('YYYY-MM'));
  }, [currentMonth]);

  const prevMonth = () => setCurrentMonth(prev => moment(prev).subtract(1, 'month'));
  const nextMonth = () => setCurrentMonth(prev => moment(prev).add(1, 'month'));

  const resetForm = () => {
    setSelectedEmployee('');
    setLeaveFrom('');
    setLeaveTo('');
    setRemarks('');
    setHalfDayDate(moment().format('YYYY-MM-DD'));
  };

  const handleGrantLeave = async () => {
    if (!selectedEmployee || !leaveFrom || !leaveTo || leaveTo < leaveFrom) {
      alert('Please select valid employee, dates, and remarks.');
      return;
    }
    await fetch(`${CONFIG.API_URL}/attendance/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: selectedEmployee,
        fromDate: leaveFrom,
        toDate: leaveTo,
        remarks
      })
    });
    setShowLeaveModal(false);
    resetForm();
    fetchAttendance(currentMonth.format('YYYY-MM'));
  };

  const handleMarkHalfDay = async () => {
    if (!selectedEmployee || !halfDayDate) {
      alert('Please select an employee and date.');
      return;
    }
    await fetch(`${CONFIG.API_URL}/attendance/halfday`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: selectedEmployee,
        date: halfDayDate,
        remarks
      })
    });
    setShowHalfDayModal(false);
    resetForm();
    fetchAttendance(currentMonth.format('YYYY-MM'));
  };

  const getStatusCell = (status, checkInTime, dayRemarks) => {
    const base = "flex items-center justify-center h-5 w-5 rounded mx-auto";

    let tooltipContent = '';
    if (status === 'P' || status === 'L') {
      tooltipContent = checkInTime
        ? `Check-in: ${moment(checkInTime, 'HH:mm:ss').format('h:mm A')}`
        : 'No check-in time recorded';
    } else if (status === 'H') {
      tooltipContent = 'Marked as Half Day';
    } else if (status === 'A') {
      tooltipContent = 'Leave';
    } else {
      tooltipContent = 'No attendance recorded';
    }

    return (
      <div
        className="group relative cursor-pointer"
        onClick={() => {
          if ((status === 'H' || status === 'A') && dayRemarks) {
            setSelectedRemarks(dayRemarks);
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
          }
        }}
      >
        <div className={`${base} ${
          status === 'P' ? 'bg-clr1/10 text-clr1' :
          status === 'A' ? 'bg-clr2/10 text-clr2' :
          status === 'L' ? 'bg-amber-100 text-amber-600' :
          status === 'H' ? 'bg-purple-100 text-yellow-600' : ''
        }`}>
          {status === 'P' && <FaCheck className="text-xs" />}
          {status === 'A' && <FaTimes className="text-xs" />}
          {status === 'L' && <FaClock className="text-xs" />}
          {status === 'H' && <FaHourglassHalf className="text-xs" />}
          {!['P','A','L','H'].includes(status) && <span className="text-gray-400">-</span>}
        </div>
        <div className="absolute z-20 hidden group-hover:block bg-white text-xs p-1.5 rounded shadow-lg border border-gray-200 whitespace-nowrap -translate-x-1/2 left-1/2 mt-1 text-left space-y-1 min-w-[10rem]">
          {dayRemarks && <div><strong>Remarks:</strong> {dayRemarks}</div>}
          <div>{tooltipContent}</div>
        </div>
      </div>
    );
  };

  const halfDayDay = moment(halfDayDate).date();
  const filteredHalfDayEmployees = data.filter(user => {
    const status = user.attendance?.[halfDayDay];
    return status !== 'P' && status !== 'L';
  });

  return (
    <div className="p-4 bg-gray-50">
      {selectedRemarks && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded border border-yellow-300">
          <strong>Remarks:</strong> {selectedRemarks}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">Monthly Attendance</h2>
          <div className="flex gap-2">
            <button onClick={() => setShowLeaveModal(true)} className="bg-clr1 hover:bg-clr2 text-white px-3 rounded text-[1vw]">Grant Leave</button>
            <button onClick={() => setShowHalfDayModal(true)} className="bg-gray-200 hover:bg-gray-400 text-gray-700 px-3 rounded text-[1vw]">Mark Half-Day</button>
            <button onClick={prevMonth} className="p-2 bg-clr1 text-white rounded"><FaChevronLeft /></button>
            <span className="px-2">{currentMonth.format('MMMM YYYY')}</span>
            <button onClick={nextMonth} className="p-2 bg-clr1 text-white rounded"><FaChevronRight /></button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-6 w-6 border-4 border-clr1 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="max-h-[65vh] overflow-hidden hover:overflow-y-auto overflow-x-auto">
            <table className="min-w-max w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left bg-clr1 text-white font-medium">Employee</th>
                  {daysInMonth.map(day => (
                    <th key={day} className="px-1 py-2 text-center bg-clr1 text-white font-medium">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((user, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 font-medium text-gray-700">{user.name}</td>
                    {daysInMonth.map(day => (
                      <td key={day} className="px-1 py-2 text-center">
                        {getStatusCell(user.attendance[day], user.checkInTimes[day], user.remarks?.[day])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200 overflow-hidden">
            <div className="bg-clr1 p-4 text-white text-lg font-semibold">Grant Leave</div>
            <div className="p-5 space-y-4">
              <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="w-full border rounded p-2">
                <option value="">Select employee</option>
                {data.map(user => (
                  <option key={user.email} value={user.email}>{user.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <input type="date" value={leaveFrom} onChange={e => setLeaveFrom(e.target.value)} className="w-full border rounded p-2" />
                <input type="date" value={leaveTo} onChange={e => setLeaveTo(e.target.value)} className="w-full border rounded p-2" />
              </div>
              <textarea placeholder="Remarks" value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full border rounded p-2" />
              <div className="flex justify-end gap-2">
                <button onClick={() => { setShowLeaveModal(false); resetForm(); }} className="border rounded px-3 py-1">Cancel</button>
                <button onClick={handleGrantLeave} className="bg-clr1 text-white rounded px-3 py-1">Grant Leave</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Half-Day Modal */}
      {showHalfDayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200 overflow-hidden">
            <div className="bg-clr1 p-4 text-white text-lg font-semibold">Mark Half-Day</div>
            <div className="p-5 space-y-4">
              <input type="date" value={halfDayDate} onChange={e => setHalfDayDate(e.target.value)} className="w-full border rounded p-2" />
              <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="w-full border rounded p-2">
                <option value="">Select employee</option>
                {filteredHalfDayEmployees.map(user => (
                  <option key={user.email} value={user.email}>{user.name}</option>
                ))}
              </select>
              <textarea placeholder="Remarks" value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full border rounded p-2" />
              <div className="flex justify-end gap-2">
                <button onClick={() => { setShowHalfDayModal(false); resetForm(); }} className="border rounded px-3 py-1">Cancel</button>
                <button onClick={handleMarkHalfDay} className="bg-clr1 text-white rounded px-3 py-1">Mark Half-Day</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;