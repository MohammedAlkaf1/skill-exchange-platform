import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../api/authApi';
import { getUnreadCount } from '../../api/notificationApi';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const dropRef = useRef(null);

  useEffect(() => {
    if (user) {
      getUnreadCount().then((r) => setUnread(r.data.count)).catch(() => {});
      const interval = setInterval(() => {
        getUnreadCount().then((r) => setUnread(r.data.count)).catch(() => {});
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    try {
      await logout(refresh);
    } catch {}
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLink = 'text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm';
  const activeLink = 'text-blue-600 font-semibold';

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-1.5">
              <span className="text-white font-bold text-lg">SE</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">SkillExchange</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/browse" className={({ isActive }) => isActive ? activeLink : navLink}>Browse Skills</NavLink>
            {user && (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeLink : navLink}>Dashboard</NavLink>
                <NavLink to="/my-skills" className={({ isActive }) => isActive ? activeLink : navLink}>My Skills</NavLink>
                <NavLink to="/exchanges" className={({ isActive }) => isActive ? activeLink : navLink}>Exchanges</NavLink>
                <NavLink to="/search" className={({ isActive }) => isActive ? activeLink : navLink}>Find Match</NavLink>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
                <Link to="/notifications" className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <span className="text-xl">🔔</span>
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>

                {/* User dropdown */}
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    {user.profile_image_url ? (
                      <img src={user.profile_image_url} alt={user.full_name} className="h-8 w-8 rounded-full object-cover border-2 border-blue-100" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.full_name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium text-gray-700">{user.full_name?.split(' ')[0]}</span>
                    <span className="text-gray-400 text-xs">▼</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <Link to={`/profile/${user.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>My Profile</Link>
                      <Link to="/profile/edit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>Edit Profile</Link>
                      <Link to="/my-skills" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>My Skills</Link>
                      <Link to="/exchanges" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>Exchanges</Link>
                      <Link to="/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>Notifications {unread > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{unread}</span>}</Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Sign In</Link>
                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">Get Started</Link>
              </>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-500" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-1 pt-3 space-y-1">
            <NavLink to="/browse" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>Browse Skills</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
                <NavLink to="/my-skills" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>My Skills</NavLink>
                <NavLink to="/exchanges" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>Exchanges</NavLink>
                <NavLink to="/search" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>Find Match</NavLink>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Sign Out</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>Sign In</NavLink>
                <NavLink to="/register" className="block px-3 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg" onClick={() => setMenuOpen(false)}>Get Started</NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
