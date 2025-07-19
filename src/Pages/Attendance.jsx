import React, { useEffect, useState } from 'react';
import CONFIG from '../Configuration';
import { FaCheck, FaTimes, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import moment from 'moment';

function Attendance() {
  const [data, setData] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async (monthStr) => {
    setLoading(true);
    const res = await fetch(`${CONFIG.API_URL}/attendance/monthly?month=${monthStr}`);
    const json = await res.json();
    setData(json);

    const totalDays = moment(monthStr, 'YYYY-MM').daysInMonth();
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    setDaysInMonth(days);
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance(currentMonth.format('YYYY-MM'));
  }, [currentMonth]);

  const prevMonth = () => setCurrentMonth(prev => moment(prev).subtract(1, 'month'));
  const nextMonth = () => setCurrentMonth(prev => moment(prev).add(1, 'month'));

  const getStatusCell = (status) => {
    const base = "flex items-center justify-center h-5 w-5 rounded mx-auto";
    switch (status) {
      case 'P': return <div className={`${base} bg-clr1/10 text-clr1`}><FaCheck className="text-xs" /></div>;
      case 'A': return <div className={`${base} bg-clr2/10 text-clr2`}><FaTimes className="text-xs" /></div>;
      case 'L': return <div className={`${base} bg-amber-100 text-amber-600`}><FaClock className="text-xs" /></div>;
      default: return <span className="text-gray-400">-</span>;
    }
  };

  return (
    <div className="p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center">
            <span className="bg-clr1 text-white p-1.5 rounded mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            Monthly Attendance
          </h2>
          <div className="flex items-center gap-2 text-[0.9vw] font-medium text-gray-700">
            <button
              onClick={prevMonth}
              className="p-[0.45vw] bg-clr1 text-white rounded hover:bg-clr1/90 transition"
            >
              <FaChevronLeft className="w-[0.9vw] h-[0.9vw]" />
            </button>
            <span>{currentMonth.format('MMMM YYYY')}</span>
            <button
              onClick={nextMonth}
              className="p-[0.45vw] bg-clr1 text-white rounded hover:bg-clr1/90 transition"
            >
              <FaChevronRight className="w-[0.9vw] h-[0.9vw]" />
            </button>
          </div>
        </div>

        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin h-6 w-6 border-4 border-clr1 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="max-h-[65vh] overflow-hidden hover:overflow-y-auto overflow-x-auto">
              <table className="min-w-max w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left sticky top-0 min-w-[140px] bg-clr1 text-white font-medium rounded-tl">Employee</th>
                    {daysInMonth.map(day => (
                      <th key={day} className="px-1 py-2 text-center sticky top-0 bg-clr1 text-white font-medium">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((user, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-3 py-2 whitespace-nowrap border-b border-gray-100 font-medium text-gray-700">
                        {user.name}
                      </td>
                      {daysInMonth.map(day => (
                        <td key={day} className="px-1 py-2 text-center border-b border-gray-100">
                          {getStatusCell(user.attendance[day])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-3 gap-4 text-xs">
          <div className="flex items-center"><span className="inline-block w-3 h-3 rounded-full bg-clr1 mr-1"></span>Present</div>
          <div className="flex items-center"><span className="inline-block w-3 h-3 rounded-full bg-clr2 mr-1"></span>Absent</div>
          <div className="flex items-center"><span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-1"></span>Late</div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;