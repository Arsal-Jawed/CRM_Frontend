import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import CONFIG from '../Configuration';

// More vibrant and distinct gradient colors
const GRADIENTS = [
  ['#84d96c', '#4CAF50'], // Managers (Vibrant Green)
  ['#66b3ff', '#2196F3'], // Sales Closures (Bright Blue)
  ['#ff9999', '#f44336'], // Lead Gens (Soft Red)
  ['#ffcc99', '#FF9800'], // Operation Agents (Warm Orange)
];

const RADIAN = Math.PI / 180;

// Custom Label: Show percentage, adjusted size for clarity
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // Slightly further out
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  if (percent * 100 < 6) return null; // Only show for larger slices

  return (
    <text x={x} y={y} fill="white" fontSize={13} textAnchor="middle" dominantBaseline="central" fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Enhanced Active Shape: Larger hover effect, with segment name and count in the center
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 12} // Even larger hover effect
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#fff" // White stroke for separation
        strokeWidth={3} // Thicker stroke
      />
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} fontSize={18} fontWeight="bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#333" fontSize={16} fontWeight="normal">
        {`Count: ${value}`}
      </text>
    </g>
  );
};

// Custom Tooltip: More detailed with percentage
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 border border-gray-200 rounded-lg shadow-lg text-sm transition-all duration-200 ease-in-out">
        <p className="font-bold text-gray-800 flex items-center mb-1">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: data.payload.fill }}></span>
            {`${data.name}`}
        </p>
        <p className="text-gray-700">Count: <span className="font-semibold">{data.value}</span></p>
        <p className="text-gray-700">Share: <span className="font-semibold">{(data.percent * 100).toFixed(1)}%</span></p>
      </div>
    );
  }
  return null;
};

function RolePieChart() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    fetch(`${CONFIG.API_URL}/users/getUserStats`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-4 h-[340px] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading User Statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-4 h-[340px] flex items-center justify-center">
        <p className="text-red-500 text-lg font-medium">Failed to load user stats.</p>
      </div>
    );
  }

  const roleCounts = [
    { name: 'Managers', value: stats.managers || 0 },
    { name: 'Closures', value: stats.salesClosures || 0 },
    { name: 'Lead Gens', value: stats.leadGens || 0 },
    { name: 'Operation Agents', value: stats.operations || 0 },
  ].filter(entry => entry.value > 0);

  if (roleCounts.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-4 h-[340px] flex items-center justify-center">
        <p className="text-gray-500 text-lg">No user data available for display.</p>
      </div>
    );
  }

  const totalUsers = roleCounts.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-1 transition-shadow duration-300 hover:shadow-xl">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <defs>
            {GRADIENTS.map((g, i) => (
              <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={g[0]} />
                <stop offset="100%" stopColor={g[1]} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={roleCounts}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80} // Consistent inner radius
            outerRadius={120} // Increased outer radius for a thicker donut
            paddingAngle={3} // Slightly more padding
            labelLine={false}
            label={renderCustomizedLabel}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {roleCounts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#grad${index % GRADIENTS.length})`} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Legend 
            iconType="circle" 
            iconSize={12} 
            wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} 
            layout="horizontal" 
            align="center" 
            verticalAlign="bottom"
          />
           {/* Dynamic central text for total or hovered segment */}
          {activeIndex === null && totalUsers > 0 && (
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-bold text-3xl fill-gray-800">
              {totalUsers}
            </text>
          )}
          {activeIndex === null && totalUsers > 0 && (
            <text x="50%" y="50%" dy={30} textAnchor="middle" dominantBaseline="middle" className="font-semibold text-lg fill-gray-500">
              Total Users
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RolePieChart;