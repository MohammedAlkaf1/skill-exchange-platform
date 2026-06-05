import { Loader2 } from '../../lib/icons';
import Logo from './Logo';

export default function LoadingSpinner({ size = 'md', center = false, text }) {
  const sizes = { sm: 16, md: 24, lg: 36, xl: 48 };
  const px = sizes[size] || 24;

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={px} className="animate-spin text-blue-600" />
      {text && <p className="text-sm text-slate-500 font-medium">{text}</p>}
    </div>
  );

  if (center) {
    return (
      <div className="flex items-center justify-center py-20">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-3 w-5/6" />
      <div className="skeleton h-8 w-1/3" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-5">
        <Logo variant="icon" size="xl" />
        <div className="flex items-center gap-2">
          <Loader2 size={18} className="animate-spin text-blue-600" />
          <p className="text-sm text-slate-500 font-medium">Loading SkillExchange...</p>
        </div>
      </div>
    </div>
  );
}
