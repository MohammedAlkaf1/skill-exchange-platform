import { Clock, Check, X, Ban, Zap, CheckCircle, Lightbulb, Target, Calendar } from '../../lib/icons';

const CONFIG = {
  pending:     { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   icon: Clock,        label: 'Pending' },
  accepted:    { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    icon: Check,        label: 'Accepted' },
  rejected:    { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     icon: X,            label: 'Rejected' },
  cancelled:   { bg: 'bg-slate-100',  text: 'text-slate-600',   border: 'border-slate-200',   icon: Ban,          label: 'Cancelled' },
  in_progress: { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  icon: Zap,          label: 'In Progress' },
  completed:   { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle,  label: 'Completed' },
  offered:     { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: Lightbulb,    label: 'Offered' },
  wanted:      { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200',  icon: Target,       label: 'Wanted' },
  available:   { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: Check,        label: 'Available' },
  busy:        { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     icon: X,            label: 'Busy' },
  weekends_only:{ bg: 'bg-amber-50',  text: 'text-amber-700',   border: 'border-amber-200',   icon: Calendar,     label: 'Weekends Only' },
};

export default function StatusBadge({ status, size = 'sm', showIcon = true }) {
  const config = CONFIG[status] || { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', label: status };
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 11 : 13;
  const padClass = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1';
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span className={`inline-flex items-center gap-1 ${padClass} rounded-full border font-medium ${config.bg} ${config.text} ${config.border} ${textClass}`}>
      {showIcon && Icon && <Icon size={iconSize} />}
      {config.label}
    </span>
  );
}
