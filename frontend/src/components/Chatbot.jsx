import { useState } from 'react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hi! I'm Vishal's AI Assistant. Ask me anything about his skills, projects, or background!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://vishal-portfolio-j3gb.onrender.com'; // Live backend URL

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Error connecting to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center justify-center border border-blue-400/30"
        >
          💬 AI Assistant
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-gray-900 border border-gray-700 w-80 sm:w-96 h-[450px] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <h3 className="font-bold text-gray-100 text-sm">Vishal's AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white font-bold text-lg">✕</button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div key={index} className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white self-end rounded-br-none' : 'bg-gray-800 text-gray-200 self-start rounded-bl-none border border-gray-700'}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="bg-gray-800 text-gray-400 p-3 rounded-xl text-sm self-start animate-pulse">AI is typing...</div>}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask about my projects..." 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-xl text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;