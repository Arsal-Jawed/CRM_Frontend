import { useEffect, useState } from 'react';
import { MessageCard, MessageDetails, MessageForm } from '../Components';
import CONFIG from '../Configuration';

function MessagePage() {
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const IP = CONFIG.API_URL;
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${IP}/messages/reciever/${user.email}`);
      const data = await res.json();
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMessages(sorted);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSelect = async (msg) => {
    setSelectedMsg(msg);
    if (!msg.seen) {
      await fetch(`${IP}/messages/seen/${msg.messageId}`, { method: 'PUT' });
      setMessages((prev) =>
        prev.map((m) =>
          m.messageId === msg.messageId ? { ...m, seen: true } : m
        )
      );
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const query = searchTerm.toLowerCase();
    return (
      msg.subject.toLowerCase().includes(query) ||
      msg.sender.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
  fetchMessages();
  const intervalId = setInterval(fetchMessages, 10000);
  return () => {
    clearInterval(intervalId);
  };
}, []);

  return (
    <div className="h-[86vh] w-[92vw] bg-white flex overflow-hidden z-20">
      <div className="w-full md:w-2/5 flex flex-col border-r border-gray-200 h-full">
        <div className="p-5 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-clr1/50 focus:border-clr1 transition-all"
            />
            <svg
              className="absolute left-3 top-3.5 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {filteredMessages.map((msg) => (
            <MessageCard
              key={msg.messageId}
              message={{ ...msg, unread: !msg.seen }}
              onClick={() => handleSelect(msg)}
            />
          ))}
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 md:right-auto md:left-[calc(40%-28px)] w-14 h-14 rounded-full bg-clr1 text-white flex items-center justify-center shadow-xl hover:bg-clr1/90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-clr1/50 focus:ring-offset-2 z-10"
          aria-label="New message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="hidden md:flex md:w-3/5 flex-col h-full">
        {selectedMsg ? (
          <MessageDetails message={selectedMsg} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6">
            <svg
              className="h-20 w-20 mb-4 text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <p className="text-xl font-light text-gray-400">Select a message to view details</p>
            <p className="text-sm mt-2 text-gray-300">or compose a new message</p>
          </div>
        )}
      </div>

      {selectedMsg && (
        <div className="md:hidden absolute inset-0 bg-white z-20">
          <MessageDetails message={selectedMsg} onBack={() => setSelectedMsg(null)} />
        </div>
      )}

      {showForm && <MessageForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

export default MessagePage;