// src/pages/admin/AdminDashboard.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../../context/AuthContext';

const API_ROOT = 'http://localhost/Fonezone';
const ADMIN_API = `${API_ROOT}/admin-dashboard`;

const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
const formatDateLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtRs = (n) => `Rs. ${Number(n || 0).toLocaleString('en-US')}`;
const range = (n) => Array.from({ length: n }, (_, i) => i);

const monthBounds = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = dateObj.getMonth();
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0);
  return {
    start,
    end,
    startKey: `${y}-${pad(m + 1)}-01`,
    endKey: `${y}-${pad(m + 1)}-${pad(end.getDate())}`,
  };
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [overview, setOverview] = useState({ totalProducts: 0, totalUsers: 0 });
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [salesCache, setSalesCache] = useState({});
  const [loadingSales, setLoadingSales] = useState(false);
  const [salesError, setSalesError] = useState('');

  const loadingMonthRef = useRef({});

  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { credentials: 'include', ...options });
    let body = null;
    try { body = await res.json(); } catch {}
    if (res.status === 401 || res.status === 403) {
      navigate('/unauthorized', { replace: true });
      throw new Error('unauthorized');
    }
    if (!res.ok) throw new Error(body?.message || body?.error || `HTTP ${res.status}`);
    return body;
  };

  const parseOverview = (payload) => {
    const d = payload?.data || payload || {};
    const products =
      typeof d.products === 'number' ? d.products :
      typeof d.totalProducts === 'number' ? d.totalProducts :
      Array.isArray(d.products) ? d.products.length : 0;
    const users =
      typeof d.users === 'number' ? d.users :
      typeof d.totalUsers === 'number' ? d.totalUsers :
      Array.isArray(d.users) ? d.users.length : 0;
    return { totalProducts: products, totalUsers: users };
  };

  const fetchOverview = async () => {
    setLoadingOverview(true);
    setOverviewError('');
    try {
      const data = await apiFetch(`${ADMIN_API}/overview.php`);
      setOverview(parseOverview(data));
    } catch (err) {
      setOverview({ totalProducts: 0, totalUsers: 0 });
      setOverviewError(err?.message || 'Failed to load overview');
    } finally {
      setLoadingOverview(false);
    }
  };

  const ensureMonthSales = async (dateObj) => {
    const { startKey, endKey } = monthBounds(dateObj);
    const monthKey = startKey.slice(0, 7);
    if (salesCache[monthKey] || loadingMonthRef.current[monthKey]) return;

    loadingMonthRef.current[monthKey] = true;
    setLoadingSales(true);
    setSalesError('');
    try {
      const data = await apiFetch(`${ADMIN_API}/sales.php?start=${startKey}&end=${endKey}`);
      const days = data?.data?.days || {};
      setSalesCache((prev) => ({ ...prev, [monthKey]: days }));
    } catch (err) {
      setSalesError(err?.message || 'Failed to load sales');
    } finally {
      setLoadingSales(false);
      loadingMonthRef.current[monthKey] = false;
    }
  };

  const ensureDaySales = async (dateObj) => {
    const key = formatDateLocal(dateObj);
    const monthKey = key.slice(0, 7);
    if (salesCache[monthKey]?.[key]) return;

    setLoadingSales(true);
    setSalesError('');
    try {
      const data = await apiFetch(`${ADMIN_API}/sales.php?date=${key}`);
      const payload = data?.data || data || {};
      const entry = {
        total_orders: Number(payload.total_orders) || 0,
        total_sales: Number(payload.total_sales) || 0,
      };
      setSalesCache((prev) => ({
        ...prev,
        [monthKey]: { ...(prev[monthKey] || {}), [key]: entry },
      }));
    } catch (err) {
      setSalesError(err?.message || 'Failed to load day');
    } finally {
      setLoadingSales(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    ensureMonthSales(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ensureMonthSales(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate.getFullYear(), selectedDate.getMonth()]);

  const handleLogout = async () => {
    try { await fetch(`${API_ROOT}/auth/logout.php`, { method: 'POST', credentials: 'include' }); } catch {}
    logout();
    navigate('/home');
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    await ensureDaySales(date);
  };

  const selectedKey = useMemo(() => formatDateLocal(selectedDate), [selectedDate]);
  const monthKey = selectedKey.slice(0, 7);
  const dayData = salesCache[monthKey]?.[selectedKey] || null;

  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    const k = formatDateLocal(date);
    const rec = salesCache[k.slice(0, 7)]?.[k];
    if (!rec) return '';
    const total = rec.total_sales || 0;
    if (total > 1_000_000) return 'rounded-lg ring-2 ring-green-500/80 !text-white bg-green-600/80';
    if (total > 300_000)   return 'rounded-lg ring-2 ring-blue-500/80 !text-white bg-blue-600/80';
    if (total > 0)         return 'rounded-lg ring-2 ring-amber-500/80 !text-white bg-amber-600/80';
    return 'rounded-lg ring-2 ring-red-500/80 !text-white bg-red-600/80';
  };

  const monthTotals = useMemo(() => {
    const days = salesCache[monthKey] || {};
    let orders = 0, sales = 0;
    Object.values(days).forEach((v) => {
      orders += Number(v?.total_orders || 0);
      sales  += Number(v?.total_sales  || 0);
    });
    return { orders, sales };
  }, [salesCache, monthKey]);

  const sparklinePath = useMemo(() => {
    const days = salesCache[monthKey] || {};
    const mb = monthBounds(selectedDate);
    const count = parseInt(mb.endKey.slice(-2), 10);
    const values = range(count).map((i) => {
      const k = `${monthKey}-${pad(i + 1)}`;
      return Number(days[k]?.total_sales || 0);
    });
    const max = Math.max(1, ...values);
    const W = 240, H = 60;
    const step = W / (values.length - 1 || 1);
    const points = values.map((v, i) => {
      const x = i * step;
      const y = H - (v / max) * H;
      return `${x},${y}`;
    });
    return { d: `M ${points.join(' L ')}`, W, H };
  }, [salesCache, selectedDate, monthKey]);

  /* Inline calendar theming */
  const calendarCss = `
    .fz-cal{
      width:100%;
      background:#fff;
      color:#111827;
      border-radius:16px;
      padding:14px;
      font-size:14px;
      box-shadow: 0 8px 24px rgba(0,0,0,.18);
    }
    .fz-cal .react-calendar__navigation{ margin-bottom:8px; }
    .fz-cal .react-calendar__navigation button{
      min-width:34px; padding:6px 8px; border-radius:10px; font-weight:600; background:transparent;
    }
    .fz-cal .react-calendar__navigation button:enabled:hover{ background:#f3f4f6; }
    .fz-cal .react-calendar__month-view__weekdays{ text-transform:none; font-weight:700; color:#6b7280; }
    .fz-cal .react-calendar__tile{ height:56px; border-radius:12px; }
    .fz-cal .react-calendar__tile:enabled:hover{ background:#eef2ff; }
    .fz-cal .react-calendar__tile--now{ outline:2px solid #93c5fd; outline-offset:1px; }
    .fz-cal .react-calendar__tile--active{ background:#1d4ed8; color:#fff; }
  `;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white flex flex-col items-center justify-start py-10">
      <style>{calendarCss}</style>

      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-20 z-0" style={{ backgroundImage: "url('/images/fallback.jpg')" }} />
      <div className="absolute top-10 left-10 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl animate-pulse z-0" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-1000 z-0" />

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl w-full">
        <div className="glass-card-gradient w-full p-8 rounded-xl shadow-lg backdrop-blur-md bg-white/5 border border-white/10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 gradient-text">Admin Dashboard</h1>
          <p className="text-lg mt-2 text-white/80">Welcome to the control center</p>
        </div>
      </div>

      {/* Overview */}
      <section className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 max-w-5xl w-full px-6">
        {[
          { label: 'Products', count: overview.totalProducts, accent: 'from-cyan-500/30 to-transparent', ring: 'ring-cyan-400/40' },
          { label: 'Users', count: overview.totalUsers, accent: 'from-cyan-500/30 to-transparent', ring: 'ring-cyan-400/40' },
        ].map((c) => (
          <div key={c.label} className={`relative overflow-hidden p-6 rounded-xl bg-white/5 border border-white/10 ring-1 ${c.ring} shadow-lg`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${c.accent}`} />
            <div className="relative">
              <h3 className="text-xl font-semibold">{c.label}</h3>
              <p className="text-4xl font-extrabold mt-2">{loadingOverview ? '…' : c.count}</p>
              {overviewError && <p className="text-red-400 text-sm mt-2">{overviewError}</p>}
            </div>
          </div>
        ))}
      </section>

      {/* Sales */}
      <section className="relative z-10 w-full max-w-6xl bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-md mt-10">
        {/* grid with left calendar card and right insight panel */}
        <div className="grid grid-cols-1 md:[grid-template-columns:520px_1fr] gap-6">
          {/* LEFT: Calendar card WITH the heading inside */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xl mb-3">
              <span role="img" aria-label="calendar">📅</span>
              <span>Sales Overview</span>
            </div>

            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileClassName={getTileClassName}
              prev2Label={null}
              next2Label={null}
              className="fz-cal w-full"
            />
            {loadingSales && <div className="mt-3 text-sm text-white/80">Loading sales…</div>}
            {salesError && <p className="text-red-400 text-sm mt-2">{salesError}</p>}
          </div>

          {/* RIGHT: Insight Panel */}
          <div className="flex flex-col gap-5">
            {/* Day Detail */}
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white/90">
                  {selectedDate.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </h3>
                <span className="px-2 py-1 rounded bg-white/10 text-xs">{selectedKey}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg p-4 bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-400/30">
                  <p className="text-sm text-white/70">Sales</p>
                  <p className="text-2xl font-bold text-emerald-300">{fmtRs(dayData?.total_sales || 0)}</p>
                </div>
                <div className="rounded-lg p-4 bg-gradient-to-br from-sky-500/20 to-transparent border border-sky-400/30">
                  <p className="text-sm text-white/70">Orders</p>
                  <p className="text-2xl font-bold text-sky-300">{dayData?.total_orders || 0}</p>
                </div>
              </div>

              {!dayData && !loadingSales && (
                <p className="mt-4 text-sm text-white/70">No sales data cached for this date yet.</p>
              )}
            </div>

            {/* Month Summary + Sparkline */}
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white/90">
                  {selectedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} Summary
                </h3>
                <span className="px-2 py-1 rounded bg-white/10 text-xs">{monthKey}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg p-4 bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-400/30">
                  <p className="text-sm text-white/70">Total Sales</p>
                  <p className="text-2xl font-bold text-amber-300">{fmtRs(monthTotals.sales)}</p>
                </div>
                <div className="rounded-lg p-4 bg-gradient-to-br from-fuchsia-500/20 to-transparent border border-fuchsia-400/30">
                  <p className="text-sm text-white/70">Total Orders</p>
                  <p className="text-2xl font-bold text-fuchsia-300">{monthTotals.orders}</p>
                </div>
              </div>

              <div className="mt-5">
                <svg width={240} height={60} className="w-full h-16">
                  <line x1="0" y1="59" x2="240" y2="59" stroke="currentColor" className="text-white/20" strokeWidth="1" />
                  <path d={sparklinePath.d} fill="none" stroke="currentColor" className="text-cyan-300" strokeWidth="2" />
                </svg>
                <p className="text-xs text-white/60 mt-1">Daily sales this month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Links */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-5xl w-full px-6">
        <div className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:scale-[1.02] hover:shadow-lg transition text-center">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">📦 Manage Products</h2>
          <p className="text-sm text-gray-300 mb-4">Add, edit, or remove products.</p>
          <button onClick={() => navigate('/admin/products')} className="text-cyan-300 hover:underline font-semibold">
            Go to Product Management
          </button>
        </div>
        <div className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:scale-[1.02] hover:shadow-lg transition text-center">
          <h2 className="text-xl font-semibold text-green-400 mb-2">👥 Manage Users</h2>
          <p className="text-sm text-gray-300 mb-4">View and manage registered users.</p>
          <button onClick={() => navigate('/admin/users')} className="text-green-300 hover:underline font-semibold">
            Go to User Management
          </button>
        </div>
      </section>

      {/* Footer buttons */}
      <div className="text-center mt-10 relative z-10 flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={handleLogout} className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Logout</button>
        <button onClick={() => navigate('/home')} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go to Home</button>
      </div>
    </div>
  );
}
