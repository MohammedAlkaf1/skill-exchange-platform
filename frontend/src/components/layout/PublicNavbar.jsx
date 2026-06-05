import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Sparkles } from '../../lib/icons';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

export default function PublicNavbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <Logo variant="full" size="sm" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/browse" className={linkClass}>Browse Skills</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Dashboard
                </Link>
                <Link
                  to={`/profile/${user.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {user.profile_image_url ? (
                    <img src={user.profile_image_url} alt="" className="w-6 h-6 rounded-md object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-xs font-bold">
                      {user.full_name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  {user.full_name?.split(' ')[0]}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                >
                  <Sparkles size={14} />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 pt-2 border-t border-slate-100 space-y-1">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/browse', label: 'Browse Skills' },
              { to: '/about', label: 'About' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user ? (
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Dashboard</Link>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl">Sign In</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center py-2 text-sm font-semibold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>Get Started</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
