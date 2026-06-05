import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Search, Filter } from '../../lib/icons';
import { getSentExchanges, getReceivedExchanges, acceptExchange, rejectExchange, cancelExchange, completeExchange } from '../../api/exchangeApi';
import ExchangeCard from '../../components/exchanges/ExchangeCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const STATUS_FILTERS = ['all','pending','accepted','in_progress','completed','rejected','cancelled'];

export default function ExchangesPage() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('received');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const [s, r] = await Promise.all([getSentExchanges(), getReceivedExchanges()]);
        setSent(Array.isArray(s.data) ? s.data : (s.data.results || []));
        setReceived(Array.isArray(r.data) ? r.data : (r.data.results || []));
      } catch { toast.error('Failed to load exchanges.'); }
      setLoading(false);
    })();
  }, []);

  const update = (id, updater) => {
    setSent((prev) => prev.map((e) => e.id === id ? updater(e) : e));
    setReceived((prev) => prev.map((e) => e.id === id ? updater(e) : e));
  };

  const action = (fn, msg, errMsg) => async (id) => {
    try { const res = await fn(id); update(id, () => res.data); toast.success(msg); }
    catch (err) { toast.error(err.response?.data?.detail || errMsg); }
  };

  const handleAccept  = action(acceptExchange,   'Exchange accepted! 🎉', 'Failed to accept.');
  const handleReject  = action(rejectExchange,   'Exchange rejected.', 'Failed to reject.');
  const handleComplete= action(completeExchange, 'Exchange completed! Leave a review.', 'Failed to complete.');
  const handleCancel  = async (id) => {
    if (!window.confirm('Cancel this request?')) return;
    action(cancelExchange, 'Request cancelled.', 'Failed to cancel.')(id);
  };

  const current = tab === 'received' ? received : sent;
  const filtered = statusFilter === 'all' ? current : current.filter((e) => e.status === statusFilter);
  const pendingR = received.filter((e) => e.status === 'pending').length;

  if (loading) return <LoadingSpinner center size="lg" />;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Exchanges</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your skill exchange requests</p>
        </div>
        <Link to="/search" className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto">
          <Search size={14} /> Find a Match
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {[
          { key: 'received', label: 'Received', count: received.length, badge: pendingR },
          { key: 'sent',     label: 'Sent',     count: sent.length },
        ].map((t) => (
          <button key={t.key} onClick={() => { setTab(t.key); setStatusFilter('all'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {t.label} <span className="text-xs opacity-70">({t.count})</span>
            {t.badge > 0 && (
              <span className="text-xs font-bold px-1.5 py-0.5 bg-red-500 text-white rounded-full">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
              statusFilter === s ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}>
            {s === 'all' ? 'All' : s.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase())}
            {s !== 'all' && (
              <span className="ml-1.5 opacity-60">
                ({(tab === 'received' ? received : sent).filter((e) => e.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title={statusFilter === 'all' ? 'No exchanges yet' : `No ${statusFilter} exchanges`}
          description={statusFilter === 'all' ? 'Browse skills and send your first exchange request.' : 'No exchanges match this status.'}
          action={statusFilter === 'all' && (
            <Link to="/search" className="btn btn-primary btn-sm flex items-center gap-1.5">
              <Search size={14} /> Browse Skills
            </Link>
          )}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((ex) => (
            <ExchangeCard key={ex.id} exchange={ex}
              onAccept={handleAccept} onReject={handleReject}
              onCancel={handleCancel} onComplete={handleComplete} />
          ))}
        </div>
      )}
    </div>
  );
}
