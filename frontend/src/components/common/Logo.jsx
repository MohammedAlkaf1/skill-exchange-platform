import { useId } from 'react';

/**
 * SkillExchange Logo Component
 *
 * variant:
 *   "full"  — icon + dark wordmark  (default, for light backgrounds)
 *   "icon"  — icon only             (sidebar collapsed, loading screen)
 *   "light" — icon + white wordmark (for dark backgrounds, footer, hero)
 *   "dark"  — alias for "full"
 *
 * size:
 *   "xs" | "sm" | "md" (default) | "lg" | "xl"
 */

const SIZES = {
  xs: { icon: 22, font: 12, gap: 6 },
  sm: { icon: 28, font: 14, gap: 8 },
  md: { icon: 32, font: 15, gap: 9 },
  lg: { icon: 38, font: 17, gap: 10 },
  xl: { icon: 48, font: 20, gap: 12 },
};

function ExchangeIcon({ px, gradId }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      {/* Rounded square background */}
      <rect width="40" height="40" rx="10" fill={`url(#${gradId})`} />

      {/* Upper exchange arrow — left → over top → right, arrowhead at right pointing down */}
      <path
        d="M10 20 C10 8 30 8 30 20"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M27 17 L30 21 L33 17"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Lower exchange arrow — right → under bottom → left, arrowhead at left pointing up */}
      <path
        d="M30 20 C30 32 10 32 10 20"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M13 23 L10 19 L7 23"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Center 4-pointed diamond spark */}
      <path d="M20 16.5 L21.5 19.5 L20 22.5 L18.5 19.5 Z" fill="white" opacity="0.95" />
      <path d="M16.5 20 L19.5 18.5 L22.5 20 L19.5 21.5 Z" fill="white" opacity="0.95" />
    </svg>
  );
}

export default function Logo({
  variant = 'full',
  size = 'md',
  className = '',
  style = {},
}) {
  const rawId = useId();
  const gradId = `se-logo-${rawId.replace(/:/g, '')}`;
  const cfg = SIZES[size] || SIZES.md;
  const isLight = variant === 'light';
  const iconOnly = variant === 'icon';

  if (iconOnly) {
    return (
      <div className={className} style={style}>
        <ExchangeIcon px={cfg.icon} gradId={gradId} />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center ${className}`}
      style={{ gap: cfg.gap, flexShrink: 0, userSelect: 'none', ...style }}
    >
      <ExchangeIcon px={cfg.icon} gradId={gradId} />
      <span style={{ lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: cfg.font,
            fontWeight: 500,
            color: isLight ? 'rgba(255,255,255,0.75)' : '#6B7280',
            letterSpacing: '-0.01em',
          }}
        >
          Skill
        </span>
        <span
          style={{
            fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: cfg.font,
            fontWeight: 700,
            color: isLight ? '#FFFFFF' : '#0F172A',
            letterSpacing: '-0.02em',
          }}
        >
          Exchange
        </span>
      </span>
    </div>
  );
}
