import React, { useEffect, useState } from 'react';
import {
  ScheduleCard,
  ScheduleForm,
  ScheduleDetail,
  EditScheduleForm,
} from '../Components';
import CONFIG from '../Configuration';

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editing, setEditing] = useState(null);
  const [confirmPublic, setConfirmPublic] = useState(null);

  const IP = CONFIG.API_URL;

  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  const email = user?.email;

  const fetchSchedules = () => {
  const endpoint =
    role === 1
      ? `${IP}/schedules/publicSchedules?email=${email}`
      : `${IP}/schedules/scheduler/${email}`;

  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      const today = new Date().toISOString().split('T')[0];

      const sorted = [...data].sort((a, b) => {
        const aDate = new Date(a.schedule_date);
        const bDate = new Date(b.schedule_date);
        const now = new Date(today);

        const aIsPast = aDate < now;
        const bIsPast = bDate < now;

        if (aIsPast && !bIsPast) return 1;
        if (!aIsPast && bIsPast) return -1;

        return aDate - bDate;
      });

      setSchedules(sorted);
    })
    .catch(err => console.error('Fetch error:', err));
};


  const handleCreate = () => {
    fetchSchedules();
    setShowForm(false);
  };

  const handleEdit = (schedule) => {
    setEditing(schedule);
  };

  const handleSave = (updated) => {
    fetchSchedules();
    setEditing(null);
  };

  const handleDelete = (id) => {
    fetch(`${IP}/schedules/deleteSchedule/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => fetchSchedules())
      .catch(err => console.error('Delete error:', err));
  };

  const confirmMakePublic = (schedule) => {
    setConfirmPublic(schedule);
  };

  const handleConfirmPublic = () => {
    if (!confirmPublic) return;
    fetch(`${IP}/schedules/markPublic/${confirmPublic.id}`, {
      method: 'PUT'
    })
      .then(res => res.json())
      .then(() => {
        fetchSchedules();
        setConfirmPublic(null);
      })
      .catch(err => {
        console.error('Visibility update error:', err);
        setConfirmPublic(null);
      });
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="flex bg-white rounded-2xl w-[60vw] h-[84vh] m-2 shadow-xl border border-orange-100 relative p-6 flex-col gap-4 overflow-auto">

      <div className="grid grid-cols-1 gap-4">
        {schedules.map((s) => (
          <ScheduleCard
            key={s.id}
            schedule={s}
            onClick={setSelectedSchedule}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMakePublic={() => confirmMakePublic(s)}
          />
        ))}
      </div>

      <button
      onClick={() => setShowForm(true)}
      className="fixed bottom-10 right-[36vw] bg-clr1 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-xl hover:bg-[#db5f25] z-50"
    >
      +
    </button>

      {showForm && (
        <ScheduleForm
          onClose={() => setShowForm(false)}
          onCreate={handleCreate}
        />
      )}

      {selectedSchedule && (
        <ScheduleDetail
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
        />
      )}

      {editing && (
        <EditScheduleForm
          schedule={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {confirmPublic && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Make Public?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Do you want to make this schedule public?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmPublic(null)}
                className="px-4 py-2.5 rounded-lg border w-[6vw] border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublic}
                className="px-4 py-2.5 rounded-lg w-[6vw] bg-gradient-to-r from-clr1 to-clr2 text-white hover:opacity-90"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedules;