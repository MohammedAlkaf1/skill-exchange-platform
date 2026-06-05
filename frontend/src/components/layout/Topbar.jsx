import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, ChevronDown, User, Settings, LogOut, X } from '../../lib/icons';
import { useAuth } from '../../context/AuthContext';
import { getUnreadCount } from '../../api/notificationApi';
import { logout } from '../../api/authApi';
import toast from 'react-hot-toast';

export default function Topbar({ onMenuClick, unread, setUnread }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    getUnreadCount().then((r) => setUnread(r.data.count)).catch(() => {});
    const id = setInterval(() => {
      getUnreadCount().then((r) => setUnread(r.data.count)).catch(() => {});
    }, 30000);
    return () => clearInterval(id);
  }, [user, setUnread]);

  useEffect(() => {
    const fn = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    try { await logout(refresh); } catch {}
    logoutUser();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <header
      className="fixed right-0 top-0 z-20 flex items-center gap-3 px-4 lg:px-6 bg-white border-b border-slate-200"
      style={{ height: '64px', left: '260px', transition: 'left 0.25s' }}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors flex-shrink-0"
      >
        <Menu size={20} />
      </button>

      {/* Search bar (desktop) */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search skills, users..."
            onFocus={() => navigate('/search')}
            readOnly
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-600 placeholder-slate-400 cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-1">
        {/* Mobile search */}
        <button
          onClick={() => navigate('/search')}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Search size={18} />
        </button>

        {/* Notifications */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          )}
        </Link>

        {/* User dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {user?.profile_image_url ? (
              <img src={user.profile_image_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
              >
                {user?.full_name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
              {user?.full_name?.split(' ')[0]}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{user?.full_name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
              {[
                { to: `/profile/${user?.id}`, icon: User, label: 'My Profile' },
                { to: '/profile/edit', icon: Settings, label: 'Settings' },
                { to: '/notifications', icon: Bell, label: 'Notifications' },
              ].map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Icon size={15} className="opacity-60" />
                  {label}
                </Link>
              ))}
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} className="opacity-80" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
