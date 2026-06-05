import { Link } from 'react-router-dom';
import { Check, X, Ban, Zap, ExternalLink, Star, ArrowRight } from '../../lib/icons';
import StatusBadge from '../common/StatusBadge';
import { useAuth } from '../../context/AuthContext';

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

export default function ExchangeCard({ exchange, onAccept, onReject, onCancel, onComplete }) {
  const { user } = useAuth();
  const isSender = user?.id === exchange.sender?.id;
  const isReceiver = user?.id === exchange.receiver?.id;
  const other = isSender ? exchange.receiver : exchange.sender;

  return (
    <div className="card card-hover overflow-hidden">
      {/* Status accent line */}
      <div className={`h-1 w-full ${
        exchange.status === 'pending'     ? 'bg-amber-400' :
        exchange.status === 'accepted'    ? 'bg-blue-500' :
        exchange.status === 'in_progress' ? 'bg-violet-500' :
        exchange.status === 'completed'   ? 'bg-emerald-500' :
        exchange.status === 'rejected'    ? 'bg-red-400' : 'bg-slate-300'
      }`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {other?.profile_image_url ? (
              <img src={other.profile_image_url} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                {other?.full_name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-900 text-sm">{other?.full_name}</p>
              <p className="text-xs text-slate-400">{isSender ? 'You sent this request' : 'Sent you a request'}</p>
            </div>
          </div>
          <StatusBadge status={exchange.status} />
        </div>

        {/* Skills exchange */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-3">
            <p className="text-xs font-medium text-blue-500 mb-1">Requesting</p>
            <p className="text-sm font-semibold text-blue-900 line-clamp-1">{exchange.requested_skill?.name || '—'}</p>
          </div>
          <ArrowRight size={16} className="text-slate-300 flex-shrink-0" />
          <div className="flex-1 bg-violet-50 border border-violet-100 rounded-xl p-3">
            <p className="text-xs font-medium text-violet-500 mb-1">Offering</p>
            <p className="text-sm font-semibold text-violet-900 line-clamp-1">{exchange.offered_skill?.name || 'Open'}</p>
          </div>
        </div>

        {exchange.message && (
          <p className="text-xs text-slate-500 italic bg-slate-50 rounded-xl px-3 py-2 mb-4 line-clamp-2">
            "{exchange.message}"
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{formatDate(exchange.created_at)}</span>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to={`/exchanges/${exchange.id}`}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50">
              <ExternalLink size={12} /> Details
            </Link>

            {isReceiver && exchange.status === 'pending' && (
              <>
                <button onClick={() => onAccept(exchange.id)}
                  className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors">
                  <Check size={12} /> Accept
                </button>
                <button onClick={() => onReject(exchange.id)}
                  className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors">
                  <X size={12} /> Reject
                </button>
              </>
            )}
            {isSender && exchange.status === 'pending' && (
              <button onClick={() => onCancel(exchange.id)}
                className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors">
                <Ban size={12} /> Cancel
              </button>
            )}
            {['accepted','in_progress'].includes(exchange.status) && (isSender || isReceiver) && (
              <button onClick={() => onComplete(exchange.id)}
                className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors">
                <Zap size={12} /> Complete
              </button>
            )}
            {exchange.status === 'completed' && exchange.can_review && (
              <Link to={`/reviews/new/${exchange.id}`}
                className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-colors">
                <Star size={12} /> Review
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
