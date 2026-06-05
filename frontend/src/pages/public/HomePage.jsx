import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, ArrowLeftRight, Star, Shield, CheckCircle, Zap } from '../../lib/icons';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  { icon: '💻', name: 'Programming', count: '120+', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { icon: '🎨', name: 'Graphic Design', count: '85+', color: 'bg-pink-50 text-pink-600 border-pink-100' },
  { icon: '🌍', name: 'Languages', count: '70+', color: 'bg-green-50 text-green-600 border-green-100' },
  { icon: '📢', name: 'Marketing', count: '60+', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { icon: '🎬', name: 'Video Editing', count: '45+', color: 'bg-red-50 text-red-600 border-red-100' },
  { icon: '📚', name: 'Tutoring', count: '90+', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { icon: '🎵', name: 'Music', count: '40+', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { icon: '📊', name: 'Data Analysis', count: '35+', color: 'bg-teal-50 text-teal-600 border-teal-100' },
];

const STEPS = [
  { icon: Users, num: '01', title: 'Create Your Profile', desc: 'Sign up and tell the community what you know and what you want to learn.' },
  { icon: Sparkles, num: '02', title: 'Add Your Skills', desc: 'List skills you can offer and skills you want in return from others.' },
  { icon: ArrowLeftRight, num: '03', title: 'Send Exchange Requests', desc: 'Browse matches and send requests to users who have what you need.' },
  { icon: Star, num: '04', title: 'Exchange & Review', desc: 'Complete the exchange and leave honest reviews to build your reputation.' },
];

const STATS = [
  { value: '10,000+', label: 'Active Members' },
  { value: '50,000+', label: 'Skills Listed' },
  { value: '25,000+', label: 'Exchanges Done' },
  { value: '80+', label: 'Countries' },
];

const TESTIMONIALS = [
  { name: 'Ahmed A.', role: 'Web Developer', text: 'I got a beautiful logo for my startup in exchange for building a portfolio website. This platform is incredible!', rating: 5, avatar: 'A' },
  { name: 'Sara H.', role: 'Graphic Designer', text: 'Exchanged my design skills for English tutoring. So much better than paying — both of us learned and grew.', rating: 5, avatar: 'S' },
  { name: 'Omar K.', role: 'Data Analyst', text: 'I taught someone Python and got UI/UX consulting in return. The reputation system makes everything trustworthy.', rating: 5, avatar: 'O' },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #1E3A8A 100%)' }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-medium px-4 py-2 rounded-full mb-8">
              No money involved · Skills only
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Exchange Skills.
              <br />
              <span style={{
                background: 'linear-gradient(90deg, #60A5FA, #A78BFA, #34D399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Build Connections.
              </span>
              <br />
              Grow Together.
            </h1>

            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              A modern platform where people trade skills, collaborate, and learn from each other — completely free. No money, no subscriptions. Just community.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
              <Link
                to={user ? '/search' : '/register'}
                className="flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all shadow-lg shadow-black/20 text-sm"
              >
                <Sparkles size={16} />
                {user ? 'Find a Match' : 'Start Exchanging Free'}
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/browse"
                className="flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all text-sm"
              >
                Browse All Skills
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur border border-white/10 rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 64L1440 64L1440 32C1200 64 960 0 720 0C480 0 240 64 0 32L0 64Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Exchange skills in four simple steps. No payments, no subscriptions — just community-powered collaboration.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative">
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon size={18} />
                      </div>
                      <span className="text-3xl font-black text-slate-100">{step.num}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Categories ===== */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest text-violet-600 uppercase mb-3">Skill Categories</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Explore All Categories</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Thousands of skills across every domain. Find exactly what you need.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/browse?category=${cat.name.toLowerCase().replace(/ /g, '_')}`}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border ${cat.color} bg-opacity-50 hover:scale-105 hover:shadow-md transition-all text-center`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{cat.name}</p>
                  <p className="text-xs opacity-70 mt-0.5">{cat.count} skills</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/browse"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              View all categories <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Reputation / Trust ===== */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #1E3A8A, #6D28D9)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest text-blue-300 uppercase mb-3">Trust System</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Built on Trust & Reputation</h2>
          <p className="text-blue-200 mb-12 max-w-xl mx-auto leading-relaxed">
            Every exchange is backed by community verification. The more you contribute, the more trusted you become.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-12">
            {[
              { icon: '🌱', level: 'New Member', range: '0–49 pts', color: 'border-slate-400/30 bg-white/5' },
              { icon: '⭐', level: 'Trusted Member', range: '50–149 pts', color: 'border-blue-400/30 bg-blue-500/10' },
              { icon: '🏆', level: 'Highly Rated', range: '150–299 pts', color: 'border-violet-400/30 bg-violet-500/10' },
              { icon: '💎', level: 'Expert Contributor', range: '300+ pts', color: 'border-amber-400/30 bg-amber-500/10' },
            ].map((l) => (
              <div key={l.level} className={`border rounded-2xl p-5 text-center ${l.color}`}>
                <span className="text-4xl mb-3 block">{l.icon}</span>
                <p className="font-semibold text-white text-sm">{l.level}</p>
                <p className="text-blue-300 text-xs mt-1">{l.range}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
            {[
              { icon: CheckCircle, text: 'Verified exchanges' },
              { icon: Star, text: 'Honest peer reviews' },
              { icon: Shield, text: 'Community-backed trust' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon size={16} className="text-emerald-400" />
                {text}
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link to={user ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
              <Zap size={16} className="text-blue-600" />
              {user ? 'Go to Dashboard' : 'Join the Community'}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-3">Community</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Loved by Our Members</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400" fill="#FBBF24" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Ready to Start Exchanging?</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">Join thousands of skilled people sharing knowledge and growing together — for free.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={user ? '/skills/add' : '/register'}
              className="flex items-center justify-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl transition-all hover:opacity-90 shadow-lg text-sm"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              <Sparkles size={16} />
              {user ? 'Add a Skill' : 'Create Free Account'}
            </Link>
            <Link to="/browse"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
              Browse Skills
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
