import { createBrowserRouter } from 'react-router'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { EstimatorPage } from '@/pages/EstimatorPage'
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
        path: 'estimar-proyecto',
        Component: EstimatorPage,
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
