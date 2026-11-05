// Adapted from lucide-animated (pqoqubbw): icons/terminal.tsx.
// See public/licenses/lucide-animated.txt. Parent-link CSS replaces the original looping hover animation.
type TerminalIconProps = { className?: string }

export function TerminalIcon({ className }: TerminalIconProps) {
  return (
    <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line className="icon-terminal-cursor" x1="12" x2="20" y1="19" y2="19" />
    </svg>
  )
}
