import { FiMail, FiUser, FiClock, FiCheck } from 'react-icons/fi';
import { BsDot } from 'react-icons/bs';

function MessageCard({ message, onClick }) {
  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Today";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer bg-white rounded-lg transition-all duration-300 p-3 mb-3 shadow-sm
      ${message.unread ? 'border-l-4 border-clr1' : 'border-l-4 border-clr1'}
      hover:shadow-md`}
      style={{
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        borderTop: '1px solid #f3f4f6',
        borderRight: '1px solid #f3f4f6',
        borderBottom: '1px solid #f3f4f6'
      }}
    >
      {/* Status text in lower right corner */}
      <div className="absolute bottom-2 right-2 text-[0.7vw]  font-medium">
        {message.unread ? (
          <span className="text-clr1">UNSEEN</span>
        ) : (
          <span className="text-green-500">SEEN</span>
        )}
      </div>

      <div className="flex justify-between items-start gap-2">
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-1.5 rounded-lg ${message.unread ? 'bg-clr1 text-white' : 'bg-clr1/10 text-clr1'}`}>
              {message.unread ? (
                <FiMail className="text-sm" />
              ) : (
                <FiMail className="text-sm" />
              )}
            </div>
            <h3 className={`text-sm font-semibold ${message.unread ? 'text-clr1' : 'text-gray-600'} truncate`}>
              {message.subject}
            </h3>
          </div>
          
          <div className="flex items-center text-xs mb-1 ml-8">
            <div className={`flex items-center ${message.unread ? 'text-clr1' : 'text-gray-500'}`}>
              <FiUser className="mr-1" />
              <span className="truncate">{message.senderName+' ('+message.senderRole+')'}</span>
            </div>
            <BsDot className={`mx-1 ${message.unread ? 'text-clr1' : 'text-gray-400'}`} />
            <div className="flex items-center text-gray-500">
              <FiClock className="mr-1" />
              <span>{formatTime(message.date)}</span>
            </div>
          </div>
          
          <div className="ml-8">
            <p className={`text-xs ${message.unread ? 'text-gray-700' : 'text-gray-500'} line-clamp-2 leading-relaxed`}>
              {message.message}
            </p>
          </div>
        </div>
        
        {/* Date Badge */}
        <div className={`text-xs px-2 py-1 rounded-full whitespace-nowrap 
          ${message.unread ? 'bg-clr1/10 text-clr1' : 'bg-clr1/5 text-gray-500'}`}>
          {formatDate(message.date)}
        </div>
      </div>
    </div>
  );
}

export default MessageCard;