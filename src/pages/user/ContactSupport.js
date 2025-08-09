// src/pages/user/ContactSupport.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPaperPlane, FaUser, FaHeadset, FaClock } from 'react-icons/fa';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { motion } from 'framer-motion';

const API_BASE =
  (process.env.REACT_APP_API_BASE || 'http://localhost/Fonezone/chat').replace(/\/+$/, '');
const CATEGORY = 'sales support'; // keep as-is to match your backend

export default function ContactSupport() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef(null);
  const pollRef = useRef(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

  // --- Helpers ---
  const mapApiToUi = (apiMsgs) =>
    apiMsgs.map((m) => ({
      id: m.id,
      // Backend: sender_role = 'user' | 'employee'
      // UI expects: 'user' | 'support'
      role: m.sender_role === 'user' ? 'user' : 'support',
      message: m.message,
      sentAt: m.created_at ? new Date(m.created_at + 'Z').toISOString() : new Date().toISOString(),
    }));

  const fetchConversation = async (signal) => {
    if (!currentUser?.email) return;
    try {
      const url = `${API_BASE}/get_conversation.php?user_email=${encodeURIComponent(
        currentUser.email
      )}&category=${encodeURIComponent(CATEGORY)}&viewer_role=user`;
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status !== 'ok') throw new Error(data.error || 'Failed to load conversation');
      setConversation(mapApiToUi(data.messages || []));
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        toast.error('Failed to load conversation.');
      }
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'user') {
      toast.info('Only registered users can contact support.');
      navigate('/home');
      return;
    }
    const controller = new AbortController();
    fetchConversation(controller.signal);

    // poll every 5s
    pollRef.current = setInterval(() => {
      fetchConversation(new AbortController().signal);
    }, 5000);

    return () => {
      controller.abort();
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.email]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  // --- Actions ---
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please type a message first.');
      return;
    }
    if (!currentUser?.email) {
      toast.error('Missing user email.');
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch(`${API_BASE}/send_message.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: currentUser.email,
          message: message.trim(),
          category: CATEGORY,
        }),
      });
      const data = await res.json();
      if (data.status !== 'ok') throw new Error(data.error || 'Send failed');

      setMessage('');
      // refresh conversation immediately after sending
      fetchConversation(new AbortController().signal);
      toast.success('Message sent!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --- UI (unchanged) ---
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <Navbar />

      {/* Full-width Container */}
      <div className="w-full px-4 sm:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <motion.section
          className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-center py-16 border-b border-gray-700 rounded-none"
          variants={fadeIn}
        >
          <motion.h1 variants={fadeIn} className="text-5xl font-bold mb-4">
            Contact Support
          </motion.h1>
          <motion.p variants={fadeIn} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get in touch with our support team for assistance with your purchases, repairs, or any other inquiries.
          </motion.p>
        </motion.section>

        {/* Chat Box */}
        <motion.div
          variants={fadeIn}
          className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden shadow-xl"
        >
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

          {/* Conversation */}
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

          {/* Input */}
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
        </motion.div>

        {/* Info Section */}
        <motion.div variants={stagger} className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div variants={fadeIn} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="font-bold text-blue-400 flex items-center gap-2">
              <FaHeadset className="text-blue-400" />
              Contact Options
            </h3>
            <p className="text-sm text-gray-400 mt-2">
              Phone: +1 (800) 123-4567<br />
              Email: support@example.com
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="font-bold text-blue-400">Response Time</h3>
            <p className="text-sm text-gray-400 mt-2">
              Our team typically responds within 24 hours during business days. For urgent matters, please call.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="font-bold text-blue-400">Working Hours</h3>
            <p className="text-sm text-gray-400 mt-2">
              Monday-Friday: 9AM-5PM<br />
              Saturday: 10AM-2PM<br />
              Sunday: Closed
            </p>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </motion.div>
  );
}
