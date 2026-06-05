import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Users, Plus, X } from '../../lib/icons';
import { searchSkills, getMatches } from '../../api/skillApi';
import { useAuth } from '../../context/AuthContext';
import UserCard from '../../components/users/UserCard';
import SkillCard from '../../components/skills/SkillCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function SearchPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('search');
  const [results, setResults] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(true);
  const [filters, setFilters] = useState({ keyword: '', category: '', skill_type: 'offered', level: '', location: '' });

  useEffect(() => {
    getMatches().then((r) => setMatches(r.data)).catch(() => {}).finally(() => setMatchLoading(false));
    doSearch();
  }, []);

  const doSearch = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const res = await searchSkills(params);
      setResults(res.data);
    } catch { setResults([]); }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Find a Match</h1>
        <p className="text-sm text-slate-500 mt-0.5">Search for skills or get personalized recommendations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {[
          { key: 'search',  label: 'Search Skills', icon: Search },
          { key: 'matches', label: 'My Matches', icon: Sparkles },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'search' && (
        <>
          {/* Search form */}
          <div className="card p-5 space-y-4">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={filters.keyword}
                onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                placeholder="Search by skill name or keyword..."
                className="input-base pl-10" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'category', label: 'Category', opts: [['','All Categories'],['programming','Programming'],['graphic_design','Graphic Design'],['writing','Writing'],['marketing','Marketing'],['languages','Languages'],['video_editing','Video Editing'],['photography','Photography'],['music','Music'],['business','Business'],['tutoring','Tutoring'],['data_analysis','Data Analysis'],['ui_ux_design','UI/UX Design'],['social_media','Social Media'],['other','Other']] },
                { key: 'level',    label: 'Level',    opts: [['','All Levels'],['beginner','Beginner'],['intermediate','Intermediate'],['advanced','Advanced'],['expert','Expert']] },
                { key: 'skill_type',label: 'Type',   opts: [['','All Types'],['offered','Offered'],['wanted','Wanted']] },
              ].map((sel) => (
                <select key={sel.key} value={filters[sel.key]}
                  onChange={(e) => setFilters((f) => ({ ...f, [sel.key]: e.target.value }))}
                  className="input-base py-2 text-sm">
                  {sel.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              ))}
              <input value={filters.location}
                onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                placeholder="Location..." className="input-base py-2 text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={doSearch} className="btn btn-primary btn-sm flex items-center gap-1.5">
                <Search size={13} /> Search
              </button>
              {Object.values(filters).some(Boolean) && (
                <button onClick={() => { setFilters({ keyword:'',category:'',skill_type:'offered',level:'',location:'' }); setResults([]); }}
                  className="btn btn-ghost btn-sm flex items-center gap-1">
                  <X size={13} /> Clear
                </button>
              )}
            </div>
          </div>

          {loading ? <LoadingSpinner center size="lg" /> : results.length === 0 ? (
            <EmptyState icon={Search} title="No results" description="Try different keywords or remove some filters." />
          ) : (
            <>
              <p className="text-sm text-slate-500">{results.length} skill{results.length !== 1 ? 's' : ''} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((skill) => <SkillCard key={skill.id} skill={skill} />)}
              </div>
            </>
          )}
        </>
      )}

      {tab === 'matches' && (
        matchLoading ? <LoadingSpinner center size="lg" text="Finding your matches..." /> :
        matches.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No matches yet"
            description="Add skills you want to learn to get personalized matches from users who offer them."
            action={
              <Link to="/skills/add" className="btn btn-primary btn-sm flex items-center gap-1.5">
                <Plus size={13} /> Add Wanted Skills
              </Link>
            }
          />
        ) : (
          <>
            <div className="card p-4 border-blue-200 bg-blue-50/40">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <Sparkles size={15} className="text-blue-500" />
                <strong>{matches.length} matches</strong> found based on your wanted skills
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((u) => (
                <UserCard key={u.id} user={u}
                  onRequestExchange={(u) => window.location.href = `/exchanges/new?receiver=${u.id}`} />
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
}
