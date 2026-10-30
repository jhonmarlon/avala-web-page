import { scrollToTarget } from '@/lib/smooth-scroll'

type SectionContinueProps = {
  targetId: string
}

export function SectionContinue({ targetId }: SectionContinueProps) {
  const continueToSection = () => {
    const target = document.getElementById(targetId)
    if (!target) return

    const offset = (document.querySelector('header')?.getBoundingClientRect().height ?? 0) + 8
    // Native scrolling reads this margin; Lenis receives the same measured offset.
    target.style.scrollMarginTop = `${offset}px`
    scrollToTarget(`#${targetId}`, offset)
  }

  return (
    <div className="flex justify-end pt-3">
      <button
        type="button"
        onClick={continueToSection}
        className="hud-label inline-flex min-h-11 min-w-11 items-center justify-center gap-3 px-2 text-avala-paper/70 hover:text-avala-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-avala-neon"
      >
        Continuar
        <span aria-hidden="true" className="relative block h-6 w-px bg-avala-paper/20">
          <span className="absolute inset-x-0 bottom-0 h-3 bg-avala-neon" />
        </span>
      </button>
    </div>
  )
}
