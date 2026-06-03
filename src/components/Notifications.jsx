import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react'; 
import { Bell, Check, X, AlertCircle, CheckCircle2, Clock, Settings } from 'lucide-react';
import Sidebar from './Sidebar';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://192.168.0.34:8000';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper time format function
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMins = Math.floor((now - date) / 60000);
    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} mins ago`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return date.toLocaleDateString();
  };

  // ✅ Fetch Notifications API
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/my-notifications/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data); 
      }
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark as Read API
  const markAsRead = async (id, e) => {
    if(e) e.stopPropagation();
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`${API_BASE}/api/read-notification/${id}/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // State update hoty hi card gayab ho jayega
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  // Auto-refresh every 10 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // ====================================================================
  // 🔥 MAGIC FIX: Yahan hum sirf 'Unread' notifications ko hi filter kar rahe hain. 
  // Jo Read ho jayengi, wo is list se turant gayab ho jayengi!
  // ====================================================================
  const activeNotifications = notifications.filter(n => !n.is_read);

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)',
            }}
            animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: Math.random() * 15 + 10, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="mb-2 bg-gradient-to-r from-cyan-400 via-white to-yellow-400 bg-clip-text text-transparent relative inline-block text-3xl font-bold"
              >
                Alerts & Notifications
                <motion.div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-yellow-500 rounded-full" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.3, duration: 0.8 }} />
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 mt-2">
                Action required for idle machines
              </motion.p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => activeNotifications.forEach(n=>markAsRead(n.id))} variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 cursor-pointer">
                <Check className="w-4 h-4 mr-2" /> Mark All Read
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-cyan-500 text-center py-10 font-bold animate-pulse">Loading Live Alerts...</div>
            ) : activeNotifications.length === 0 ? (
               <div className="text-slate-500 text-center py-10 text-lg">📭 No active notifications. All caught up!</div>
            ) : (
              activeNotifications.map((notif, index) => {
                return (
                  <motion.div key={notif.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card 
                      onClick={() => navigate('/plant-2-live', { state: { autoOpenMachine: notif.machine_no } })} 
                      className="backdrop-blur-xl border p-6 transition-all hover:scale-[1.01] relative overflow-hidden cursor-pointer bg-gradient-to-br from-red-500/10 to-[#1e293b]/80 border-red-500/30"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-yellow-500" />

                      <div className="flex items-start gap-4">
                        <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center relative bg-red-500/20" whileHover={{ scale: 1.1, rotate: 5 }}>
                          <div className="absolute inset-0 blur-md opacity-30 bg-red-500 rounded-xl" />
                          <AlertCircle className="w-6 h-6 relative z-10 text-red-400" />
                        </motion.div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-red-400">
                              Downtime Reason Required (M-{notif.machine_no})
                            </h3>
                            <div className="flex gap-2">
                              <motion.button
                                onClick={(e) => markAsRead(notif.id, e)}
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                className="w-8 h-8 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 flex items-center justify-center text-cyan-400 transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                          <p className="text-slate-300 mb-3 font-medium">{notif.message}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeAgo(notif.created_at)}</span>
                            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs border border-red-500/30 ml-2 font-bold">Action Required</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}