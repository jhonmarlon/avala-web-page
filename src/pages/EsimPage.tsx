import {
  BadgeCheck,
  CreditCard,
  FileCheck2,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Smartphone,
  Store,
  TicketCheck,
} from 'lucide-react'
import { MotionConfig, useReducedMotion } from 'motion/react'
import { RowHoverFill } from '@/components/fx/RowHoverFill'
import { Reveal } from '@/components/ui/Reveal'
import { CtaLink } from '@/components/fx/CtaLink'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { esimExperienceLinks } from '@/config/site'

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
    available: true,
    href: esimExperienceLinks.buy,
    Icon: CreditCard,
  },
  {
    title: 'Activar voucher físico',
    eyebrow: 'Ya tengo voucher',
    description:
      'Para clientes que ya tienen un voucher. El flujo valida el voucher, confirma identidad con OTP y luego solicita el código raspable.',
    cta: 'Disponible próximamente',
    available: false,
    href: undefined,
    Icon: TicketCheck,
  },
] as const

const staticStepVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
}

export function EsimPage() {
  const reduceMotion = useReducedMotion()

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate bg-avala-ink text-avala-paper [overflow-x:clip]">
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,black,transparent_60%)]" />
      <Section withSpacing={false} className="pt-10 pb-16 lg:pt-16 lg:pb-24">
        <header>
          <SectionLabel index="01" label="SIEMBRA eSIM · Activación digital segura" />
          <h1 className="display-tight max-w-5xl pt-12 text-title-hero text-avala-paper lg:pt-16">
            <SplitReveal text="Comprá o activá tu eSIM" stagger={0.018} play />{' '}
            <SplitReveal text="en pocos pasos, sin complicaciones." stagger={0.018} delay={0.25} play className="text-avala-neon" />
          </h1>
        </header>

        <div className="mt-12 grid gap-8 border-t border-avala-paper/15 pt-8 lg:grid-cols-12">
          <p className="text-base leading-8 text-avala-paper/75 lg:col-span-7 lg:text-lg">
            SIEMBRA conecta compra web, voucher físico, validación OTP y entrega del QR final de instalación en una experiencia simple, segura y trazable.
          </p>
          <ul className="hud-label space-y-3 lg:col-span-4 lg:col-start-9">
            <li>Compra web sin voucher</li>
            <li>Activación con voucher físico</li>
            <li className="text-avala-neon">QR final de instalación</li>
          </ul>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <BadgeCheck aria-hidden="true" className="mb-4 size-6 text-avala-neon" />
            <p className="hud-label">Flujo protegido</p>
            <h2 className="mt-2 display-tight text-2xl">Del ingreso al QR final</h2>
          </div>
          <ol className="border-t border-avala-paper/15 lg:col-span-7 lg:col-start-6">
            {customerSteps.map(({ title, description, Icon }, index) => (
              <li key={title} className="border-b border-avala-paper/15">
                <Reveal
                  className="group relative isolate grid grid-cols-[4rem_1fr] gap-x-3 overflow-hidden py-5"
                  variants={reduceMotion ? staticStepVariants : undefined}
                  delay={reduceMotion ? 0 : index * 0.06}
                >
                  <RowHoverFill />
                  <span className="hud-label tabular pt-1 text-avala-neon transition-colors duration-500 group-hover:text-avala-ink motion-reduce:transition-none">Paso {index + 1}</span>
                  <div>
                    <h3 className="display-tight flex items-center gap-3 text-xl transition-[color,transform] duration-500 motion-safe:group-hover:translate-x-3 group-hover:text-avala-ink motion-reduce:transition-none">
                      <Icon aria-hidden="true" className="size-4 shrink-0 text-avala-neon transition-colors duration-500 group-hover:text-avala-ink motion-reduce:transition-none" />
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-avala-paper/75 transition-colors duration-500 group-hover:text-avala-ink/80 motion-reduce:transition-none">{description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section withSpacing={false} className="pb-12 lg:pb-20">
        <div className="space-y-5">
          <SectionLabel index="02" label="Dos entradas, una experiencia segura" />
          <h2 className="max-w-4xl display-tight text-2xl sm:text-3xl">
            SIEMBRA separa compra web y activación por voucher para que cada flujo valide lo que corresponde.
          </h2>
          <p className="max-w-3xl text-base leading-8 text-avala-paper/75">
            No mezclamos reglas de negocio: el usuario que compra online no necesita voucher, y quien ya tiene voucher no pasa por pago. Cada camino tiene sus validaciones, estados y controles.
          </p>
        </div>
      </Section>

      <Section withSpacing={false} className="pb-16 lg:pb-24">
        <div className="grid gap-10">
          <div className="space-y-4">
            <SectionLabel index="03" label="Elegí tu camino" />
            <h2 className="max-w-xl display-tight text-2xl sm:text-3xl">
              Dos acciones distintas, una misma experiencia segura.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-avala-paper/75">
              Comprá online si todavía no tenés voucher, o activá tu voucher físico si ya lo adquiriste en un punto de venta. Cada botón inicia el flujo correcto sin mezclar validaciones.
            </p>
          </div>

          <ol className="border-t border-avala-paper/15">
            {flows.map(({ title, eyebrow, description, cta, available, href, Icon }, index) => (
              <li key={title} className="grid gap-5 border-b border-avala-paper/15 py-6 sm:grid-cols-[2.5rem_1fr] lg:grid-cols-[2.5rem_1fr_auto] lg:items-center">
                <span className="hud-label tabular text-avala-neon">0{index + 1}</span>
                <div>
                  <p className="hud-label flex items-center gap-3">
                    <Icon aria-hidden="true" className="size-4 text-avala-neon" />{eyebrow}
                  </p>
                  <h3 className="mt-2 display-tight text-xl">{title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-avala-paper/75">{description}</p>
                </div>
                {available ? (
                  <CtaLink href={href} className="sm:col-start-2 lg:col-start-3 lg:min-w-56">{cta}</CtaLink>
                ) : (
                  <Button type="button" disabled variant="outline" className="sm:col-start-2 lg:col-start-3 lg:min-w-56">
                    {cta}
                  </Button>
                )}
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section withSpacing={false} className="pb-16 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-5">
            <SectionLabel index="04" label="Operación y trazabilidad" />
            <h2 className="display-tight text-2xl sm:text-3xl">
              Una línea de negocio preparada para usuarios, tiendas y operación interna.
            </h2>
            <p className="text-base leading-8 text-avala-paper/75">
              SIEMBRA no es solo una pantalla de activación. La plataforma soporta inventario, lotes de vouchers, impresión controlada, validaciones parciales y entrega final de eSIM.
            </p>
          </div>

          <div className="grid gap-x-6 sm:grid-cols-2">
            {businessCapabilities.map((capability) => (
              <div key={capability} className="flex gap-3 border-t border-avala-paper/15 py-5">
                <FileCheck2 aria-hidden="true" className="mt-1 size-4 shrink-0 text-avala-neon" />
                <p className="text-sm leading-7 text-avala-paper/75">{capability}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section withSpacing={false} className="pb-16 lg:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div className="space-y-4">
            <SectionLabel index="05" label="Para puntos de venta y aliados" />
            <h2 className="display-tight text-2xl sm:text-3xl">Voucher físico con control digital de punta a punta.</h2>
            <p className="max-w-3xl text-base leading-8 text-avala-paper/75">
              Los vouchers pueden generarse por lote, imprimirse después y confirmarse de forma administrativa. El cliente escanea el QR del voucher, valida identidad y solo después ingresa el código raspable.
            </p>
          </div>

          <div className="border-t border-avala-paper/15 pt-6 lg:pl-8">
            <Store aria-hidden="true" className="mb-5 size-7 text-avala-neon" />
            <h3 className="text-xl font-semibold">¿Sos empresa o punto de venta?</h3>
            <p className="mt-3 text-sm leading-7 text-avala-paper/75">
              Hablemos para activar operación con inventario, vouchers físicos y trazabilidad comercial.
            </p>
            <CtaLink to="/contacto" variant="line" className="mt-6">
              Contactar a AvalaGroup
            </CtaLink>
          </div>
        </div>
      </Section>
      </div>
    </MotionConfig>
  )
}
