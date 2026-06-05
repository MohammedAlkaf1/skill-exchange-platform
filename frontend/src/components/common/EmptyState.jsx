import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
        {Icon ? (
          <Icon size={28} className="text-slate-400" />
        ) : (
          <span className="text-3xl">📭</span>
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">{description}</p>
      )}
      {action && action}
    </div>
  );
}
