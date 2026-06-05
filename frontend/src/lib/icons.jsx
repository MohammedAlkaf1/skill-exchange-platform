import '@flaticon/flaticon-uicons/css/regular/rounded.css';

function fi(cls) {
  return function FlatIcon({ size = 16, className = '', style, strokeWidth, ...rest }) {
    return (
      <i
        className={`fi ${cls}${className ? ` ${className}` : ''}`}
        style={{ fontSize: size, lineHeight: 1, flexShrink: 0, ...style }}
        aria-hidden="true"
      />
    );
  };
}

export const ArrowLeftRight    = fi('fi-rr-arrows-h');
export const ArrowRight        = fi('fi-rr-arrow-right');
export const BarChart2         = fi('fi-rr-chart-histogram');
export const Ban               = fi('fi-rr-ban');
export const Bell              = fi('fi-rr-bell');
export const BookOpen          = fi('fi-rr-book-open-cover');
export const Calendar          = fi('fi-rr-calendar');
export const Camera            = fi('fi-rr-camera');
export const Check             = fi('fi-rr-check');
export const CheckCheck        = fi('fi-rr-check-double');
export const CheckCircle       = fi('fi-rr-check-circle');
export const CheckCircle2      = fi('fi-rr-check-circle');
export const ChevronDown       = fi('fi-rr-angle-down');
export const ChevronLeft       = fi('fi-rr-angle-left');
export const ChevronRight      = fi('fi-rr-angle-right');
export const Circle            = fi('fi-rr-circle');
export const Clock             = fi('fi-rr-clock');
export const ExternalLink      = fi('fi-rr-arrow-up-right-from-square');
export const Eye               = fi('fi-rr-eye');
export const EyeOff            = fi('fi-rr-eye-crossed');
export const Filter            = fi('fi-rr-filter');
export const Globe             = fi('fi-rr-globe');
export const Heart             = fi('fi-rr-heart');
export const LayoutDashboard   = fi('fi-rr-layout-fluid');
export const Lightbulb         = fi('fi-rr-bulb');
export const Loader2           = fi('fi-rr-spinner');
export const LogIn             = fi('fi-rr-sign-in-alt');
export const LogOut            = fi('fi-rr-sign-out-alt');
export const MapPin            = fi('fi-rr-map-marker');
export const Menu              = fi('fi-rr-menu-burger');
export const MessageCircle     = fi('fi-rr-comment');
export const Pencil            = fi('fi-rr-pencil');
export const Plus              = fi('fi-rr-plus');
export const Save              = fi('fi-rr-disk');
export const Search            = fi('fi-rr-search');
export const Send              = fi('fi-rr-paper-plane');
export const Settings          = fi('fi-rr-settings');
export const Share2            = fi('fi-rr-share');
export const Shield            = fi('fi-rr-shield');
export const SlidersHorizontal = fi('fi-rr-settings-sliders');
export const Sparkles          = fi('fi-rr-sparkles');
export const Star              = fi('fi-rr-star');
export const Target            = fi('fi-rr-target');
export const Trash2            = fi('fi-rr-trash');
export const TrendingUp        = fi('fi-rr-arrow-trend-up');
export const Trophy            = fi('fi-rr-trophy');
export const User              = fi('fi-rr-user');
export const UserPlus          = fi('fi-rr-user-add');
export const Users             = fi('fi-rr-users');
export const X                 = fi('fi-rr-cross');
export const Zap               = fi('fi-rr-bolt');
