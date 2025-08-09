// src/pages/employee/support.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE =
  (process.env.REACT_APP_API_BASE || 'http://localhost/Fonezone/chat').replace(/\/+$/, '');
const CATEGORY = 'sales support'; // must match backend

export default function SupportChat() {
  const [employee, setEmployee] = useState(null);
  const [users, setUsers] = useState([]);                 // [{ email, username }]
  const [messagesDrafts, setMessagesDrafts] = useState({}); // { [email]: draft }
  const [conversations, setConversations] = useState({}); // { [email]: [msgs] }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pollRef = useRef(null);

  // ---- utils ----
  const guardCheck = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return null;
      const u = JSON.parse(raw);
      return u;
    } catch {
      return null;
    }
  }, []);

  const mapApiMsgToUi = (m) => ({
    id: m.id,
    role: m.sender_role === 'user' ? 'user' : 'support', // UI expects 'support' for employees
    message: m.message,
    sentAt: m.created_at ? new Date(m.created_at + 'Z').toISOString() : new Date().toISOString(),
  });

  const fetchUsers = async (signal) => {
    const url = `${API_BASE}/get_all_chat_users.php?category=${encodeURIComponent(CATEGORY)}`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(data.error || 'Failed to load users');

    // We only have email + last preview from backend; derive a display username
    const list = (data.users || []).map((u) => {
      const email = u.user_email;
      const name = email?.split('@')[0] || 'user';
      return { email, username: name };
    });
    return list;
  };

  const fetchConversation = async (email, signal) => {
    const url = `${API_BASE}/get_conversation.php?user_email=${encodeURIComponent(
      email
    )}&category=${encodeURIComponent(CATEGORY)}&viewer_role=employee`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(data.error || 'Failed to load conversation');
    return (data.messages || []).map(mapApiMsgToUi);
  };

  const refreshAll = async () => {
    try {
      const controller = new AbortController();
      const nextUsers = await fetchUsers(controller.signal);

      // Fetch all conversations in parallel (same as your “show all threads” UI)
      const convEntries = await Promise.all(
        nextUsers.map(async (u) => {
          try {
            const msgs = await fetchConversation(u.email, controller.signal);
            return [u.email, msgs];
          } catch {
            return [u.email, []];
          }
        })
      );
      const convMap = Object.fromEntries(convEntries);

      setUsers(nextUsers);
      setConversations(convMap);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  // ---- effects ----
  useEffect(() => {
    const u = guardCheck;
    if (!u || u.role !== 'employee' || (u.category || '').toLowerCase() !== 'sales support') {
      navigate('/unauthorized');
      return;
    }
    setEmployee(u);
    // initial load
    refreshAll();
    // poll every 5s to mirror your previous behavior
    pollRef.current = setInterval(refreshAll, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // ---- actions ----
  const handleSend = async (toEmail) => {
    const msgText = messagesDrafts[toEmail]?.trim();
    if (!msgText || !employee?.email) return;
    try {
      const res = await fetch(`${API_BASE}/reply_message.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: toEmail,
          employee_email: employee.email,
          message: msgText,
          category: CATEGORY,
        }),
      });
      const data = await res.json();
      if (data.status !== 'ok') throw new Error(data.error || 'Reply failed');

      // optimistic UI update
      const newMessage = {
        id: Date.now(),
        role: 'support',
        message: msgText,
        sentAt: new Date().toISOString(),
      };
      setConversations((prev) => ({
        ...prev,
        [toEmail]: [...(prev[toEmail] || []), newMessage],
      }));
      setMessagesDrafts((prev) => ({ ...prev, [toEmail]: '' }));

      // also refresh this user’s thread from server to get canonical data
      const controller = new AbortController();
      const fresh = await fetchConversation(toEmail, controller.signal);
      setConversations((prev) => ({ ...prev, [toEmail]: fresh }));
    } catch (e) {
      console.error(e);
      // you can add a toast here if you already use react-toastify in this page
      // toast.error('Failed to send reply');
    }
  };

  // ---- UI (unchanged visuals) ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white px-6 py-12 flex flex-col items-center font-sans">
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-sm border border-white/10 px-8 py-10 rounded-xl shadow-lg">
        {/* Top Row: Title + Back Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-cyan-400">
            Sales Support Panel
          </h1>
          <button
            onClick={() => navigate('/employee/dashboard')}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-full shadow-lg transition duration-300"
          >
            ← Back to Dashboard
          </button>
        </div>

        {employee ? (
          <>
            <p className="text-white/90 mb-1 text-center">
              Welcome, <span className="font-semibold text-cyan-400">{employee.username || employee.email}</span>
            </p>
            <p className="text-sm text-gray-400 mb-8 text-center">
              Role: <span className="font-medium text-white">{employee.role}</span> | Category:{' '}
              <span className="font-medium text-emerald-300">{employee.category}</span>
            </p>

            {loading ? (
              <p className="text-gray-400 text-center">Loading…</p>
            ) : users.length === 0 ? (
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
                      (conversations[user.email] || []).map((msg) => (
                        <div
                          key={msg.id}
                          className={`mb-3 p-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-gray-800 text-left'
                              : 'bg-cyan-800 text-right'
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
                    value={messagesDrafts[user.email] || ''}
                    onChange={(e) =>
                      setMessagesDrafts((prev) => ({ ...prev, [user.email]: e.target.value }))
                    }
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 text-white p-3 rounded mb-3 placeholder-gray-400"
                  ></textarea>

                  <button
                    onClick={() => handleSend(user.email)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-full font-semibold shadow"
                  >
                    Send Reply
                  </button>
                </div>
              ))
            )}
          </>
        ) : (
          <p className="text-yellow-300 mt-4 text-center">Loading employee info...</p>
        )}
      </div>
    </div>
  );
}
