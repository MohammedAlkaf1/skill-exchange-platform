import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Share2 } from '../../lib/icons';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo variant="light" size="sm" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              A modern platform where people trade skills, collaborate, and learn from each other — completely free.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Globe, MessageCircle, Share2].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/browse', label: 'Browse Skills' },
                { to: '/search', label: 'Find Matches' },
                { to: '/about', label: 'About Us' },
                { to: '/register', label: 'Get Started' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {['Programming', 'Design', 'Languages', 'Marketing', 'Video Editing', 'Tutoring'].map((c) => (
                <li key={c}>
                  <Link to="/browse" className="text-sm text-slate-400 hover:text-white transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} SkillExchange. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
