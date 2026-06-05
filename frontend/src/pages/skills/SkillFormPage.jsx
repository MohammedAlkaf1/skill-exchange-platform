import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Sparkles, Target, ChevronLeft, Save } from '../../lib/icons';
import { createSkill, updateSkill, getSkillById } from '../../api/skillApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'programming', label: 'Programming', icon: '💻' },
  { value: 'graphic_design', label: 'Graphic Design', icon: '🎨' },
  { value: 'writing', label: 'Writing', icon: '✍️' },
  { value: 'marketing', label: 'Marketing', icon: '📢' },
  { value: 'languages', label: 'Languages', icon: '🌍' },
  { value: 'video_editing', label: 'Video Editing', icon: '🎬' },
  { value: 'photography', label: 'Photography', icon: '📷' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'tutoring', label: 'Tutoring', icon: '📚' },
  { value: 'data_analysis', label: 'Data Analysis', icon: '📊' },
  { value: 'ui_ux_design', label: 'UI/UX Design', icon: '🖌️' },
  { value: 'social_media', label: 'Social Media', icon: '📱' },
  { value: 'other', label: 'Other', icon: '⭐' },
];

const LEVELS = [
  { value: 'beginner',     label: 'Beginner',     desc: 'Just starting out',           color: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Some experience',             color: 'border-blue-200 bg-blue-50 text-blue-700' },
  { value: 'advanced',     label: 'Advanced',     desc: 'Solid experience',            color: 'border-violet-200 bg-violet-50 text-violet-700' },
  { value: 'expert',       label: 'Expert',       desc: 'Professional level',          color: 'border-amber-200 bg-amber-50 text-amber-700' },
];

export default function SkillFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', category: 'programming', skill_type: 'offered', level: 'intermediate', description: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    getSkillById(id).then((r) => {
      const s = r.data;
      setForm({ name: s.name, category: s.category, skill_type: s.skill_type, level: s.level, description: s.description || '' });
    }).catch(() => { toast.error('Skill not found.'); navigate('/my-skills'); })
      .finally(() => setFetchLoading(false));
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      if (isEdit) { await updateSkill(id, form); toast.success('Skill updated!'); }
      else { await createSkill(form); toast.success('Skill added!'); }
      navigate('/my-skills');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') setErrors(data);
      else toast.error('Failed to save skill.');
    } finally { setLoading(false); }
  };

  if (fetchLoading) return <LoadingSpinner center size="lg" />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/my-skills" className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Skill' : 'Add a Skill'}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Share what you can offer or what you want to learn</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Skill type */}
        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-800 mb-3">Skill Type *</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'offered', label: 'I Can Offer This', desc: 'A skill you can teach or share with others', icon: Sparkles, color: 'border-emerald-300 bg-emerald-50' },
              { value: 'wanted',  label: 'I Want to Learn', desc: 'A skill you want to receive in exchange', icon: Target,   color: 'border-indigo-300 bg-indigo-50' },
            ].map((opt) => (
              <label key={opt.value}
                className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.skill_type === opt.value ? opt.color + ' shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                <input type="radio" name="skill_type" value={opt.value} checked={form.skill_type === opt.value}
                  onChange={(e) => setForm((f) => ({ ...f, skill_type: e.target.value }))} className="sr-only" />
                <opt.icon size={18} className={form.skill_type === opt.value ? 'text-slate-700' : 'text-slate-400'} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Skill name */}
        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">Skill Name *</label>
          <input name="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required
            placeholder="e.g. React Development, Logo Design, English Tutoring"
            className={`input-base ${errors.name ? 'input-error' : ''}`} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Category */}
        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-800 mb-3">Category *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat.value} type="button"
                onClick={() => setForm((f) => ({ ...f, category: cat.value }))}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                  form.category === cat.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}>
                <span>{cat.icon}</span>
                <span className="truncate">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Level */}
        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-800 mb-3">Skill Level *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LEVELS.map((l) => (
              <button key={l.value} type="button"
                onClick={() => setForm((f) => ({ ...f, level: l.value }))}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all ${
                  form.level === l.value ? l.color + ' border-opacity-100' : 'border-slate-200 hover:border-slate-300'
                }`}>
                <span className="text-sm font-semibold">{l.label}</span>
                <span className="text-xs opacity-70">{l.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4} placeholder="Describe your skill, experience level, what you can offer or what you're looking for..."
            className="input-base resize-none" />
          <p className="text-xs text-slate-400 mt-1.5">{form.description.length} / 500 characters</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/my-skills" className="btn btn-ghost flex-1 text-center flex items-center justify-center">Cancel</Link>
          <button type="submit" disabled={loading} className="btn btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save size={15} />}
            {loading ? 'Saving...' : isEdit ? 'Update Skill' : 'Add Skill'}
          </button>
        </div>
      </form>
    </div>
  );
}
