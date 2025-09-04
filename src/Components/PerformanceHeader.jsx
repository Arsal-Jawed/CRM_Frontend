import React from 'react';
import { FiSearch, FiAward, FiUser, FiTrendingUp } from 'react-icons/fi';

function PerformanceHeader({ 
  search, 
  setSearch, 
  activeTab, 
  setActiveTab, 
  indexRange, 
  setIndexRange, 
  role 
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FiAward className="text-clr1 text-lg" /> Performance
        </h1>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto items-center">
          <div className="relative flex-1 min-w-[150px]">
            <FiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-clr1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('LeadGen')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'LeadGen' 
                ? 'bg-gradient-to-r from-clr1 to-clr2 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FiUser /> Lead Gens
            </button>
            {role !== 6 && (
              <button
                onClick={() => setActiveTab('Sales')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'Sales' 
                    ? 'bg-gradient-to-r from-clr2 to-clr1 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiTrendingUp /> Sales Closures
              </button>
            )}
          </div>

          <select
            className="text-[0.6vw] px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-clr1"
            value={indexRange.join(',')}
            onChange={(e) => setIndexRange(e.target.value.split(',').map(Number))}
          >
            <option value="0,10">All Scores</option>
            <option value="8,10">Top (8-10)</option>
            <option value="5,7.99">Average</option>
            <option value="0,4.99">Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default PerformanceHeader;