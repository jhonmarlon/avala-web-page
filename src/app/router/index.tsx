import { createBrowserRouter } from 'react-router'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { HomePage } from '@/pages/HomePage'
import { ServicesPage } from '@/pages/ServicesPage'
import { SuccessCasesPage } from '@/pages/SuccessCasesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PublicLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: 'nosotros',
        Component: AboutPage,
      },
      {
        path: 'soluciones',
        Component: ServicesPage,
      },
      {
        path: 'casos-de-exito',
        Component: SuccessCasesPage,
      },
      {
        path: 'contacto',
        Component: ContactPage,
      },
    ],
  },
])
