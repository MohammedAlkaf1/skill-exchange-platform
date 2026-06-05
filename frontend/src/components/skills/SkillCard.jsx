import { Link } from 'react-router-dom';
import { MapPin, BarChart2, Pencil, Trash2 } from '../../lib/icons';
import StatusBadge from '../common/StatusBadge';
import RatingStars from '../common/RatingStars';

const CATEGORY_ICONS = {
  programming: '💻', graphic_design: '🎨', writing: '✍️', marketing: '📢',
  languages: '🌍', video_editing: '🎬', photography: '📷', music: '🎵',
  business: '💼', tutoring: '📚', data_analysis: '📊', ui_ux_design: '🖌️',
  social_media: '📱', other: '⭐',
};

const LEVEL_COLOR = {
  beginner:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
  advanced:     'bg-violet-50 text-violet-700 border-violet-200',
  expert:       'bg-amber-50 text-amber-700 border-amber-200',
};

export default function SkillCard({ skill, onEdit, onDelete }) {
  const icon = CATEGORY_ICONS[skill.category] || '⭐';
  const levelStyle = LEVEL_COLOR[skill.level] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="card card-hover flex flex-col">
      {/* Header */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl flex-shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-1">{skill.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{skill.category_display || skill.category?.replace(/_/g,' ')}</p>
            </div>
          </div>
          <StatusBadge status={skill.skill_type} />
        </div>

        {/* Level */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${levelStyle}`}>
            <BarChart2 size={10} />
            {skill.level_display || skill.level}
          </span>
        </div>

        {/* Description */}
        {skill.description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{skill.description}</p>
        )}
      </div>

      {/* User info (if shown) */}
      {skill.user && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2">
          {skill.user.profile_image_url ? (
            <img src={skill.user.profile_image_url} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              {skill.user.full_name?.[0]?.toUpperCase()}
            </div>
          )}
          <Link to={`/profile/${skill.user.id}`} className="text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors truncate flex-1">
            {skill.user.full_name}
          </Link>
          {skill.user.location && (
            <span className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
              <MapPin size={10} />{skill.user.location?.split(',')[0]}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className="px-5 py-3 border-t border-slate-100 flex gap-2">
          {onEdit && (
            <button onClick={() => onEdit(skill)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Pencil size={12} /> Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(skill.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              <Trash2 size={12} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
