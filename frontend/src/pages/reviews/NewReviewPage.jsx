import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Star, Send } from '../../lib/icons';
import { getExchangeById } from '../../api/exchangeApi';
import { createReview } from '../../api/reviewApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RatingStars from '../../components/common/RatingStars';
import toast from 'react-hot-toast';

export default function NewReviewPage() {
  const { exchangeId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 5, feedback: '' });

  useEffect(() => {
    getExchangeById(exchangeId).then((r) => {
      if (r.data.status !== 'completed' || !r.data.can_review) {
        toast.error(r.data.status !== 'completed' ? 'Only for completed exchanges.' : 'Already reviewed.');
        navigate('/exchanges');
      } else { setExchange(r.data); }
    }).catch(() => navigate('/exchanges'))
      .finally(() => setLoading(false));
  }, [exchangeId, navigate]);

  const reviewedUser = exchange?.sender?.id === user?.id ? exchange?.receiver : exchange?.sender;

  const ratingLabels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.feedback.trim()) { toast.error('Please write some feedback.'); return; }
    setSubmitting(true);
    try {
      await createReview({
        exchange_request_id: parseInt(exchangeId),
        reviewed_user_id: reviewedUser.id,
        rating: form.rating,
        feedback: form.feedback,
      });
      toast.success('Review submitted! 🌟');
      navigate(`/profile/${reviewedUser.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit review.');
    } finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner center size="lg" />;
  if (!exchange) return null;

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leave a Review</h1>
          <p className="text-sm text-slate-500 mt-0.5">Share your experience with this exchange</p>
        </div>
      </div>

      {/* Reviewed user */}
      {reviewedUser && (
        <div className="card p-5 flex items-center gap-4">
          {reviewedUser.profile_image_url ? (
            <img src={reviewedUser.profile_image_url} alt="" className="w-14 h-14 rounded-2xl object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              {reviewedUser.full_name?.[0]}
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-900">Reviewing {reviewedUser.full_name}</p>
            <p className="text-sm text-slate-400">For: {exchange.requested_skill?.name}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating */}
        <div className="card p-6 text-center">
          <p className="text-sm font-semibold text-slate-700 mb-4">How would you rate this exchange?</p>
          <div className="flex justify-center mb-3">
            <RatingStars rating={form.rating} size="xl" interactive onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
          </div>
          <p className={`text-sm font-semibold mt-2 ${
            form.rating >= 4 ? 'text-emerald-600' : form.rating === 3 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {ratingLabels[form.rating]}
          </p>
        </div>

        {/* Feedback */}
        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-800 mb-2">Written Feedback *</label>
          <textarea
            value={form.feedback}
            onChange={(e) => setForm((f) => ({ ...f, feedback: e.target.value }))}
            required minLength={10} rows={5}
            placeholder="Share your experience. Was the exchange helpful? Would you recommend this person? What did you learn?"
            className="input-base resize-none"
          />
          <p className="text-xs text-slate-400 mt-1.5">{form.feedback.length} characters</p>
        </div>

        <div className="flex gap-3">
          <Link to="/exchanges" className="btn btn-ghost flex-1 text-center flex items-center justify-center">Cancel</Link>
          <button type="submit" disabled={submitting || form.feedback.length < 10}
            className="btn flex-1 flex items-center justify-center gap-2 text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
            {submitting ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Send size={14} />}
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
