import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight, Check, X, Ban, Zap, Star, Clock, CheckCircle } from '../../lib/icons';
import { getExchangeById, acceptExchange, rejectExchange, cancelExchange, completeExchange } from '../../api/exchangeApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';

const fmt = (d) => d ? new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export default function ExchangeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExchangeById(id)
      .then((r) => setExchange(r.data))
      .catch(() => { toast.error('Exchange not found.'); navigate('/exchanges'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action) => {
    try {
      const fns = { accept: acceptExchange, reject: rejectExchange, cancel: cancelExchange, complete: completeExchange };
      const msgs = { accept: '✅ Exchange accepted!', reject: 'Exchange rejected.', cancel: 'Request cancelled.', complete: '🎉 Exchange completed!' };
      const res = await fns[action](id);
      setExchange(res.data);
      toast.success(msgs[action]);
    } catch (err) { toast.error(err.response?.data?.detail || 'Action failed.'); }
  };

  if (loading) return <LoadingSpinner center size="lg" />;
  if (!exchange) return null;

  const isSender = user?.id === exchange.sender?.id;
  const isReceiver = user?.id === exchange.receiver?.id;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Exchange Details</h1>
        </div>
        <StatusBadge status={exchange.status} size="sm" />
      </div>

      {/* Parties card */}
      <div className="card p-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          {[exchange.sender, exchange.receiver].map((person, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1 text-center">
              {person?.profile_image_url ? (
                <img src={person.profile_image_url} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100" />
              ) : (
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl border-2 border-white shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${i === 0 ? '#2563EB, #7C3AED' : '#7C3AED, #EC4899'})` }}>
                  {person?.full_name?.[0]}
                </div>
              )}
              <Link to={`/profile/${person?.id}`} className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                {person?.full_name}
              </Link>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{i === 0 ? 'Sender' : 'Receiver'}</span>
            </div>
          ))}
          <div className="flex-shrink-0">
            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
              <ArrowRight size={16} className="text-slate-400" />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-500 mb-1">Requested Skill</p>
            <p className="font-semibold text-blue-900 text-sm">{exchange.requested_skill?.name}</p>
            <p className="text-xs text-blue-600 mt-1 opacity-70">{exchange.requested_skill?.level} · {exchange.requested_skill?.category_display}</p>
          </div>
          {exchange.offered_skill ? (
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-violet-500 mb-1">Offered In Return</p>
              <p className="font-semibold text-violet-900 text-sm">{exchange.offered_skill.name}</p>
              <p className="text-xs text-violet-600 mt-1 opacity-70">{exchange.offered_skill.level} · {exchange.offered_skill.category_display}</p>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-center">
              <p className="text-xs text-slate-400 text-center">No specific skill offered</p>
            </div>
          )}
        </div>

        {/* Message */}
        {exchange.message && (
          <div className="bg-slate-50 rounded-xl p-4 mb-5">
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Message</p>
            <p className="text-sm text-slate-700 leading-relaxed italic">"{exchange.message}"</p>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-2">
          {[
            { label: 'Created', value: fmt(exchange.created_at), icon: Clock },
            { label: 'Last Updated', value: fmt(exchange.updated_at), icon: Clock },
            ...(exchange.completed_at ? [{ label: 'Completed', value: fmt(exchange.completed_at), icon: CheckCircle, green: true }] : []),
          ].map(({ label, value, icon: Icon, green }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className={`flex items-center gap-1.5 ${green ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                <Icon size={12} /> {label}
              </span>
              <span className={green ? 'text-emerald-600 font-semibold' : 'text-slate-600'}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {isReceiver && exchange.status === 'pending' && (
          <>
            <button onClick={() => handleAction('accept')} className="btn btn-success flex-1 flex items-center justify-center gap-1.5">
              <Check size={15} /> Accept
            </button>
            <button onClick={() => handleAction('reject')} className="btn btn-danger flex-1 flex items-center justify-center gap-1.5">
              <X size={15} /> Reject
            </button>
          </>
        )}
        {isSender && exchange.status === 'pending' && (
          <button onClick={() => handleAction('cancel')} className="btn btn-ghost flex-1 flex items-center justify-center gap-1.5 border border-slate-200">
            <Ban size={15} /> Cancel Request
          </button>
        )}
        {['accepted','in_progress'].includes(exchange.status) && (isSender || isReceiver) && (
          <button onClick={() => handleAction('complete')} className="btn btn-primary flex-1 flex items-center justify-center gap-1.5">
            <Zap size={15} /> Mark as Completed
          </button>
        )}
        {exchange.status === 'completed' && exchange.can_review && (
          <Link to={`/reviews/new/${exchange.id}`}
            className="btn flex-1 flex items-center justify-center gap-1.5 text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
            <Star size={15} /> Leave a Review
          </Link>
        )}
      </div>
    </div>
  );
}
