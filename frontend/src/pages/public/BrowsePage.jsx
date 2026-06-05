import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from '../../lib/icons';
import { getSkills } from '../../api/skillApi';
import SkillCard from '../../components/skills/SkillCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const CATS = [
  { value: '', label: 'All' },
  { value: 'programming', label: 'Programming' },
  { value: 'graphic_design', label: 'Graphic Design' },
  { value: 'writing', label: 'Writing' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'languages', label: 'Languages' },
  { value: 'video_editing', label: 'Video Editing' },
  { value: 'photography', label: 'Photography' },
  { value: 'music', label: 'Music' },
  { value: 'business', label: 'Business' },
  { value: 'tutoring', label: 'Tutoring' },
  { value: 'data_analysis', label: 'Data Analysis' },
  { value: 'ui_ux_design', label: 'UI/UX Design' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'other', label: 'Other' },
];

export default function BrowsePage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', skill_type: '', level: '', search: '' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
        const res = await getSkills(params);
        setSkills(res.data.results || res.data);
      } catch { setSkills([]); }
      setLoading(false);
    };
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [filters]);

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A8A)' }} className="py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Browse All Skills</h1>
          <p className="text-slate-300 mb-8">Discover what the community has to offer</p>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search skills, categories, descriptions..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
            />
            {filters.search && (
              <button onClick={() => setFilters((f) => ({ ...f, search: '' }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Category pills */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {CATS.map((cat) => (
            <button key={cat.value}
              onClick={() => setFilters((f) => ({ ...f, category: cat.value }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                filters.category === cat.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <SlidersHorizontal size={13} /> Filters:
          </div>
          <select value={filters.skill_type} onChange={(e) => setFilters((f) => ({ ...f, skill_type: e.target.value }))}
            className="input-base py-1.5 text-xs w-auto min-w-[120px]">
            <option value="">All Types</option>
            <option value="offered">Offered</option>
            <option value="wanted">Wanted</option>
          </select>
          <select value={filters.level} onChange={(e) => setFilters((f) => ({ ...f, level: e.target.value }))}
            className="input-base py-1.5 text-xs w-auto min-w-[120px]">
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
          {hasFilters && (
            <button onClick={() => setFilters({ category: '', skill_type: '', level: '', search: '' })}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium">
              <X size={12} /> Clear all
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner center size="lg" text="Searching skills..." />
        ) : skills.length === 0 ? (
          <EmptyState icon={Search} title="No skills found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-5">{skills.length} skill{skills.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {skills.map((skill) => <SkillCard key={skill.id} skill={skill} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
