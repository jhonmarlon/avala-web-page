# Avala Web Page

Landing corporativa de **Sistemas AG / Avala Group** construida con React, TypeScript y Vite, siguiendo una arquitectura reusable y pensada para escalar.

## Stack actual

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS v4
- Motion
- Lucide React
- React Icons

## Estado actual

Hoy el proyecto ya tiene:

- layout público con `Header` y `Footer`
- `HomePage` compuesta por secciones
- sistema base de UI reusable (`Button`, `Card`, `Section`, `Heading`, etc.)
- animaciones con Motion
- assets reales del mockup integrados progresivamente
- estructura lista para seguir refinando fidelidad visual y escalar a más páginas/features

## Scripts

```bash
yarn dev
yarn build
yarn lint
yarn preview
```

## Estructura principal

```txt
src/
├── app/
│   ├── layouts/
│   └── router/
├── assets/
├── components/
│   ├── layout/
│   └── ui/
├── config/
├── features/
│   └── home/
├── lib/
├── pages/
└── index.css
```

## Convenciones del proyecto

- **Inter** para UI y texto
- **Manrope** para headings
- componentes desacoplados y reutilizables
- contenido centralizado en `features/home/data/content.ts`
- assets del diseño en `src/assets/`
- estilos semánticos preparados para futura evolución a dark mode

## Assets relevantes

En `src/assets/` ya están disponibles:

- `avala_logo.png`
- `background_1.png`
- `background_2.png`
- `background_3.png`
- `hero.png`
- `commercial_automation.png`
- `company_platform.png`
- `technological_integration.png`

## Próximos pasos sugeridos

- terminar de clavar fidelidad visual exacta contra el mockup
- revisar responsive fino por breakpoint
- limpiar contenido placeholder restante
- preparar commits finales y PR
