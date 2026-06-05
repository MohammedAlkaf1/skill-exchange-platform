import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMySkills } from '../../api/skillApi';
import { getSentExchanges, getReceivedExchanges } from '../../api/exchangeApi';
import { getNotifications } from '../../api/notificationApi';
import DashboardStatCard from '../../components/common/DashboardStatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import RatingStars from '../../components/common/RatingStars';
import {
  ArrowLeftRight, Sparkles, Target, Clock, CheckCircle2, TrendingUp,
  Star, Bell, Plus, Search, ArrowRight, Trophy, ChevronRight, Zap
} from '../../lib/icons';

const REP_CONFIG = {
  'New Member':          { label: 'New Member',         color: 'text-slate-600', bg: 'bg-slate-100', icon: '🌱', next: 50 },
  'Trusted Member':      { label: 'Trusted Member',     color: 'text-blue-600',  bg: 'bg-blue-50',   icon: '⭐', next: 150 },
  'Highly Rated Member': { label: 'Highly Rated',       color: 'text-violet-600',bg: 'bg-violet-50', icon: '🏆', next: 300 },
  'Expert Contributor':  { label: 'Expert Contributor', color: 'text-amber-600', bg: 'bg-amber-50',  icon: '💎', next: null },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, se, re, n] = await Promise.all([
          getMySkills(), getSentExchanges(), getReceivedExchanges(), getNotifications(),
        ]);
        setSkills(Array.isArray(s.data) ? s.data : (s.data.results || []));
        setSent(Array.isArray(se.data) ? se.data : (se.data.results || []));
        setReceived(Array.isArray(re.data) ? re.data : (re.data.results || []));
        setNotifications(Array.isArray(n.data) ? n.data : (n.data.results || []));
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingSpinner center size="lg" text="Loading your dashboard..." />;

  const pendingReceived = received.filter((e) => e.status === 'pending').length;
  const pendingSent = sent.filter((e) => e.status === 'pending').length;
  const activeExchanges = [...sent, ...received].filter((e) => ['accepted','in_progress'].includes(e.status)).length;
  const completedAll = [...sent, ...received].filter((e) => e.status === 'completed').length;
  const offered = skills.filter((s) => s.skill_type === 'offered').length;
  const wanted = skills.filter((s) => s.skill_type === 'wanted').length;
  const allExchanges = [...sent, ...received].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6);
  const recentNotifs = notifications.slice(0, 5);
  const unreadNotifs = notifications.filter((n) => !n.is_read).length;
  const level = user?.reputation_level || 'New Member';
  const repCfg = REP_CONFIG[level] || REP_CONFIG['New Member'];
  const score = user?.reputation_score || 0;
  const progress = repCfg.next ? Math.min((score / repCfg.next) * 100, 100) : 100;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Good day, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Here's what's happening with your skill exchanges
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/skills/add" className="btn btn-outline btn-sm flex items-center gap-1.5">
            <Plus size={14} /> Add Skill
          </Link>
          <Link to="/search" className="btn btn-primary btn-sm flex items-center gap-1.5">
            <Search size={14} /> Find Match
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <DashboardStatCard title="Reputation" value={score.toFixed(0)} icon={Trophy} color="orange" subtitle={level} />
        <DashboardStatCard title="Avg Rating" value={user?.average_rating > 0 ? user.average_rating.toFixed(1) : '—'} icon={Star} color="teal" subtitle={`${user?.reviews_count || 0} reviews`} />
        <DashboardStatCard title="Completed" value={user?.completed_exchanges_count || 0} icon={CheckCircle2} color="green" subtitle="exchanges" />
        <DashboardStatCard title="Offered" value={offered} icon={Sparkles} color="blue" subtitle="skills" />
        <DashboardStatCard title="Wanted" value={wanted} icon={Target} color="purple" subtitle="skills" />
        <DashboardStatCard title="Pending" value={pendingReceived + pendingSent} icon={Clock} color="indigo" subtitle="requests" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: exchanges */}
        <div className="lg:col-span-2 space-y-5">
          {/* Reputation card */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{repCfg.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{repCfg.label}</p>
                  <p className="text-xs text-slate-400">{score.toFixed(0)} reputation points</p>
                </div>
              </div>
              {repCfg.next && (
                <span className="text-xs text-slate-400">{(repCfg.next - score).toFixed(0)} pts to next level</span>
              )}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #2563EB, #7C3AED)' }}
              />
            </div>
          </div>

          {/* Exchange activity */}
          <div className="card p-5">
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Pending Received', value: pendingReceived, color: 'bg-amber-50 text-amber-700 border-amber-100' },
                { label: 'Pending Sent',     value: pendingSent,     color: 'bg-blue-50 text-blue-700 border-blue-100' },
                { label: 'Active',           value: activeExchanges, color: 'bg-violet-50 text-violet-700 border-violet-100' },
                { label: 'Completed',        value: completedAll,    color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
              ].map((item) => (
                <div key={item.label} className={`border rounded-xl p-3 text-center ${item.color}`}>
                  <p className="text-xl font-bold">{item.value}</p>
                  <p className="text-xs mt-0.5 opacity-80">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Recent exchanges */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Recent Exchanges</h3>
              <Link to="/exchanges" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {allExchanges.length === 0 ? (
              <div className="text-center py-8">
                <ArrowLeftRight size={28} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No exchanges yet.</p>
                <Link to="/search" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Find a match →</Link>
              </div>
            ) : (
              <div className="space-y-1">
                {allExchanges.map((ex) => {
                  const other = user?.id === ex.sender?.id ? ex.receiver : ex.sender;
                  const isSender = user?.id === ex.sender?.id;
                  return (
                    <Link key={ex.id} to={`/exchanges/${ex.id}`}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-3">
                        {other?.profile_image_url ? (
                          <img src={other.profile_image_url} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                            {other?.full_name?.[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{other?.full_name}</p>
                          <p className="text-xs text-slate-400 truncate">{ex.requested_skill?.name} · {isSender ? 'Sent' : 'Received'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={ex.status} size="sm" />
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: notifications + quick actions */}
        <div className="space-y-5">
          {/* Quick actions */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Quick Actions</h3>
            <div className="space-y-1.5">
              {[
                { to: '/skills/add',         icon: Plus,          label: 'Add a Skill',        color: 'text-blue-600' },
                { to: '/search',             icon: Search,        label: 'Find a Match',       color: 'text-violet-600' },
                { to: `/profile/${user?.id}`,icon: TrendingUp,    label: 'View My Profile',    color: 'text-emerald-600' },
                { to: '/exchanges',          icon: ArrowLeftRight,label: 'Manage Exchanges',   color: 'text-amber-600' },
                { to: '/notifications',      icon: Bell,          label: 'Notifications',      color: 'text-red-500',  badge: unreadNotifs },
              ].map((item) => (
                <Link key={item.to} to={item.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                  <item.icon size={16} className={item.color} />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900 flex-1">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="text-xs font-bold px-1.5 py-0.5 bg-red-500 text-white rounded-full">{item.badge}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                Notifications
                {unreadNotifs > 0 && (
                  <span className="text-xs font-bold px-1.5 py-0.5 bg-red-500 text-white rounded-full">{unreadNotifs}</span>
                )}
              </h3>
              <Link to="/notifications" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                All <ArrowRight size={12} />
              </Link>
            </div>
            {recentNotifs.length === 0 ? (
              <div className="text-center py-6">
                <Bell size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">All caught up!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentNotifs.map((n) => (
                  <Link key={n.id} to="/notifications"
                    className={`block p-3 rounded-xl transition-colors ${n.is_read ? 'hover:bg-slate-50' : 'bg-blue-50/60 border border-blue-100 hover:bg-blue-50'}`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.is_read ? 'bg-slate-300' : 'bg-blue-500'}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
