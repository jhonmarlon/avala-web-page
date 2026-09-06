import { ArrowRight, Construction, QrCode, ShieldCheck, Smartphone, TicketCheck } from 'lucide-react'
import { useLocation } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import underConstructionImage from '@/assets/background_view_under_construction.png'

const pageContent = {
  buy: {
    eyebrow: 'Compra web SIEMBRA',
    title: 'La compra online de eSIM estará disponible próximamente.',
    description:
      'Estamos preparando una experiencia segura para comprar, validar tus datos, reservar inventario y recibir el QR final de instalación sin fricción.',
    Icon: Smartphone,
    badge: 'Compra eSIM',
  },
  activate: {
    eyebrow: 'Activación por voucher',
    title: 'La activación de voucher estará disponible próximamente.',
    description:
      'Muy pronto vas a poder escanear tu voucher físico, validar tu identidad con OTP y completar la activación hasta recibir el QR final.',
    Icon: TicketCheck,
    badge: 'Activar voucher',
  },
}

export function EsimComingSoonPage() {
  const { pathname } = useLocation()
  const content = pathname.includes('activar') ? pageContent.activate : pageContent.buy
  const Icon = content.Icon

  return (
    <>
      <Section
        className="relative min-h-[calc(100svh-5rem)] overflow-hidden text-white"
        containerClassName="py-14 lg:py-20"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(3, 8, 20, 0.94) 0%, rgba(5, 17, 44, 0.86) 42%, rgba(5, 17, 44, 0.5) 68%, rgba(3, 8, 20, 0.24) 100%), linear-gradient(180deg, rgba(3, 8, 20, 0.25) 0%, rgba(3, 8, 20, 0.72) 100%), url(${underConstructionImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute left-1/4 top-10 h-72 w-[34rem] -translate-x-1/2 rounded-full bg-brand-400/18 blur-3xl" />

        <div className="relative flex min-h-[calc(100svh-12rem)] items-center">
          <div className="max-w-3xl rounded-[2rem] border border-white/12 bg-surface-950/72 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-7 lg:p-9">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-300/35 bg-brand-400/10 px-4 py-2 text-sm font-semibold text-brand-100 shadow-glow backdrop-blur-md">
              <Construction className="size-4" />
              Vista en construcción
            </div>

            <div className="mt-7 space-y-5">
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-brand-300">
                <Icon className="size-4" />
                {content.eyebrow}
              </p>
              <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl lg:leading-[1.03]">
                {content.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">{content.description}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <ShieldCheck className="size-4 text-brand-300" />
                Validación segura
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <QrCode className="size-4 text-brand-300" />
                QR final de instalación
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mt-3">
              <Button to="/esim" size="lg">
                Volver a SIEMBRA eSIM
                <ArrowRight className="size-4" />
              </Button>
              <Button to="/contacto" variant="secondary" size="lg">
                Quiero que me avisen
              </Button>
            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-md">
              <p className="text-sm font-bold text-white">Estamos afinando esta experiencia.</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                La vista será funcional cuando estén listos los pasos transaccionales completos.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
