import type { ReactNode } from 'react'

type LegacyPlaceholderPageProps = {
  label: string
  title: string
  children?: ReactNode
}

export function LegacyPlaceholderPage({ label, title, children }: LegacyPlaceholderPageProps) {
  const placeholder = (
    <div className="rounded-5xl border border-slate-200 bg-white p-10 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">
        {label}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
        {title}
      </h1>
    </div>
  )

  return (
    <section className="page-container section-spacing">
      {children ? <div className="space-y-6">{placeholder}{children}</div> : placeholder}
    </section>
  )
}
