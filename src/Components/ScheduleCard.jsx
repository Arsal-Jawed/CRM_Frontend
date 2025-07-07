import React from 'react';
import { FaEdit, FaTrash, FaLock, FaEye, FaCalendarAlt, FaBell } from 'react-icons/fa';
import { format, isToday } from 'date-fns';

function ScheduleCard({ schedule, onClick, onEdit, onDelete, onMakePublic }) {
  const scheduleDate = new Date(schedule.schedule_date);
  const formattedDate = format(scheduleDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(scheduleDate, "h:mm a");
  const isTodayDate = isToday(scheduleDate);

  return (
    <div className="p-4 rounded-lg relative transition-all cursor-pointer shadow-sm hover:shadow-md bg-white border border-gray-100 hover:border-gray-200">

      <div onClick={() => onClick(schedule)} className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[1.2vw] font-semibold text-gray-400 line-clamp-2">
                {schedule.details}
              </h3>
              {schedule.visibility === 'public' ? (
                <FaEye className="text-clr1 text-sm" />
              ) : (
                <FaLock className="text-clr1 text-sm" />
              )}
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-md">
                <FaCalendarAlt className="text-blue-400 text-[0.8vw]" />
                <span className="font-medium text-blue-600">
                  {formattedDate}
                </span>
              </div>
              <div className="bg-gray-50 px-2 py-1 rounded-md">
                <span className="font-medium text-gray-600 text-[0.8vw]">{formattedTime}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {isTodayDate && (
            <div>
              <FaBell
                className="text-orange-400 animate-bounce text-[1.4vw] mt-[1vh]"
                title="Scheduled for Today"
              />
            </div>
          )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(schedule);
              }}
              className="p-1.5 rounded-full bg-white text-gray-500 hover:text-blue-600 hover:bg-blue-50 shadow-sm border border-gray-200 transition-colors"
              title="Edit"
            >
              <FaEdit className="text-sm" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(schedule.id);
              }}
              className="p-1.5 rounded-full bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 shadow-sm border border-gray-200 transition-colors"
              title="Delete"
            >
              <FaTrash className="text-sm" />
            </button>
            {schedule.visibility !== 'public' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMakePublic(schedule.id);
                }}
                className="p-1.5 rounded-full bg-white text-gray-500 hover:text-green-600 hover:bg-green-50 shadow-sm border border-gray-200 transition-colors"
                title="Make Public"
              >
                <FaEye className="text-sm" />
              </button>
            )}
          </div>
        </div>

        {schedule.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{schedule.description}</p>
        )}
      </div>
    </div>
  );
}

export default ScheduleCard;