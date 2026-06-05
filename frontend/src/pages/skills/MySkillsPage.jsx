import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Target } from '../../lib/icons';
import { getMySkills, deleteSkill } from '../../api/skillApi';
import SkillCard from '../../components/skills/SkillCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export default function MySkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    getMySkills().then((r) => setSkills(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await deleteSkill(id);
      setSkills((s) => s.filter((sk) => sk.id !== id));
      toast.success('Skill deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const offered = skills.filter((s) => s.skill_type === 'offered');
  const wanted = skills.filter((s) => s.skill_type === 'wanted');
  const displayed = filter === 'all' ? skills : (filter === 'offered' ? offered : wanted);

  if (loading) return <LoadingSpinner center size="lg" />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Skills</h1>
          <p className="text-sm text-slate-500 mt-0.5">{offered.length} offered · {wanted.length} wanted</p>
        </div>
        <Link to="/skills/add" className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto">
          <Plus size={15} /> Add Skill
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {[
          { key: 'all', label: `All (${skills.length})` },
          { key: 'offered', label: `Offered (${offered.length})`, icon: Sparkles },
          { key: 'wanted', label: `Wanted (${wanted.length})`, icon: Target },
        ].map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {t.icon && <t.icon size={13} />}
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {displayed.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No skills yet"
          description="Add skills you can offer or skills you want to learn to start exchanging with the community."
          action={
            <Link to="/skills/add" className="btn btn-primary btn-sm flex items-center gap-1.5">
              <Plus size={14} /> Add Your First Skill
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayed.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={(s) => navigate(`/skills/edit/${s.id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
