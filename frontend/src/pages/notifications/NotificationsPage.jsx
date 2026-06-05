import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Circle } from '../../lib/icons';
import { getNotifications, markAsRead, markAllRead } from '../../api/notificationApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then((r) => setNotifications(Array.isArray(r.data) ? r.data : (r.data.results || [])))
      .catch(() => toast.error('Failed to load notifications.'))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const res = await markAsRead(id);
      setNotifications((ns) => ns.map((n) => n.id === id ? res.data : n));
    } catch {}
  };

  const handleMarkAll = async () => {
    try {
      await markAllRead();
      setNotifications((ns) => ns.map((n) => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read.');
    } catch {}
  };

  const fmt = (d) => {
    const diff = Date.now() - new Date(d);
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const unread = notifications.filter((n) => !n.is_read).length;

  const ICONS = {
    exchange: '🔄', review: '⭐', accepted: '✅', rejected: '❌', completed: '🎉', default: '🔔',
  };

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('accepted')) return '✅';
    if (t.includes('rejected') || t.includes('reject')) return '❌';
    if (t.includes('completed') || t.includes('complete')) return '🎉';
    if (t.includes('review')) return '⭐';
    if (t.includes('cancel')) return '🚫';
    if (t.includes('exchange')) return '🔄';
    return '🔔';
  };

  if (loading) return <LoadingSpinner center size="lg" />;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Notifications
            {unread > 0 && (
              <span className="text-sm font-bold px-2 py-0.5 bg-red-500 text-white rounded-full">{unread}</span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {unread > 0 ? `${unread} unread notification${unread !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={handleMarkAll}
            className="btn btn-ghost btn-sm flex items-center gap-1.5 text-blue-600 hover:bg-blue-50">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up! New notifications will appear here." />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.is_read && handleMarkRead(n.id)}
              className={`w-full text-left card p-4 transition-all duration-200 ${
                n.is_read ? 'opacity-70 hover:opacity-100' : 'border-blue-200 bg-blue-50/40 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${n.is_read ? 'bg-slate-100' : 'bg-white border border-blue-100 shadow-sm'}`}>
                  {getIcon(n.title)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${n.is_read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-400">{fmt(n.created_at)}</span>
                      {!n.is_read && <Circle size={8} className="text-blue-500 fill-blue-500" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
