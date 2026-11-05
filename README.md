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

## Verificación del frontend

Desde la raíz, en Bash, sin agregar scripts a `package.json`:

```bash
node --import ./tests/register.mjs --test tests/*.test.mjs
node node_modules/typescript/bin/tsc -b
node --input-type=module -e 'import { build } from "vite"; await build({ envDir: false })'
yarn lint
git diff --check
```

Para verificar, usar la API de Vite con `envDir: false`: no carga archivos privados `.env`.
El script habitual `yarn build` no cambia. Las pruebas de CSS expanden los imports
ordenados mediante `tests/style-source.mjs`, no dependen del contenido físico de `src/index.css`.

## Estructura principal

```txt
src/
├── app/
│   ├── layouts/
│   └── router/
├── assets/
├── components/
│   ├── fx/
│   ├── icons/
│   │   └── scenes/
│   ├── layout/
│   └── ui/
├── config/
├── features/
│   ├── contact/
│   ├── estimator/
│   ├── home/
│   └── legal/
├── lib/
├── pages/
├── styles/
└── index.css
```

## Convenciones del proyecto

- **Inter** para cuerpo/UI, **Inter Tight** para display, **Manrope** para headings y **JetBrains Mono** para metadatos, según `src/styles/theme.css`
- componentes neutrales en `components/ui`, efectos en `components/fx` y escenas decorativas en `components/icons/scenes`
- contenido de Home en `src/features/home/data/content.ts`; contacto, estimador y legal conservan sus propios datos y acciones
- catálogo compartido de servicios en `src/config/services.ts`, teléfono en `src/lib/phone.ts` y reloj en `src/components/ui/LocalClock.tsx`
- assets del diseño en `src/assets/`; no borrar por ausencia de imports sin comprobar sus contratos
- `src/index.css` contiene solo imports: mantener el orden de las siete familias de `src/styles/`

Guía actual de propietarios y extensión: [Frontend architecture](docs/frontend-architecture.md).
Inventario, decisiones de limpieza y evidencia histórica: [Frontend code audit](docs/handoff/frontend-code-audit.md).

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

- validar en navegador la apariencia, el responsive y la percepción de los efectos
- comprobar manualmente foco, navegación por teclado y flujos completos de formularios
- revisar los commits locales antes de decidir cualquier push o PR; la publicación sigue siendo una decisión humana
