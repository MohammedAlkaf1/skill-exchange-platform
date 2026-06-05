const colorConfig = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   icon_bg: 'bg-blue-100' },
  green:  { bg: 'bg-emerald-50',text: 'text-emerald-600',icon_bg: 'bg-emerald-100' },
  purple: { bg: 'bg-violet-50', text: 'text-violet-600', icon_bg: 'bg-violet-100' },
  orange: { bg: 'bg-amber-50',  text: 'text-amber-600',  icon_bg: 'bg-amber-100' },
  teal:   { bg: 'bg-teal-50',   text: 'text-teal-600',   icon_bg: 'bg-teal-100' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon_bg: 'bg-indigo-100' },
  red:    { bg: 'bg-red-50',    text: 'text-red-600',    icon_bg: 'bg-red-100' },
};

export default function DashboardStatCard({ title, value, icon: Icon, color = 'blue', subtitle, trend }) {
  const cfg = colorConfig[color] || colorConfig.blue;

  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${cfg.icon_bg} flex items-center justify-center`}>
          {Icon && <Icon size={20} className={cfg.text} />}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-0.5">{value}</p>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}
