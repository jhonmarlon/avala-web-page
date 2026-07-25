import {
  BarChart3,
  Cloud,
  BrainCircuit,
  Code2,
  Megaphone,
  MessagesSquare,
  PenTool,
  Puzzle,
  RadioTower,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Smile,
  Smartphone,
  Users,
  Infinity as InfinityIcon,
} from 'lucide-react'
import commercialAutomationImage from '@/assets/commercial_automation.png'
import companyPlatformImage from '@/assets/company_platform.png'
import technologicalIntegrationImage from '@/assets/technological_integration.png'

export const heroContent = {
  title: 'Transformamos procesos complejos en soluciones tecnológicas inteligentes.',
  highlightedText: 'soluciones tecnológicas inteligentes',
  description:
    'Automatización, inteligencia artificial, desarrollo de software e infraestructura tecnológica para impulsar el crecimiento de tu empresa.',
  primaryCta: {
    label: 'Solicitar asesoría',
    to: '/contacto',
  },
  secondaryCta: {
    label: 'Conoce nuestras soluciones',
    to: '/soluciones',
  },
}

export const metrics = [
  {
    value: '120+',
    label: 'Proyectos exitosos',
    Icon: Rocket,
  },
  {
    value: '15+',
    label: 'Años de experiencia',
    Icon: Users,
  },
  {
    value: '95%',
    label: 'Clientes satisfechos',
    Icon: Smile,
  },
  {
    value: '24/7',
    label: 'Soporte y acompañamiento continuo',
    Icon: ShieldCheck,
  },
]

export const servicesIntro = {
  title: 'Nuestras soluciones',
}

export const services = [
  {
    title: 'Automatización de procesos',
    description:
      'Eliminamos tareas repetitivas y optimizamos flujos de trabajo con automatización inteligente.',
    ctaLabel: 'Ver más',
    Icon: Settings,
    featured: true,
  },
  {
    title: 'Desarrollo web',
    description:
      'Creamos plataformas modernas, escalables y enfocadas en resultados medibles.',
    ctaLabel: 'Ver más',
    Icon: Code2,
  },
  {
    title: 'Aplicaciones móviles',
    description:
      'Desarrollamos experiencias móviles conectadas con tu negocio y tus operaciones.',
    ctaLabel: 'Ver más',
    Icon: Smartphone,
  },
  {
    title: 'Inteligencia artificial',
    description:
      'Integramos IA para analizar datos, asistir decisiones y automatizar acciones.',
    ctaLabel: 'Ver más',
    Icon: BrainCircuit,
  },
  {
    title: 'Integraciones',
    description:
      'Conectamos sistemas, APIs y plataformas para que tu operación funcione en armonía.',
    ctaLabel: 'Ver más',
    Icon: Puzzle,
  },
  {
    title: 'Cloud',
    description:
      'Implementamos soluciones seguras y escalables en la nube para sostener crecimiento.',
    ctaLabel: 'Ver más',
    Icon: Cloud,
  },
  {
    title: 'Consultoría',
    description:
      'Acompañamiento estratégico para definir soluciones tecnológicas a la medida.',
    ctaLabel: 'Ver más',
    Icon: MessagesSquare,
  },
  {
    title: 'Marketing digital',
    description:
      'Estrategias medibles para generar visibilidad, leads y crecimiento comercial.',
    ctaLabel: 'Ver más',
    Icon: Megaphone,
  },
  {
    title: 'DevOps',
    description:
      'Automatizamos despliegues y operaciones para acelerar entrega y confiabilidad.',
    ctaLabel: 'Ver más',
    Icon: InfinityIcon,
  },
  {
    title: 'Telecomunicaciones',
    description:
      'Soluciones de voz, red y conectividad para potenciar la operación del negocio.',
    ctaLabel: 'Ver más',
    Icon: RadioTower,
  },
]

export const processIntro = {
  title: 'Así trabajamos',
}

export const processSteps = [
  {
    step: '1',
    title: 'Descubrimos',
    description: 'Entendemos tus necesidades y alineamos la solución con objetivos reales.',
    Icon: Search,
    accentClass: 'from-sky-400/40 via-sky-500/18 to-transparent text-sky-300 border-sky-400/45 shadow-[0_0_36px_rgba(56,189,248,0.22)] hover:shadow-[0_0_60px_rgba(56,189,248,0.4)]',
  },
  {
    step: '2',
    title: 'Diseñamos',
    description: 'Definimos estrategia, alcance y arquitectura antes de ejecutar.',
    Icon: PenTool,
    accentClass: 'from-emerald-300/35 via-emerald-400/18 to-transparent text-emerald-200 border-emerald-300/45 shadow-[0_0_36px_rgba(52,211,153,0.2)] hover:shadow-[0_0_60px_rgba(52,211,153,0.38)]',
  },
  {
    step: '3',
    title: 'Construimos',
    description: 'Desarrollamos e integramos la solución con foco en escalabilidad.',
    Icon: Code2,
    accentClass: 'from-sky-400/40 via-blue-500/18 to-transparent text-sky-300 border-sky-400/45 shadow-[0_0_36px_rgba(59,130,246,0.24)] hover:shadow-[0_0_60px_rgba(59,130,246,0.42)]',
  },
  {
    step: '4',
    title: 'Implementamos',
    description: 'Puesta en marcha segura, iterativa y con mínima fricción operativa.',
    Icon: Rocket,
    accentClass: 'from-fuchsia-300/35 via-violet-400/20 to-transparent text-fuchsia-200 border-fuchsia-300/45 shadow-[0_0_36px_rgba(217,70,239,0.24)] hover:shadow-[0_0_60px_rgba(217,70,239,0.42)]',
  },
  {
    step: '5',
    title: 'Optimizamos',
    description: 'Medimos, mejoramos y escalamos para sostener crecimiento.',
    Icon: BarChart3,
    accentClass: 'from-cyan-300/35 via-cyan-400/20 to-transparent text-cyan-200 border-cyan-300/45 shadow-[0_0_36px_rgba(34,211,238,0.2)] hover:shadow-[0_0_60px_rgba(34,211,238,0.38)]',
  },
]

export const successCasesIntro = {
  title: 'Casos de éxito',
}

export const successCases = [
  {
    title: 'Automatización comercial',
    description:
      'Implementación de software para mejorar compras, procesos comerciales y operación interna.',
    metric: '+65%',
    metricLabel: 'Tiempo operativo optimizado',
    image: commercialAutomationImage,
  },
  {
    title: 'Plataforma empresarial',
    description:
      'Desarrollamos una plataforma a medida con analítica y control de procesos clave.',
    metric: '+80%',
    metricLabel: 'Eficiencia operativa',
    image: companyPlatformImage,
  },
  {
    title: 'Integración tecnológica',
    description:
      'Conectamos servicios y sistemas en una nube segura, escalable y observable.',
    metric: '100%',
    metricLabel: 'Sistemas conectados',
    image: technologicalIntegrationImage,
  },
]

export const successCasesAside = {
  eyebrow: 'Sobre nosotros',
  title: 'Sobre nosotros',
  description:
    'Somos una empresa enfocada y tecnológica especializada en el desarrollo de soluciones tecnológicas, automatización de procesos e infraestructura y servicios en la nube de escala y medida.',
  descriptionSecondary:
    'Nuestro lado valioso integra innovaciones que combinan inteligencia artificial, datos y análisis en nuevas formas de conectar, ayudando a empresas de diferentes industrias a resolver retos operativos y escalar el éxito comercial.',
  highlights: [
    'Automatización e integración de procesos críticos.',
    'Desarrollo web y plataformas escalables a medida.',
    'Infraestructura, cloud y soporte continuo.',
  ],
  ctaLabel: 'Conocer más sobre nosotros',
  ctaTo: '/nosotros',
}

export const aboutSectionContent = {
  eyebrow: 'Sobre nosotros',
  title: 'Construimos soluciones con visión técnica, criterio de negocio y acompañamiento real.',
  description:
    'No se trata solo de desarrollar software. Se trata de entender procesos, conectar sistemas y diseñar soluciones sostenibles que acompañen la evolución de la empresa.',
  highlights: [
    'Automatización e integración de procesos críticos.',
    'Desarrollo web y plataformas escalables a medida.',
    'Infraestructura, cloud y soporte continuo.',
  ],
  ctaLabel: 'Conocer más sobre nosotros',
  ctaTo: '/nosotros',
}

export const finalCtaContent = {
  title: '¿Listo para transformar tu empresa?',
  description:
    'Agendá una reunión con nuestro equipo y definamos juntos una solución tecnológica clara, escalable y alineada con tus objetivos.',
  primaryCta: {
    label: 'Agendá ahora',
    to: '/contacto',
  },
}
