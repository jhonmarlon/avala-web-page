// Adapted from lucide-animated (pqoqubbw): icons/check.tsx.
// See public/licenses/lucide-animated.txt. Draw once on mount, not on repeated hover.
type ConfirmationIconProps = { className?: string }

export function ConfirmationIcon({ className }: ConfirmationIconProps) {
  return (
    <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path className="icon-confirmation-stroke" d="M4 12 9 17L20 6" pathLength="1" strokeDasharray="1" strokeDashoffset="0" />
    </svg>
  )
}
