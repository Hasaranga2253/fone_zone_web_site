import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPaperPlane, FaUser, FaHeadset, FaClock } from 'react-icons/fa';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function ContactSupport() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef(null);

  // Load conversation
  const loadConversation = () => {
    const allMessages = JSON.parse(localStorage.getItem('supportMessages')) || [];
    const thread = allMessages
      .filter(msg => msg.from === currentUser?.email || msg.to === currentUser?.email)
      .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

    const updated = allMessages.map(msg =>
      msg.to === currentUser?.email && msg.role === 'support' && !msg.read
        ? { ...msg, read: true }
        : msg
    );
    localStorage.setItem('supportMessages', JSON.stringify(updated));

    setConversation(thread);
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'user') {
      toast.info('Only registered users can contact support.');
      navigate('/home');
      return;
    }
    loadConversation();
    const interval = setInterval(loadConversation, 5000);
    return () => clearInterval(interval);
  }, [currentUser, navigate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('Please type a message first.');
      return;
    }
    setIsSending(true);
    const newMessage = {
      id: Date.now(),
      from: currentUser.email,
      to: 'support',
      role: 'user',
      message,
      sentAt: new Date().toISOString(),
      read: false,
    };
    const existing = JSON.parse(localStorage.getItem('supportMessages')) || [];
    const updated = [...existing, newMessage];
    localStorage.setItem('supportMessages', JSON.stringify(updated));

    setTimeout(() => {
      setConversation([...conversation, newMessage]);
      setMessage('');
      setIsSending(false);
      toast.success('Message sent!');
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section (Full Width) */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-center py-16 border-b border-gray-700 w-full">
        <h1 className="text-4xl font-extrabold gradient-text mb-4 flex items-center justify-center">
          Contact Support
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Get in touch with our support team for assistance with your purchases, repairs, or any other inquiries.
        </p>
      </section>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Chat Box */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700 bg-gray-900/30">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-full">
                <FaHeadset className="text-lg" />
              </div>
              <div>
                <h2 className="font-bold">Sales Support Team</h2>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <FaClock className="text-yellow-400" />
                  <span>Typically replies within 24 hours</span>
                </p>
              </div>
            </div>
          </div>

          {/* Chat History */}
          <div
            ref={chatContainerRef}
            className="h-[400px] overflow-y-auto p-4 bg-gradient-to-b from-gray-900/30 to-gray-800/30"
          >
            {conversation.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-gray-700/50 p-6 rounded-full mb-6">
                  <FaHeadset className="text-4xl text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">No messages yet</h3>
                <p className="text-gray-400 max-w-md">
                  Start the conversation with our support team. We're here to help with any questions or issues.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversation.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 rounded-br-none'
                          : 'bg-gray-700 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1 rounded-full ${msg.role === 'user' ? 'bg-blue-700' : 'bg-gray-600'}`}>
                          {msg.role === 'user' ? <FaUser className="text-xs" /> : <FaHeadset className="text-xs" />}
                        </div>
                        <span className="text-xs font-medium">
                          {msg.role === 'user' ? 'You' : 'Support Agent'}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-white">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700 bg-gray-900/30">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={2}
                placeholder="Type your message..."
                className="w-full bg-gray-700/50 border border-gray-600 text-white p-4 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || !message.trim()}
                className={`absolute right-3 bottom-3 p-3 rounded-full ${
                  isSending || !message.trim()
                    ? 'bg-gray-600 text-gray-400'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500'
                } transition-all`}
              >
                <FaPaperPlane className={isSending ? 'animate-pulse' : ''} />
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-400 flex items-center">
              <span className="inline-flex items-center gap-1 bg-gray-700/50 px-2 py-1 rounded">
                <FaClock className="text-yellow-400" />
                Support hours: Mon-Fri, 9AM-5PM
              </span>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="font-bold text-blue-400 flex items-center gap-2">
              <FaHeadset className="text-blue-400" />
              Contact Options
            </h3>
            <p className="text-sm text-gray-400 mt-2">
              Phone: +1 (800) 123-4567<br />
              Email: support@example.com
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="font-bold text-blue-400">Response Time</h3>
            <p className="text-sm text-gray-400 mt-2">
              Our team typically responds within 24 hours during business days. For urgent matters, please call.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="font-bold text-blue-400">Working Hours</h3>
            <p className="text-sm text-gray-400 mt-2">
              Monday-Friday: 9AM-5PM<br />
              Saturday: 10AM-2PM<br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
