import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, Send, MapPin } from '../../lib/icons';
import { getUserById, getUserSkills } from '../../api/userApi';
import { getMySkills } from '../../api/skillApi';
import { createExchange } from '../../api/exchangeApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function NewExchangePage() {
  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get('receiver');
  const navigate = useNavigate();
  const [receiver, setReceiver] = useState(null);
  const [receiverSkills, setReceiverSkills] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [form, setForm] = useState({ requested_skill_id: '', offered_skill_id: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!receiverId) { navigate('/search'); return; }
    Promise.all([getUserById(receiverId), getUserSkills(receiverId), getMySkills()])
      .then(([r, s, m]) => {
        setReceiver(r.data);
        setReceiverSkills(s.data.filter((sk) => sk.skill_type === 'offered'));
        setMySkills(m.data.filter((sk) => sk.skill_type === 'offered'));
      })
      .catch(() => { toast.error('User not found.'); navigate('/search'); })
      .finally(() => setFetchLoading(false));
  }, [receiverId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.requested_skill_id) { toast.error('Please select a skill to request.'); return; }
    setLoading(true);
    setErrors({});
    try {
      const data = { receiver_id: parseInt(receiverId), requested_skill_id: parseInt(form.requested_skill_id), message: form.message };
      if (form.offered_skill_id) data.offered_skill_id = parseInt(form.offered_skill_id);
      await createExchange(data);
      toast.success('Exchange request sent! 🎉');
      navigate('/exchanges');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') setErrors(data);
      else toast.error(err.response?.data?.detail || 'Failed to send request.');
    } finally { setLoading(false); }
  };

  if (fetchLoading) return <LoadingSpinner center size="lg" />;

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Send Exchange Request</h1>
          <p className="text-sm text-slate-500 mt-0.5">Propose a skill exchange with this member</p>
        </div>
      </div>

      {/* Receiver card */}
      {receiver && (
        <div className="card p-5 flex items-center gap-4">
          {receiver.profile_image_url ? (
            <img src={receiver.profile_image_url} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100" />
          ) : (
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              {receiver.full_name?.[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900">{receiver.full_name}</p>
            <p className="text-sm text-slate-400">@{receiver.username}</p>
            {receiver.location && (
              <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                <MapPin size={11} /> {receiver.location}
              </p>
            )}
          </div>
          <Link to={`/profile/${receiver.id}`} className="btn btn-ghost btn-sm">View Profile</Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Skill to request */}
        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-800 mb-3">
            Skill you want from {receiver?.full_name} *
          </label>
          {receiverSkills.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-400">This user has no offered skills yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {receiverSkills.map((skill) => (
                <label key={skill.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    form.requested_skill_id == skill.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                  <input type="radio" name="requested_skill" value={skill.id} checked={form.requested_skill_id == skill.id}
                    onChange={(e) => setForm((f) => ({ ...f, requested_skill_id: e.target.value }))} className="mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{skill.name}</p>
                    <p className="text-xs text-slate-400">{skill.category_display} · {skill.level}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
          {errors.requested_skill_id && <p className="text-red-500 text-xs mt-1">{errors.requested_skill_id}</p>}
        </div>

        {/* Skill to offer */}
        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">Skill you offer in return (optional)</label>
          <select value={form.offered_skill_id}
            onChange={(e) => setForm((f) => ({ ...f, offered_skill_id: e.target.value }))}
            className="input-base">
            <option value="">No specific skill offered</option>
            {mySkills.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
            ))}
          </select>
          {mySkills.length === 0 && (
            <p className="text-xs text-slate-400 mt-1.5">
              <Link to="/skills/add" className="text-blue-600 hover:underline">Add offered skills</Link> to propose an exchange.
            </p>
          )}
        </div>

        {/* Message */}
        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">Message (optional)</label>
          <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            rows={4} placeholder="Introduce yourself, explain what you're looking for, and how you'd like to collaborate..."
            className="input-base resize-none" />
        </div>

        {errors.non_field_errors && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {Array.isArray(errors.non_field_errors) ? errors.non_field_errors[0] : errors.non_field_errors}
          </div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost flex-1">Cancel</button>
          <button type="submit" disabled={loading || !form.requested_skill_id}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Send size={14} />}
            {loading ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
