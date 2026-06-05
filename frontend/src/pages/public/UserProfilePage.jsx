import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeftRight, Star, Pencil, CheckCircle, TrendingUp } from '../../lib/icons';
import { getUserById, getUserReviews, getUserSkills } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SkillCard from '../../components/skills/SkillCard';
import ReviewCard from '../../components/reviews/ReviewCard';
import RatingStars from '../../components/common/RatingStars';
import StatusBadge from '../../components/common/StatusBadge';

const REP = {
  'New Member':          { bg: 'bg-slate-100',   text: 'text-slate-700',   icon: '🌱' },
  'Trusted Member':      { bg: 'bg-blue-100',    text: 'text-blue-700',    icon: '⭐' },
  'Highly Rated Member': { bg: 'bg-violet-100',  text: 'text-violet-700',  icon: '🏆' },
  'Expert Contributor':  { bg: 'bg-amber-100',   text: 'text-amber-700',   icon: '💎' },
};

export default function UserProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState('offered');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, s, r] = await Promise.all([getUserById(id), getUserSkills(id), getUserReviews(id)]);
        setProfile(p.data); setSkills(s.data); setReviews(r.data);
      } catch { navigate('/'); }
      finally { setLoading(false); }
    })();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner center size="lg" />;
  if (!profile) return null;

  const isOwn = currentUser?.id === profile.id;
  const offered = skills.filter((s) => s.skill_type === 'offered');
  const wanted = skills.filter((s) => s.skill_type === 'wanted');
  const level = profile.reputation_level || 'New Member';
  const repCfg = REP[level] || REP['New Member'];

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Banner */}
      <div className="h-32 sm:h-48" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4C1D95 100%)' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Profile card - overlapping banner */}
        <div className="card p-6 -mt-16 sm:-mt-20 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar */}
            <div className="relative -mt-8 sm:-mt-12 flex-shrink-0">
              {profile.profile_image_url ? (
                <img src={profile.profile_image_url} alt={profile.full_name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-lg" />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                  {profile.full_name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-3 justify-between mb-2">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{profile.full_name}</h1>
                  <p className="text-sm text-slate-400">@{profile.username}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isOwn ? (
                    <Link to="/profile/edit" className="btn btn-outline btn-sm flex items-center gap-1.5">
                      <Pencil size={13} /> Edit Profile
                    </Link>
                  ) : (
                    currentUser && (
                      <Link to={`/exchanges/new?receiver=${profile.id}`}
                        className="btn btn-primary btn-sm flex items-center gap-1.5">
                        <ArrowLeftRight size={13} /> Request Exchange
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* Reputation badge */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${repCfg.bg} ${repCfg.text} mb-3`}>
                {repCfg.icon} {level}
              </span>

              {profile.bio && <p className="text-sm text-slate-600 leading-relaxed mb-3">{profile.bio}</p>}

              <div className="flex flex-wrap items-center gap-3">
                {profile.location && (
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={12} /> {profile.location}
                  </span>
                )}
                <StatusBadge status={profile.availability} size="sm" showIcon={false} />
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar size={12} />
                  Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100">
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">{profile.completed_exchanges_count || 0}</p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-center gap-1"><CheckCircle size={11} /> Exchanges</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-xl font-bold text-amber-500">{profile.average_rating > 0 ? profile.average_rating.toFixed(1) : '—'}</p>
                {profile.average_rating > 0 && <Star size={14} className="text-amber-400" fill="#FBBF24" strokeWidth={0} />}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{profile.reviews_count || 0} reviews</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-violet-600">{profile.reputation_score?.toFixed(0) || 0}</p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-center gap-1"><TrendingUp size={11} /> Rep. Score</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-6 overflow-hidden">
          <div className="flex border-b border-slate-100">
            {[
              { key: 'offered', label: `Offering (${offered.length})` },
              { key: 'wanted',  label: `Wanting (${wanted.length})` },
              { key: 'reviews', label: `Reviews (${reviews.length})` },
            ].map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors ${tab === t.key ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {tab === 'offered' && (
              offered.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No offered skills yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {offered.map((s) => <SkillCard key={s.id} skill={s} />)}
                </div>
              )
            )}
            {tab === 'wanted' && (
              wanted.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No wanted skills listed.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wanted.map((s) => <SkillCard key={s.id} skill={s} />)}
                </div>
              )
            )}
            {tab === 'reviews' && (
              reviews.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {profile.average_rating > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-slate-900">{profile.average_rating.toFixed(1)}</p>
                        <RatingStars rating={profile.average_rating} size="sm" />
                      </div>
                      <p className="text-sm text-slate-500">{reviews.length} total reviews</p>
                    </div>
                  )}
                  {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
