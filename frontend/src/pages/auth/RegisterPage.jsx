import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, CheckCircle } from '../../lib/icons';
import { register } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import toast from 'react-hot-toast';

const PERKS = [
  'Free forever — no payments, no subscriptions',
  'Exchange skills with thousands of members',
  'Build reputation through peer reviews',
  'Find matches based on your learning goals',
];

export default function RegisterPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '', confirm_password: '' });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
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
      const res = await register(form);
      loginUser(res.data.user, res.data.access, res.data.refresh);
      toast.success('Welcome to SkillExchange!');
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') setErrors(data);
      else toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (name) => {
    const e = errors[name];
    return e ? (Array.isArray(e) ? e[0] : e) : null;
  };

  const FIELDS = [
    { name: 'full_name',        label: 'Full Name',        type: 'text',     placeholder: 'Your full name',          col: 1 },
    { name: 'username',         label: 'Username',         type: 'text',     placeholder: 'Choose a username',       col: 1 },
    { name: 'email',            label: 'Email Address',    type: 'email',    placeholder: 'your@email.com',          col: 2 },
    { name: 'password',         label: 'Password',         type: 'password', placeholder: 'At least 6 characters',   col: 1 },
    { name: 'confirm_password', label: 'Confirm Password', type: 'password', placeholder: 'Repeat your password',    col: 1 },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-5" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:col-span-2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #1E3A8A 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />

        <Link to="/" className="relative">
          <Logo variant="light" size="md" />
        </Link>

        <div className="relative">
          <h2 className="text-3xl font-bold text-white mb-4">Join the community of skill traders</h2>
          <p className="text-violet-200 text-sm leading-relaxed mb-8">
            Create your account in seconds and start exchanging skills with talented people around the world.
          </p>
          <div className="space-y-3">
            {PERKS.map((p) => (
              <div key={p} className="flex items-start gap-3 text-sm text-violet-100">
                <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                {p}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['A','S','M','L','O'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-violet-700 flex items-center justify-center text-white font-bold text-xs"
                  style={{ background: `hsl(${i * 50 + 200}, 70%, 50%)` }}>
                  {c}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">10,000+ members</p>
              <p className="text-violet-300 text-xs">already exchanging skills</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="lg:col-span-3 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-lg">
          <Link to="/" className="inline-block mb-8 lg:hidden">
            <Logo variant="full" size="sm" />
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm">Join the skill exchange community — it's free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIELDS.slice(0, 2).map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                    placeholder={field.placeholder}
                    className={`input-base ${fieldError(field.name) ? 'input-error' : ''}`}
                  />
                  {fieldError(field.name) && <p className="text-red-500 text-xs mt-1">{fieldError(field.name)}</p>}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com"
                className={`input-base ${fieldError('email') ? 'input-error' : ''}`} />
              {fieldError('email') && <p className="text-red-500 text-xs mt-1">{fieldError('email')}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'password', label: 'Password', show: showPw, setShow: setShowPw, placeholder: 'Min. 6 characters' },
                { name: 'confirm_password', label: 'Confirm Password', show: showCPw, setShow: setShowCPw, placeholder: 'Repeat password' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                  <div className="relative">
                    <input
                      name={f.name} type={f.show ? 'text' : 'password'} value={form[f.name]} onChange={handleChange}
                      required placeholder={f.placeholder}
                      className={`input-base pr-11 ${fieldError(f.name) ? 'input-error' : ''}`}
                    />
                    <button type="button" onClick={() => f.setShow(!f.show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                      {f.show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {fieldError(f.name) && <p className="text-red-500 text-xs mt-1">{fieldError(f.name)}</p>}
                </div>
              ))}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2"><UserPlus size={16} />Create Account</span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
