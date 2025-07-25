import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupportChat() {
  const [employee, setEmployee] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [conversations, setConversations] = useState({});
  const navigate = useNavigate();

  const loadConversations = () => {
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const filtered = allUsers.filter((u) => u.role === 'user');
    setUsers(filtered);

    const allMessages = JSON.parse(localStorage.getItem('supportMessages')) || [];
    const convos = {};
    filtered.forEach((u) => {
      convos[u.email] = allMessages.filter(
        (msg) => msg.from === u.email || msg.to === u.email
      );
    });
    setConversations(convos);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'employee' || user.category?.toLowerCase() !== 'sales support') {
      navigate('/unauthorized');
      return;
    }
    setEmployee(user);
    loadConversations();

    const interval = setInterval(loadConversations, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, [navigate]);

  const handleSend = (toEmail) => {
    const msgText = messages[toEmail]?.trim();
    if (!msgText) return;

    const newMessage = {
      id: Date.now(),
      from: employee.email,
      to: toEmail,
      role: 'support',
      message: msgText,
      sentAt: new Date().toISOString(),
      read: false,
    };

    const existing = JSON.parse(localStorage.getItem('supportMessages')) || [];
    const updated = [...existing, newMessage];
    localStorage.setItem('supportMessages', JSON.stringify(updated));

    setConversations((prev) => ({
      ...prev,
      [toEmail]: [...(prev[toEmail] || []), newMessage],
    }));
    setMessages({ ...messages, [toEmail]: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white px-6 py-12 flex flex-col items-center font-sans">
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-sm border border-white/10 px-8 py-10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-pink-400 mb-6 text-center">
          💬 Sales Support Panel
        </h1>

        {employee ? (
          <>
            <p className="text-white/90 mb-1 text-center">
              Welcome, <span className="font-semibold text-pink-300">{employee.username}</span>
            </p>
            <p className="text-sm text-gray-400 mb-8 text-center">
              Role: <span className="font-medium text-white">{employee.role}</span> | Category:{' '}
              <span className="font-medium text-emerald-300">{employee.category}</span>
            </p>

            {users.length === 0 ? (
              <p className="text-gray-400 text-center">No registered users found.</p>
            ) : (
              users.map((user) => (
                <div
                  key={user.email}
                  className="mb-8 bg-white/10 border border-white/20 p-5 rounded-lg shadow-inner"
                >
                  <h2 className="text-lg font-semibold text-cyan-300 mb-4">
                    👤 {user.username} ({user.email})
                  </h2>

                  {/* Conversation */}
                  <div className="max-h-48 overflow-y-auto mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    {(conversations[user.email] || []).length === 0 ? (
                      <p className="text-gray-400 text-center text-sm">
                        No conversation yet with this user.
                      </p>
                    ) : (
                      conversations[user.email].map((msg) => (
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

                  {/* Reply Input */}
                  <textarea
                    value={messages[user.email] || ''}
                    onChange={(e) => setMessages({ ...messages, [user.email]: e.target.value })}
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 text-white p-3 rounded mb-3 placeholder-gray-400"
                  ></textarea>

                  <button
                    onClick={() => handleSend(user.email)}
                    className="bg-pink-600 hover:bg-pink-700 px-4 py-2 text-white rounded-full font-semibold shadow"
                  >
                    Send Reply
                  </button>
                </div>
              ))
            )}

            <button
              onClick={() => navigate('/employee/dashboard')}
              className="mt-8 px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-full transition-all"
            >
              ← Back to Dashboard
            </button>
          </>
        ) : (
          <p className="text-yellow-300 mt-4 text-center">Loading employee info...</p>
        )}
      </div>
    </div>
  );
}
