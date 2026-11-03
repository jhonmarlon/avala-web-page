// Parent owns group, relative positioning, isolation and overflow clipping.
export function RowHoverFill({ active = false }: { active?: boolean } = {}) {
  const classes = 'pointer-events-none absolute inset-0 -z-10 origin-bottom scale-y-0 bg-avala-neon transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100 motion-reduce:transition-none'

  return (
    <span aria-hidden="true" className={active ? `${classes} group-active:scale-y-100` : classes} />
  )
}
