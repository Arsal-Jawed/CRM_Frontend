import { useState } from 'react';
import { FaTimes, FaSearch, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import CONFIG from '../Configuration';

function VerifyLeadModal({ onClose }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${CONFIG.API_URL}/leads/check-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      console.log(data)
      setResult(data);
    } catch (err) {
      setResult({ exists: true, error: 'Server error occurred' });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4 relative border border-gray-100">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-clr1 transition-colors"
        >
          <FaTimes className="text-lg" />
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-clr1 flex items-center justify-center gap-2">
            <FaSearch className="text-clr2" />
            Verify Lead
          </h2>
          <p className="text-sm text-gray-500 mt-1">Check if lead already exists in the system</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter Business Email or Client Email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-clr2 focus:border-transparent placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || !input}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all
              ${loading || !input ? 'bg-gray-300 cursor-not-allowed' : 'bg-clr1 hover:bg-clr2 text-white shadow-md hover:shadow-lg'}
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              <>
                <FaSearch />
                Verify Lead
              </>
            )}
          </button>
        </div>

        {result && (
          <div className={`mt-4 p-4 rounded-lg border ${result.exists ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
            <div className={`flex items-start gap-3 ${result.exists ? 'text-red-700' : 'text-green-700'}`}>
              {result.exists ? (
                <FaExclamationTriangle className="text-xl mt-0.5 flex-shrink-0" />
              ) : (
                <FaCheckCircle className="text-xl mt-0.5 flex-shrink-0" />
              )}
              <div>
                {result.exists ? (
                  <>
                    <p className="font-medium">Lead already exists!</p>
                    <p className="text-sm mt-1">
                      Generated by <strong>{result.name}</strong> on <strong>{result.date}</strong>
                    </p>
                    {result.error && <p className="text-xs mt-1 italic">{result.error}</p>}
                  </>
                ) : (
                  <>
                    <p className="font-medium">No existing lead found</p>
                    <p className="text-sm mt-1">You may proceed to create this new lead</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyLeadModal;