import React from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const ChatWidget = ({ 
  chatOpen, 
  setChatOpen, 
  chatMessages, 
  setChatMessages, 
  newMessage, 
  setNewMessage 
}) => {
  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { type: 'user', message: newMessage }]);
      setNewMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          type: 'bot', 
          message: 'धन्यवाद आपके सवाल के लिए! हमारी team जल्द ही आपसे contact करेगी।' 
        }]);
      }, 1000);
    }
  };

  return (
    <>
      {/* Chat Widget */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-white rounded-xl shadow-2xl w-80 h-96 flex flex-col border border-gray-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <span className="font-semibold">Help Assistant</span>
            </div>
            <button 
              onClick={() => setChatOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-white text-gray-800 shadow-sm border'
                } flex items-start gap-2`}>
                  {msg.type === 'bot' && (
                    <Bot size={14} className="text-indigo-500 mt-1 flex-shrink-0" />
                  )}
                  <span className="text-sm">{msg.message}</span>
                  {msg.type === 'user' && (
                    <User size={14} className="text-white/80 mt-1 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
              <button
                onClick={sendMessage}
                className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Toggle Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
      >
        <MessageCircle size={24} />
      </button>
    </>
  );
};

export default ChatWidget;