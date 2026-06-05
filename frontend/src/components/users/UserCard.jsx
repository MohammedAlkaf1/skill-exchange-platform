import { Link } from 'react-router-dom';
import { MapPin, Star, Shield, ArrowLeftRight } from '../../lib/icons';
import StatusBadge from '../common/StatusBadge';
import RatingStars from '../common/RatingStars';

const REPUTATION_STYLES = {
  'New Member':         { badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  'Trusted Member':     { badge: 'bg-blue-50 text-blue-700',    dot: 'bg-blue-500' },
  'Highly Rated Member':{ badge: 'bg-violet-50 text-violet-700', dot: 'bg-violet-500' },
  'Expert Contributor': { badge: 'bg-amber-50 text-amber-700',  dot: 'bg-amber-500' },
};

export default function UserCard({ user, onRequestExchange }) {
  const level = user.reputation_level || 'New Member';
  const repStyle = REPUTATION_STYLES[level] || REPUTATION_STYLES['New Member'];

  return (
    <div className="card card-hover flex flex-col">
      {/* Gradient header bar */}
      <div className="h-2 rounded-t-xl" style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED)' }} />

      <div className="p-5 flex-1">
        {/* User header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative flex-shrink-0">
            {user.profile_image_url ? (
              <img src={user.profile_image_url} alt={user.full_name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm" />
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-sm"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                {user.full_name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{user.full_name}</h3>
            <p className="text-xs text-slate-400">@{user.username}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <RatingStars rating={user.average_rating} size="sm" />
          <span className="text-xs text-slate-500">
            {user.average_rating > 0 ? user.average_rating.toFixed(1) : '—'}
            {user.reviews_count > 0 && ` (${user.reviews_count})`}
          </span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${repStyle.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${repStyle.dot}`} />
            {level}
          </span>
          <StatusBadge status={user.availability} size="sm" showIcon={false} />
        </div>

        {user.location && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
            <MapPin size={11} />
            {user.location}
          </div>
        )}

        {user.bio && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{user.bio}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
          <div className="text-center flex-1">
            <p className="text-sm font-bold text-slate-900">{user.completed_exchanges_count || 0}</p>
            <p className="text-xs text-slate-400">Exchanges</p>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div className="text-center flex-1">
            <p className="text-sm font-bold text-slate-900">{user.reputation_score?.toFixed(0) || 0}</p>
            <p className="text-xs text-slate-400">Rep. Score</p>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div className="text-center flex-1">
            <p className="text-sm font-bold text-slate-900">{user.skills_count || 0}</p>
            <p className="text-xs text-slate-400">Skills</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex gap-2">
        <Link to={`/profile/${user.id}`}
          className="flex-1 text-center py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
          View Profile
        </Link>
        {onRequestExchange && (
          <button onClick={() => onRequestExchange(user)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-white rounded-xl transition-colors hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            <ArrowLeftRight size={14} />
            Request
          </button>
        )}
      </div>
    </div>
  );
}
