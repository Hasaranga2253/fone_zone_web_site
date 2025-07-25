import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ContactSupport() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);

  // Load and update messages
  const loadConversation = () => {
    const allMessages = JSON.parse(localStorage.getItem('supportMessages')) || [];
    const thread = allMessages.filter(
      (msg) => msg.from === currentUser?.email || msg.to === currentUser?.email
    );

    // Mark any support replies as read for this user
    const updated = allMessages.map((msg) =>
      msg.to === currentUser?.email && msg.role === 'support'
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

    const interval = setInterval(loadConversation, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, [currentUser, navigate]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('Please type a message first.');
      return;
    }

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

    setConversation([...conversation, newMessage]);
    setMessage('');
    toast.success('Message sent!');
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-blue-950 ">
      {/* Background fallback image */}
      <div
       className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: "url('/images/fallback.jpg')" }}
      ></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-blue-900 opacity-80 -z-10"></div>

      {/* Decorative glowing elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl animate-pulse -z-10"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-1000 -z-10"></div>

      {/* Main card */}
      <div className="glass-card-gradient max-w-2xl w-full p-8 rounded-xl shadow-lg z-10">
        <h1 className="text-cyan-400 text-center text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 gradient-text fade-in">
          Contact Support
        </h1>

        {/* Chat History */}
        <div className="max-h-64 overflow-y-auto mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          {conversation.length === 0 ? (
            <p className="text-gray-400 text-center">
              No messages yet. Start the conversation!
            </p>
          ) : (
            conversation.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-cyan-800 text-left'
                    : 'bg-pink-800 text-right'
                }`}
              >
                <p className="text-sm text-gray-300">
                  {new Date(msg.sentAt).toLocaleString()}
                </p>
                <p className="text-white mt-1">{msg.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Type your message for our sales support team..."
          className="w-full bg-white/10 border border-white/20 text-white p-4 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
        ></textarea>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-bold hover:from-pink-400 hover:to-rose-400 transition shadow-md"
          >
            Send Message
          </button>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition shadow-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
