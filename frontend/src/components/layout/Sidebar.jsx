import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Sparkles, BookOpen, Search,
  ArrowLeftRight, Bell, LogOut, Settings, X, ChevronRight,
  TrendingUp,
} from '../../lib/icons';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../api/authApi';
import Logo from '../common/Logo';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/my-skills', icon: Sparkles, label: 'My Skills' },
  { to: '/browse', icon: BookOpen, label: 'Browse Skills' },
  { to: '/search', icon: Search, label: 'Find a Match' },
  { to: '/exchanges', icon: ArrowLeftRight, label: 'Exchanges' },
  { to: '/notifications', icon: Bell, label: 'Notifications', badge: true },
];

const BOTTOM_NAV = [
  { to: '/profile/edit', icon: Settings, label: 'Settings' },
];

const reputationConfig = {
  'New Member': { color: 'text-slate-500', bg: 'bg-slate-100', icon: '🌱' },
  'Trusted Member': { color: 'text-blue-600', bg: 'bg-blue-50', icon: '⭐' },
  'Highly Rated Member': { color: 'text-violet-600', bg: 'bg-violet-50', icon: '🏆' },
  'Expert Contributor': { color: 'text-amber-600', bg: 'bg-amber-50', icon: '💎' },
};

export default function Sidebar({ open, onClose, unread }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    try { await logout(refresh); } catch {}
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const level = user?.reputation_level || 'New Member';
  const rep = reputationConfig[level] || reputationConfig['New Member'];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
    ${isActive
      ? 'bg-blue-600 text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col bg-white border-r border-slate-200
          transition-transform duration-250 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ width: '260px' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 flex-shrink-0">
          <Link to="/dashboard" onClick={onClose}>
            <Logo variant="full" size="sm" />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-slate-100">
          <Link to={`/profile/${user?.id}`} onClick={onClose} className="flex items-center gap-3 group">
            <div className="relative flex-shrink-0">
              {user?.profile_image_url ? (
                <img
                  src={user.profile_image_url}
                  alt={user.full_name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                >
                  {user?.full_name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {user?.full_name}
              </p>
              <p className="text-xs text-slate-400 truncate">@{user?.username}</p>
            </div>
            <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
          </Link>

          {/* Reputation badge */}
          <div className={`flex items-center gap-1.5 mt-2.5 px-2.5 py-1.5 rounded-lg ${rep.bg}`}>
            <span className="text-xs">{rep.icon}</span>
            <span className={`text-xs font-medium ${rep.color}`}>{level}</span>
            <div className="flex-1" />
            <TrendingUp size={11} className={rep.color} />
            <span className={`text-xs font-semibold ${rep.color}`}>
              {user?.reputation_score?.toFixed(0) || 0}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {NAV.map(({ to, icon: Icon, label, badge }) => (
            <NavLink key={to} to={to} className={navLinkClass} onClick={onClose} end={to === '/dashboard'}>
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} />
                  <span className="flex-1">{label}</span>
                  {badge && unread > 0 && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                      ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 border-t border-slate-100 pt-3 space-y-0.5">
          {BOTTOM_NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={navLinkClass} onClick={onClose}>
              <Icon size={18} className="opacity-70" />
              <span>{label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
          >
            <LogOut size={18} className="opacity-80" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
