import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import './App.css';

export default function SillyTakesOffChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const webhookUrl =
    'https://n8n.srv934844.hstgr.cloud/webhook/silly';

  // Starter message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          text: '💬 Hey there! I’m the SillyTakesOff Assistant — here to guide you about travels. ✈️',
        },
      ]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const rawResponse = await res.text();
      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch {
        data = [{ output: rawResponse }];
      }

      let reply;
      if (Array.isArray(data) && data.length > 0) {
        reply = data[0].output || data[0].reply || data[0].response;
      } else {
        reply = data.output || data.reply || data.response || data.text;
      }

      const assistantMessage = {
        role: 'assistant',
        text: reply || '⚠️ No valid response content found.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Webhook fetch error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: '❌ Error: Unable to connect to the server.',
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {/* Chatbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-80 sm:w-96 h-[34rem] bg-white border border-[#096F9D]/40 rounded-[2.5rem] shadow-[0_0_40px_rgba(9,111,157,0.25)] overflow-hidden flex flex-col backdrop-blur-md"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#096F9D] to-[#0AB3D0] text-white font-bold text-lg py-4 px-3 text-center tracking-wide shadow-md">
              ✈️ SillyTakesOff Assistant
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-white to-[#E9F6FB] scrollbar-thin scrollbar-thumb-[#0AB3D0]/60 scrollbar-track-transparent">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`p-3 rounded-2xl max-w-[80%] text-sm sm:text-base shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#096F9D] to-[#0AB3D0] text-white self-end ml-auto rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
            </div>

            {/* Input Box (Floating style) */}
            <div className="p-4 bg-white border-t border-[#0AB3D0]/30 relative">
              <div className="flex items-center bg-gray-50 rounded-full shadow-inner border border-gray-200 focus-within:border-[#0AB3D0] transition">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 px-4 py-2 text-sm sm:text-base"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  className="p-3 bg-gradient-to-r from-[#096F9D] to-[#0AB3D0] hover:opacity-90 text-white rounded-full m-1 shadow-md"
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-white py-2 bg-gradient-to-r from-[#096F9D] to-[#0AB3D0] shadow-inner">
              Powered by <span className="font-semibold text-yellow-200">Uriel</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Assistant Tag */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-gradient-to-r from-[#096F9D] to-[#0AB3D0] text-white px-4 py-2 rounded-2xl font-semibold text-sm shadow-[0_0_15px_rgba(9,111,157,0.5)] border border-[#0AB3D0]/50 mr-2 mb-2 animate-bounce"
        >
          💬 Hi! I’m your SillyTakesOff Assistant.
        </motion.div>
      )}

      {/* Floating Icon Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 rounded-full bg-gradient-to-r from-[#096F9D] to-[#0AB3D0] border-2 border-white shadow-[0_0_25px_rgba(9,111,157,0.4)] transition"
      >
        <img
          src="/logo-4.webp"
          alt="SillyTakesOff"
          className="w-14 h-14 object-contain filter drop-shadow-lg"
        />
      </motion.button>
    </div>
  );
}
