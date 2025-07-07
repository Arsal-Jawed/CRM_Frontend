import { useState } from 'react';
import MessageForm from './MessageForm';

function MessageDetails({ message, onBack }) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <>
      <div className="h-full flex flex-col bg-gray-50">
        <div className="bg-clr1 border-b border-gray-200 p-6">
          <div className="md:hidden flex items-center mb-4">
            <button 
              onClick={onBack}
              className="mr-3 p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white mb-3">{message.subject}</h1>
              <div className="flex items-center mb-2">
                <span className="inline-block w-16 text-sm font-medium text-white">From:</span>
                <span className="text-sm font-medium text-white">{message.senderName + ' (' + message.senderRole + ')'}</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-16 text-sm font-medium text-white">Date:</span>
                <span className="text-sm text-white">
                  {new Date(message.date).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${message.seen ? 'bg-green-100 text-green-800' : 'bg-clr1 text-white'}`}>
                {message.seen ? 'Seen' : 'New'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto no-scrollbar bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjYiPgo8cmVjdCB3aWR0aD0iNiIgaGVpZ2h0PSI2IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMNiA2IiBzdHJva2U9IiNlZGVkZWQiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8cGF0aCBkPSJNNiAwTDAgNiIgc3Ryb2tlPSIjZWRlZGVkIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="prose prose-sm sm:prose max-w-none text-gray-700 whitespace-pre-line">
              {message.message}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <p className="text-gray-600">Best regards,</p>
              <p className="font-medium text-gray-800">{message.senderName + ' (' + message.senderRole + ')'}</p>
            </div>
          </div>
        </div>

        <div className="sticky flex items-end justify-end bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={() => setShowReplyForm(true)}
            className="w-full md:w-auto px-6 py-3 rounded-md text-sm font-medium text-white bg-clr1 hover:bg-clr1/90 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-clr1/50 focus:ring-offset-2 flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v1a1 1 0 11-2 0v-1a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Reply</span>
          </button>
        </div>
      </div>

      {showReplyForm && (
        <MessageForm
          onClose={() => setShowReplyForm(false)}
          prefill={{
            receiver: message.sender,
            subject: `Re: ${message.subject}`
          }}
        />
      )}
    </>
  );
}

export default MessageDetails;