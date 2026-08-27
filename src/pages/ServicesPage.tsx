import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ServicesPage() {
  return (
    <section className="page-container section-spacing">
      <div className="space-y-6">
        <div className="rounded-5xl border border-slate-200 bg-white p-10 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">
            Soluciones
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            Ruta lista para desarrollar el catálogo de servicios.
          </h1>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-brand-200 bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)] p-6 shadow-[0_18px_50px_rgba(8,20,39,0.08)] lg:flex lg:items-center lg:justify-between lg:gap-8 lg:p-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              Configurador inteligente
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[#0d1730] lg:text-[2rem]">
              ¿Todavía no tenés claro el alcance de tu solución?
            </h2>
            <p className="text-sm leading-7 text-slate-600 lg:text-base">
              Configurá tu proyecto y obtené una estimación preliminar de complejidad, tiempo e inversión.
            </p>
          </div>

          <div className="pt-5 lg:pt-0">
            <Button
              to="/estimar-proyecto"
              size="lg"
              className="min-w-[15rem] border-brand-500 bg-[linear-gradient(180deg,#1298ff_0%,#2555ff_100%)] text-white shadow-[0_20px_38px_rgba(37,85,255,0.24)] hover:border-[#7ab8ff]"
            >
              Estimar mi proyecto
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
