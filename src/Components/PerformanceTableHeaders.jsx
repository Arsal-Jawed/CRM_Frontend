import React from 'react';
import {
  FiCalendar, FiTrendingUp, FiThumbsUp, FiThumbsDown, FiClock,
  FiCheckCircle, FiStar, FiZap, FiXCircle, FiBarChart2
} from 'react-icons/fi';
import {
  FaStamp, FaMoneyBillWave, FaFileAlt, FaCubes, FaBan, FaUndoAlt
} from 'react-icons/fa';

function PerformanceTableHeaders({ activeTab }) {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
          Employee
        </th>
        <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
          <span className={`px-1.5 py-0.5 text-xs rounded-full ${activeTab === 'LeadGen' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
            Role
          </span>
        </th>
        <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
          <div className="flex flex-col items-start">
            <FiCalendar className="text-lg mb-1" />
            <span className="text-[0.6vw]">Joining</span>
          </div>
        </th>
        
        {activeTab === 'LeadGen' ? (
          <>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FiTrendingUp className="text-lg mb-1" />
                <span className="text-[0.6vw]">Leads</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FiThumbsUp className="text-lg text-green-600 mb-1" />
                <span className="text-[0.6vw]">Won</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FiThumbsDown className="text-lg text-red-600 mb-1" />
                <span className="text-[0.6vw]">Lost</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FiClock className="text-lg text-yellow-600 mb-1" />
                <span className="text-[0.6vw]">In-Process</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FiCheckCircle className="text-lg text-blue-600 mb-1" />
                <span className="text-[0.6vw]">Win Score</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FiStar className="text-lg text-yellow-500 mb-1" />
                <span className="text-[0.6vw]">Rating Score</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FiZap className="text-lg text-orange-500 mb-1" />
                <span className="text-[0.6vw]">Lead Efficiency</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FiXCircle className="text-lg text-red-600 mb-1" />
                <span className="text-[0.6vw]">Loss Penalty</span>
              </div>
            </th>
          </>
        ) : (
          <>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FiCheckCircle className="text-lg text-green-600 mb-1" />
                <span className="text-[0.6vw]">Won Leads</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FaStamp className="text-lg text-blue-600 mb-1" />
                <span className="text-[0.6vw]">Approved Sales</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FaMoneyBillWave className="text-lg text-green-700 mb-1" />
                <span className="text-[0.6vw]">Total Lease</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FaFileAlt className="text-lg mb-1" />
                <span className="text-[0.6vw]">Documents</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FaCubes className="text-lg mb-1" />
                <span className="text-[0.6vw]">Equipments</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FiTrendingUp className="text-lg mb-1" />
                <span className="text-[0.6vw]">Total Leads</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FiThumbsDown className="text-lg text-red-600 mb-1" />
                <span className="text-[0.6vw]">Lost Leads</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FaBan className="text-lg text-red-500 mb-1" />
                <span className="text-[0.6vw]">Rejected Sales</span>
              </div>
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <FaUndoAlt className="text-lg text-orange-600 mb-1" />
                <span className="text-[0.6vw]">Buybacks</span>
              </div>
            </th>
          </>
        )}
        <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
          <div className="flex flex-col items-start">
            <FiBarChart2 className="text-lg mb-1" />
            <span className="text-[0.6vw]">Performance</span>
          </div>
        </th>
      </tr>
    </thead>
  );
}

export default PerformanceTableHeaders;