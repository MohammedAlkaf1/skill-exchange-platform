import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Heart, Shield, Users, Star, TrendingUp, Globe } from '../../lib/icons';

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A8A)' }} className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-300 bg-blue-900/40 border border-blue-700/40 px-4 py-2 rounded-full mb-6">
            <Heart size={12} className="text-red-400" /> Built for the community
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5">About SkillExchange</h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            A community-driven platform where people trade skills, collaborate, and learn from each other — no money involved.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-3">Our Mission</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-5">Democratizing access to skills and knowledge</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                SkillExchange was built on a simple idea: everyone has something valuable to offer. A web developer can help a graphic designer build their website, while the designer creates the developer's brand identity — both win.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We believe that the best way to learn is by doing — and the best way to do is with others. Our platform makes it easy to find the right person to exchange knowledge with, track your progress, and build a trusted reputation in your community.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: '10,000+', desc: 'Active Members', color: 'bg-blue-50 text-blue-600' },
                { icon: Star, label: '4.9/5', desc: 'Average Rating', color: 'bg-amber-50 text-amber-600' },
                { icon: TrendingUp, label: '25,000+', desc: 'Exchanges Done', color: 'bg-emerald-50 text-emerald-600' },
                { icon: Globe, label: '80+', desc: 'Countries', color: 'bg-violet-50 text-violet-600' },
              ].map((s) => (
                <div key={s.label} className={`card p-5 text-center ${s.color.split(' ')[0]}`}>
                  <s.icon size={24} className={`mx-auto mb-2 ${s.color.split(' ')[1]}`} />
                  <p className="text-2xl font-bold text-slate-900">{s.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-violet-600 uppercase mb-3">Core Values</p>
            <h2 className="text-3xl font-bold text-slate-900">What we stand for</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Heart,  title: 'Community First',   desc: 'We believe in the power of people helping each other grow. Every feature is designed to foster genuine connections.', color: 'bg-red-50 text-red-600' },
              { icon: Shield, title: 'Trust & Safety',     desc: 'Our reputation system ensures quality exchanges. Reviews, ratings, and completed exchanges build verified trust.', color: 'bg-blue-50 text-blue-600' },
              { icon: Globe,  title: 'No Barriers',        desc: 'No money, no subscriptions, no gatekeeping. Skills are the only currency on SkillExchange.', color: 'bg-emerald-50 text-emerald-600' },
            ].map((v) => (
              <div key={v.title} className="card p-6 text-center">
                <div className={`w-12 h-12 rounded-2xl ${v.color.split(' ')[0]} flex items-center justify-center mx-auto mb-4`}>
                  <v.icon size={22} className={v.color.split(' ')[1]} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reputation system */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest text-amber-600 uppercase mb-3">Reputation System</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How reputation works</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Your reputation score is automatically calculated based on your exchange history and community feedback.</p>
          </div>
          <div className="card p-6 mb-6">
            <div className="text-center mb-5">
              <p className="text-sm font-mono text-slate-600 bg-slate-50 inline-block px-4 py-2 rounded-xl border border-slate-200">
                Score = (Completed × 10) + (Avg Rating × 20) + (Positive Reviews × 5)
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: '🌱', level: 'New Member',         range: '0–49',    color: 'border-slate-200 bg-slate-50' },
                { icon: '⭐', level: 'Trusted Member',     range: '50–149',  color: 'border-blue-200 bg-blue-50' },
                { icon: '🏆', level: 'Highly Rated',       range: '150–299', color: 'border-violet-200 bg-violet-50' },
                { icon: '💎', level: 'Expert Contributor', range: '300+',    color: 'border-amber-200 bg-amber-50' },
              ].map((l) => (
                <div key={l.level} className={`border rounded-xl p-4 text-center ${l.color}`}>
                  <span className="text-3xl block mb-2">{l.icon}</span>
                  <p className="font-semibold text-slate-900 text-sm">{l.level}</p>
                  <p className="text-xs text-slate-500 mt-1">{l.range} pts</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1E3A8A, #4C1D95)' }} className="py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to join?</h2>
          <p className="text-blue-200 mb-8">Create your free account and start exchanging skills today.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors">
            Get Started Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
