export type NavigationItem = {
  label: string
  href: string
  hasChildren?: boolean
}

export const navigationItems: NavigationItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Soluciones', href: '/soluciones', hasChildren: true },
  { label: 'Estimar proyecto', href: '/estimar-proyecto' },
  { label: 'Casos de éxito', href: '/casos-de-exito' },
  { label: 'Contacto', href: '/contacto' },
]
