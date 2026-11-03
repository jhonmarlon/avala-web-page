import {
  BadgeCheck,
  CreditCard,
  FileCheck2,
  Layers,
  NotebookText,
  Printer,
  ShieldAlert,
  Workflow,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Smartphone,
  Store,
  TicketCheck,
} from 'lucide-react'
import { motion, MotionConfig, useReducedMotion } from 'motion/react'
import { NumberedStepSequence } from '@/components/ui/NumberedStepSequence'
import { CtaLink } from '@/components/fx/CtaLink'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
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
  { title: 'Inventario interno de eSIMs con consecutivos controlados.', Icon: NotebookText },
  { title: 'Lotes administrativos de vouchers físicos.', Icon: Layers },
  { title: 'Impresión diferida e individual de vouchers.', Icon: Printer },
  { title: 'Confirmación operativa de impresión.', Icon: FileCheck2 },
  { title: 'Validaciones por OTP y código raspable.', Icon: ShieldAlert },
  { title: 'Trazabilidad desde voucher o compra web hasta QR final.', Icon: Workflow },
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

export function EsimPage() {
  const reducedMotion = useReducedMotion()
  const entrance = {
    initial: reducedMotion ? false as const : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: reducedMotion ? 0 : 0.7, delay: 0, ease: [0.76, 0, 0.24, 1] as const },
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate bg-avala-ink text-avala-paper [overflow-x:clip]">
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,black,transparent_60%)]" />
      <section className="pt-10 lg:pt-16">
        <div className="page-container">
        <header>
          <SectionLabel index="01" label="SIEMBRA eSIM · Activación digital segura" />
          <h1 className="display-tight max-w-5xl pt-12 text-title-hero text-avala-paper lg:pt-16">
            <SplitReveal text="Comprá o activá tu eSIM" stagger={0.018} play />{' '}
            <SplitReveal text="en pocos pasos, sin complicaciones." stagger={0.018} delay={0.25} play className="text-avala-neon" />
          </h1>
        </header>

        <motion.div {...entrance} className="mt-12 grid gap-8 border-t border-avala-paper/15 pt-8 lg:grid-cols-12">
          <p className="text-base leading-8 text-avala-paper/75 lg:col-span-7 lg:text-lg">
            SIEMBRA conecta compra web, voucher físico, validación OTP y entrega del QR final de instalación en una experiencia simple, segura y trazable.
          </p>
          <ul className="hud-label space-y-3 lg:col-span-4 lg:col-start-9">
            <li>Compra web sin voucher</li>
            <li>Activación con voucher físico</li>
            <li className="text-avala-neon">QR final de instalación</li>
          </ul>
        </motion.div>

        </div>
        <div className="mt-12 pb-6 lg:pb-10">
          <NumberedStepSequence
            compactTrack
            ordered
            steps={customerSteps.map((step, index) => ({ ...step, label: `Paso ${index + 1}` }))}
            intro={
              <div className="flex shrink-0 flex-col justify-center gap-4 py-6 lg:w-[min(42vw,36rem)] lg:pr-8">
                <BadgeCheck aria-hidden="true" className="size-6 text-avala-neon" />
                <p className="hud-label">Flujo protegido</p>
                <h2 className="display-tight text-2xl">Del ingreso al QR final</h2>
              </div>
            }
          />
        </div>
      </section>

      <Section withSpacing={false} className="pb-12 lg:pb-20">
        <motion.div {...entrance} className="space-y-5">
          <SectionLabel index="02" label="Dos entradas, una experiencia segura" />
          <h2 className="max-w-4xl display-tight text-2xl sm:text-3xl">
            SIEMBRA separa compra web y activación por voucher para que cada flujo valide lo que corresponde.
          </h2>
          <p className="max-w-3xl text-base leading-8 text-avala-paper/75">
            No mezclamos reglas de negocio: el usuario que compra online no necesita voucher, y quien ya tiene voucher no pasa por pago. Cada camino tiene sus validaciones, estados y controles.
          </p>
        </motion.div>
      </Section>

      <Section withSpacing={false} className="pb-16 lg:pb-24">
        <div className="grid gap-10">
          <motion.div {...entrance} className="space-y-4">
            <SectionLabel index="03" label="Elegí tu camino" />
            <h2 className="max-w-xl display-tight text-2xl sm:text-3xl">
              Dos acciones distintas, una misma experiencia segura.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-avala-paper/75">
              Comprá online si todavía no tenés voucher, o activá tu voucher físico si ya lo adquiriste en un punto de venta. Cada botón inicia el flujo correcto sin mezclar validaciones.
            </p>
          </motion.div>

          <ol className="border-t border-avala-paper/15">
            {flows.map(({ title, eyebrow, description, cta, available, href, Icon }, index) => (
              <motion.li key={title} {...entrance} transition={{ ...entrance.transition, delay: reducedMotion ? 0 : Math.min(index, 4) * 0.08 }} className="grid gap-5 border-b border-avala-paper/15 py-6 sm:grid-cols-[2.5rem_1fr] lg:grid-cols-[2.5rem_1fr_auto] lg:items-center">
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
              </motion.li>
            ))}
          </ol>
        </div>
      </Section>

      <Section withSpacing={false} className="pb-16 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <motion.div {...entrance} className="space-y-5">
            <SectionLabel index="04" label="Operación y trazabilidad" />
            <h2 className="display-tight text-2xl sm:text-3xl">
              Una línea de negocio preparada para usuarios, tiendas y operación interna.
            </h2>
            <p className="text-base leading-8 text-avala-paper/75">
              SIEMBRA no es solo una pantalla de activación. La plataforma soporta inventario, lotes de vouchers, impresión controlada, validaciones parciales y entrega final de eSIM.
            </p>
          </motion.div>

          <ul aria-label="Capacidades operativas" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {businessCapabilities.map(({ title, Icon }, index) => (
              <motion.li key={title} {...entrance} transition={{ ...entrance.transition, delay: reducedMotion ? 0 : Math.min(index, 4) * 0.08 }} className="min-w-0">
                <Card
                  surface="ink"
                  className="h-full min-w-0 motion-safe:transition-[transform,translate,background-color,border-color] motion-safe:duration-300 [@media(any-hover:hover)]:hover:border-avala-neon/45 [@media(any-hover:hover)]:hover:bg-avala-neon/10 motion-safe:[@media(any-hover:hover)]:hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-[1rem] bg-white/5">
                      <Icon aria-hidden="true" className="size-6 text-avala-neon" strokeWidth={1.8} />
                    </span>
                    <span aria-hidden="true" className="hud-label tabular">0{index + 1}</span>
                  </div>
                  <h3 className="text-sm font-medium leading-7 wrap-break-word">{title}</h3>
                </Card>
              </motion.li>
            ))}
          </ul>
        </div>
      </Section>

      <Section withSpacing={false} className="pb-16 lg:pb-24">
        <motion.div {...entrance} className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
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
        </motion.div>
      </Section>
      </div>
    </MotionConfig>
  )
}
