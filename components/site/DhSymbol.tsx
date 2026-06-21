/**
 * UAE Dirham symbol — official 2024 mark (stylized "D" with two horizontal
 * strokes). Rendered as inline SVG so it shows consistently across browsers
 * and fonts, regardless of whether Unicode U+1EC85 has glyph coverage.
 *
 * Sized as `1em` so it scales with surrounding text. Inherits color via
 * `currentColor` — wrap in any color class.
 */

export function DhSymbol({
  className = '',
  label = 'UAE Dirham',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="9"
      strokeLinecap="square"
      strokeLinejoin="miter"
      role="img"
      aria-label={label}
      className={`inline-block h-[0.9em] w-[0.9em] align-[-0.05em] ${className}`.trim()}
    >
      {/* Vertical stem of "D" */}
      <path d="M22 14 V86" />
      {/* Curved bowl of "D" — connects top of stem, sweeps right, returns to bottom */}
      <path d="M22 14 H48 C70 14 84 30 84 50 C84 70 70 86 48 86 H22" />
      {/* Two horizontal strokes (distinguishing marks) */}
      <path d="M6 38 H78" />
      <path d="M6 62 H78" />
    </svg>
  );
}
