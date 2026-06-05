import { Star } from '../../lib/icons';

export default function RatingStars({ rating, size = 'sm', interactive = false, onChange, showValue = false }) {
  const sizePx = { sm: 13, md: 16, lg: 22, xl: 28 }[size] || 14;
  const filled = interactive ? rating : Math.round(rating || 0);

  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={() => interactive && onChange?.(star)}
          disabled={!interactive}
          className={`transition-transform ${interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'}`}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <Star
            size={sizePx}
            className={`transition-colors ${star <= filled ? 'text-amber-400' : 'text-slate-200'}`}
            fill={star <= filled ? '#FBBF24' : 'none'}
            strokeWidth={star <= filled ? 0 : 1.5}
          />
        </button>
      ))}
      {showValue && rating > 0 && (
        <span className="text-xs font-semibold text-slate-700 ml-1">{Number(rating).toFixed(1)}</span>
      )}
    </div>
  );
}
