import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  FileCheck2,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Smartphone,
  Store,
  TicketCheck,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { esimExperienceLinks } from '@/config/site'
import { cn } from '@/lib/utils'
import background1 from '@/assets/background_1.png'

const customerSteps = [
  {
    title: 'Elegí cómo empezar',
    description: 'Comprá una eSIM online o activá un voucher físico adquirido en punto de venta.',
    Icon: Smartphone,
  },
  {
    title: 'Validamos tu identidad',
    description: 'Tus datos se verifican paso a paso con OTP por WhatsApp o correo.',
    Icon: ShieldCheck,
  },
  {
    title: 'Protegemos la disponibilidad',
    description: 'En compra web, reservamos inventario antes del pago para evitar sobreventa.',
    Icon: LockKeyhole,
  },
  {
    title: 'Recibís tu QR final',
    description: 'Al finalizar, te entregamos el QR de instalación de la eSIM listo para usar.',
    Icon: QrCode,
  },
]

const businessCapabilities = [
  'Inventario interno de eSIMs con consecutivos controlados.',
  'Lotes administrativos de vouchers físicos.',
  'Impresión diferida e individual de vouchers.',
  'Confirmación operativa de impresión.',
  'Validaciones por OTP y código raspable.',
  'Trazabilidad desde voucher o compra web hasta QR final.',
]

const flows = [
  {
    title: 'Comprar eSIM online',
    eyebrow: 'Compra web segura',
    description:
      'Para usuarios que llegan desde la web, sin voucher físico. El sistema valida datos, reserva inventario antes del pago y entrega el QR de instalación.',
    cta: 'Comprar eSIM',
    href: esimExperienceLinks.buy,
    Icon: CreditCard,
    tone: 'buy',
  },
  {
    title: 'Activar voucher físico',
    eyebrow: 'Ya tengo voucher',
    description:
      'Para clientes que ya tienen un voucher. El flujo valida el voucher, confirma identidad con OTP y luego solicita el código raspable.',
    cta: 'Activar voucher',
    href: esimExperienceLinks.activate,
    Icon: TicketCheck,
    tone: 'activate',
  },
]

type EsimCtaTone = 'buy' | 'activate'

type EsimFlowCtaProps = {
  href: string
  eyebrow: string
  title: string
  description: string
  Icon: LucideIcon
  tone: EsimCtaTone
}

const esimCtaToneClasses: Record<EsimCtaTone, string> = {
  buy: 'from-amber-300/35 via-brand-400/20 to-blue-500/10 text-amber-100 border-amber-300/45 shadow-[0_0_55px_rgba(251,191,36,0.22)]',
  activate:
    'from-cyan-300/35 via-brand-400/25 to-blue-500/12 text-cyan-100 border-brand-300/45 shadow-[0_0_55px_rgba(34,211,238,0.23)]',
}

const esimIconToneClasses: Record<EsimCtaTone, string> = {
  buy: 'border-amber-300/45 bg-amber-300/15 text-amber-100 shadow-[0_0_28px_rgba(251,191,36,0.24)]',
  activate:
    'border-cyan-300/45 bg-cyan-300/15 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.24)]',
}

function EsimFlowCta({ href, eyebrow, title, description, Icon, tone }: EsimFlowCtaProps) {
  return (
    <motion.a
      href={href}
      className={cn(
        'group relative isolate overflow-hidden rounded-[1.55rem] border bg-gradient-to-br p-[1px] text-left transition-colors duration-300',
        esimCtaToneClasses[tone],
      )}
      whileHover={{ y: -7, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 360, damping: 24 }}
    >
      <span className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.28),transparent_26%),radial-gradient(circle_at_88%_50%,rgba(43,179,255,0.24),transparent_32%)] opacity-75 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="absolute -right-10 -top-10 size-32 rounded-full bg-white/18 blur-2xl transition-transform duration-500 group-hover:scale-125" />

      <span className="relative flex min-h-[8.5rem] items-center gap-4 rounded-[1.48rem] bg-surface-950/82 p-4 backdrop-blur-xl sm:min-w-[17rem] sm:p-5">
        <span className="relative flex size-14 shrink-0 items-center justify-center">
          <motion.span
            aria-hidden="true"
            className={cn('absolute inset-0 rounded-2xl border', esimIconToneClasses[tone])}
            animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.04, 1] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <Icon className="relative size-6" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-slate-400">
            <Zap className="size-3 text-brand-300" />
            {eyebrow}
          </span>
          <span className="mt-1.5 block text-lg font-bold text-white">{title}</span>
          <span className="mt-1 block text-sm leading-6 text-slate-300">{description}</span>
        </span>

        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:border-brand-300/50 group-hover:bg-brand-400/15">
          <ArrowRight className="size-4" />
        </span>
      </span>
    </motion.a>
  )
}

export function EsimPage() {
  return (
    <>
      <Section
        className="relative overflow-hidden text-white"
        containerClassName="py-16 lg:py-24"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(3, 8, 20, 0.95) 0%, rgba(5, 17, 44, 0.86) 55%, rgba(18, 152, 255, 0.36) 100%), url(${background1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="grid gap-12 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/35 bg-brand-400/10 px-4 py-2 text-sm font-semibold text-brand-100 shadow-glow backdrop-blur-md">
              <Wifi className="size-4" />
              SIEMBRA eSIM · Activación digital segura
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl lg:leading-[1.03]">
                Comprá o activá tu eSIM en pocos pasos, sin complicaciones.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                SIEMBRA conecta compra web, voucher físico, validación OTP y entrega del QR final de instalación en una experiencia simple, segura y trazable.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Compra web sin voucher
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Activación con voucher físico
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                QR final de instalación
              </span>
            </div>
          </div>

          <div className="panel-dark-glass relative overflow-hidden p-6 lg:p-8">
            <div className="absolute -right-16 -top-16 size-48 rounded-full bg-brand-400/20 blur-3xl" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-200">Flujo protegido</p>
                  <h2 className="mt-2 text-2xl font-bold">Del ingreso al QR final</h2>
                </div>
                <BadgeCheck className="size-11 text-brand-400" />
              </div>

              <div className="space-y-3">
                {customerSteps.map(({ title, description, Icon }, index) => (
                  <div key={title} className="flex gap-4 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-brand-400/35 bg-brand-400/10 text-brand-200">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Paso {index + 1}</p>
                      <h3 className="mt-1 font-semibold text-white">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-[linear-gradient(180deg,#f7fbff_0%,#eef5ff_100%)]" containerClassName="py-9 lg:py-11">
        <Heading
          eyebrow="Dos entradas, una experiencia segura"
          title="SIEMBRA separa compra web y activación por voucher para que cada flujo valide lo que corresponde."
          description="No mezclamos reglas de negocio: el usuario que compra online no necesita voucher, y quien ya tiene voucher no pasa por pago. Cada camino tiene sus validaciones, estados y controles."
          showAccentLine
        />
      </Section>

      <Section className="relative overflow-hidden bg-surface-950 text-white" containerClassName="py-9 lg:py-11">
        <div className="absolute left-1/2 top-0 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-brand-400/18 blur-3xl" />
        <div className="absolute -right-32 bottom-0 size-80 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative grid gap-8 md:grid-cols-2 md:items-center lg:gap-12">
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-300">Elegí tu camino</p>
            <h2 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
              Dos acciones distintas, una misma experiencia segura.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-slate-300">
              Comprá online si todavía no tenés voucher, o activá tu voucher físico si ya lo adquiriste en un punto de venta. Cada botón inicia el flujo correcto sin mezclar validaciones.
            </p>
          </div>

          <div className="grid gap-5">
            {flows.map(({ title, eyebrow, description, cta, href, Icon, tone }) => (
              <EsimFlowCta
                key={title}
                href={href}
                eyebrow={eyebrow}
                title={cta}
                description={description}
                Icon={Icon}
                tone={tone as EsimCtaTone}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-[linear-gradient(180deg,#f7fbff_0%,#eef5ff_100%)]">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Heading
            eyebrow="Operación y trazabilidad"
            title="Una línea de negocio preparada para usuarios, tiendas y operación interna."
            description="SIEMBRA no es solo una pantalla de activación. La plataforma soporta inventario, lotes de vouchers, impresión controlada, validaciones parciales y entrega final de eSIM."
            showAccentLine
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {businessCapabilities.map((capability) => (
              <div key={capability} className="rounded-[1.4rem] border border-brand-100 bg-white p-5 shadow-[0_14px_34px_rgba(8,20,39,0.06)]">
                <FileCheck2 className="mb-4 size-6 text-brand-700" />
                <p className="text-sm leading-7 text-slate-700">{capability}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-surface-950 text-white">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">Para puntos de venta y aliados</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Voucher físico con control digital de punta a punta.</h2>
            <p className="max-w-3xl text-base leading-8 text-slate-300">
              Los vouchers pueden generarse por lote, imprimirse después y confirmarse de forma administrativa. El cliente escanea el QR del voucher, valida identidad y solo después ingresa el código raspable.
            </p>
          </div>

          <div className="panel-dark-glass p-6">
            <Store className="mb-5 size-9 text-brand-300" />
            <h3 className="text-xl font-bold">¿Sos empresa o punto de venta?</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Hablemos para activar operación con inventario, vouchers físicos y trazabilidad comercial.
            </p>
            <Button to="/contacto" className="mt-6">
              Contactar a AvalaGroup
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
