import { useEffect, useState, useRef } from 'react';
import Remarks from './Remarks';
import CONFIG from '../Configuration';

function RemarksContainer() {
  const email = JSON.parse(localStorage.getItem('user')).email;
  const [remarks, setRemarks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const IP = CONFIG.API_URL;
  const remarkRefs = useRef([]);

  useEffect(() => {
    const fetchRemarks = async () => {
      try {
        const res = await fetch(`${IP}/remarks/leadGen/${email}`);
        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRemarks(sorted);
        setActiveIndex(0);
      } catch (err) {
        console.error('Failed to fetch remarks', err);
      }
    };

    fetchRemarks();
  }, [email]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        setActiveIndex((prev) => Math.min(prev + 1, remarks.length - 1));
      } else if (e.key === 'ArrowUp') {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [remarks.length]);

  useEffect(() => {
    if (remarkRefs.current[activeIndex]) {
      remarkRefs.current[activeIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex]);

  return (
    <div className="w-96 h-[80vh] bg-white rounded-xl shadow-md p-6 overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Remarks</h2>
      <div className="space-y-4 h-full">
        {remarks.map((remark, index) => (
          <div
            key={remark.remarkId}
            ref={(el) => (remarkRefs.current[index] = el)}
            className={`transition-all duration-200 rounded-xl ${
              index === activeIndex ? 'bg-blue-50 border-l-4 border-blue-500 scale-100' : 'opacity-60 scale-95'
            }`}
          >
            <Remarks
              remark={{
                text: remark.remark,
                date: new Date(remark.date).toLocaleDateString(),
                closureName: remark.closureName
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RemarksContainer;