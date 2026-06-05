import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Sparkles, ArrowLeftRight, Star, Shield } from '../../lib/icons';
import { login } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((e2) => ({ ...e2, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await login(form);
      loginUser(res.data.user, res.data.access, res.data.refresh);
      toast.success(`Welcome back, ${res.data.user.full_name?.split(' ')[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') setErrors(data);
      else toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4C1D95 100%)' }}>
        {/* BG Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />

        <div className="relative">
          <Link to="/">
            <Logo variant="light" size="md" />
          </Link>
        </div>

        <div className="relative">
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Exchange skills,<br />build relationships.
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed mb-8">
            Join thousands of skilled people sharing knowledge and growing together — completely free.
          </p>
          <div className="space-y-3">
            {[
              { icon: ArrowLeftRight, text: '25,000+ successful exchanges completed' },
              { icon: Star, text: '4.9/5 average satisfaction rating' },
              { icon: Shield, text: 'Trust-based reputation system' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-blue-100 text-sm">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-white" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-amber-400" fill="#FBBF24" strokeWidth={0} />)}
            </div>
            <p className="text-white/90 text-sm italic mb-4">
              "I exchanged my Python skills for logo design. Both of us got exactly what we needed without spending a cent!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm">A</div>
              <div>
                <p className="text-white text-sm font-medium">Ahmed A.</p>
                <p className="text-blue-300 text-xs">Web Developer · Dubai</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="inline-block mb-8 lg:hidden">
            <Logo variant="full" size="sm" />
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email or Username</label>
              <input
                name="email"
                type="text"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="Enter your email or username"
                className={`input-base ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`input-base pr-11 ${errors.password ? 'input-error' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{Array.isArray(errors.password) ? errors.password[0] : errors.password}</p>}
            </div>

            {/* General error */}
            {errors.non_field_errors && (
              <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-red-700 text-sm">
                  {Array.isArray(errors.non_field_errors) ? errors.non_field_errors[0] : errors.non_field_errors}
                </p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn btn-primary btn-lg w-full">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Signing in...</span>
              ) : (
                <span className="flex items-center gap-2"><LogIn size={16} />Sign In</span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">Create one free</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs font-semibold text-slate-600 mb-2.5 flex items-center gap-1.5">
              <Sparkles size={12} className="text-blue-500" /> Demo Accounts
            </p>
            <div className="space-y-1.5">
              {[
                { email: 'ahmed@example.com', name: 'Ahmed (Web Dev)' },
                { email: 'sara@example.com', name: 'Sara (Designer)' },
                { email: 'lina@example.com', name: 'Lina (English Tutor)' },
              ].map((acc) => (
                <button key={acc.email} type="button"
                  onClick={() => setForm({ email: acc.email, password: 'Password123!' })}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                  <span className="text-xs font-medium text-slate-600 group-hover:text-blue-700">{acc.name}</span>
                  <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Click to fill →</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">Password: Password123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
