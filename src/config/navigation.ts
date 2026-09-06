export type NavigationItem = {
  label: string
  href: string
  children?: Array<{
    label: string
    href: string
    description: string
  }>
}

export const navigationItems: NavigationItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/nosotros' },
  {
    label: 'Soluciones',
    href: '/soluciones',
    children: [
      {
        label: 'Catálogo de soluciones',
        href: '/soluciones',
        description: 'Servicios tecnológicos, automatización, IA, cloud e integraciones.',
      },
      {
        label: 'SIEMBRA eSIM',
        href: '/esim',
        description: 'Compra, activación y entrega segura de eSIMs.',
      },
      {
        label: 'Estimar proyecto',
        href: '/estimar-proyecto',
        description: 'Calculá alcance, complejidad e inversión preliminar.',
      },
    ],
  },
  { label: 'Casos de éxito', href: '/casos-de-exito' },
  { label: 'Contacto', href: '/contacto' },
]
