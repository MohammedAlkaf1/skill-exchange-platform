import { Link } from 'react-router-dom';
import RatingStars from '../common/RatingStars';
import { Calendar } from '../../lib/icons';

export default function ReviewCard({ review }) {
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="card p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {review.reviewer?.profile_image_url ? (
            <img src={review.reviewer.profile_image_url} alt=""
              className="w-11 h-11 rounded-xl object-cover border border-slate-100" />
          ) : (
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              {review.reviewer?.full_name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <Link to={`/profile/${review.reviewer?.id}`}
                className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                {review.reviewer?.full_name}
              </Link>
              <div className="flex items-center gap-2 mt-0.5">
                <RatingStars rating={review.rating} size="sm" />
                <span className="text-xs font-semibold text-amber-600">{review.rating}/5</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
              <Calendar size={11} />
              {formatDate(review.created_at)}
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{review.feedback}</p>
        </div>
      </div>
    </div>
  );
}
