# Documentación con Next.js &Nextra V4

## Introducción

Esta guía explica cómo construir un sitio de documentación utilizando el stack compuesto por **Next.js 15 (App Router)**, **Nextra v4** (con `theme-docs`), y **Pagefind** como motor de búsqueda local. El objetivo es crear una documentación moderna, mantenible y fácil de navegar con soporte para contenido en formato MDX.

![](https://cdn-images-1.medium.com/max/1600/1*-LHJYZqDd7ausHFgGq20uw.gif)

Este enfoque es ideal para documentar librerías, APIs, productos o incluso cursos técnicos, aprovechando lo mejor del ecosistema React, la arquitectura modular de Next.js y la simplicidad de Nextra para documentación basada en archivos.

---

###  Principales características

- **Next.js 15 (App Router)**: Soporte moderno para React Server Components, layouts persistentes, y segmentación avanzada.

- **Nextra v4 + theme-docs**: Generador estático con enfoque MDX, navegación automática, SEO y componentes extensibles.
- **Pagefind**: Búsqueda local instantánea sin servidor, ideal para sitios JAMStack.
- **MDX**: Documentación con mezcla de Markdown + JSX para interactividad.
- **Soporte para layouts personalizados** y sidebar automático.
- **Edición desde GitHub** y vista previa dinámica.

---

### Ventajas

- **Sin necesidad de CMS o backend**: Todo se construye desde archivos `.mdx`.

- **Rápido de desplegar**: Compatible con Vercel, Netlify o cualquier hosting estático.
- **Experiencia de desarrollador**: Hot reload, ESLint, Tailwind.
- **Escalable**: Puedes dividir tu contenido en secciones, carpetas o dominios.
- **Personalizable**: Desde temas hasta componentes visuales reutilizables.
- **Búsqueda offline con Pagefind**, sin costos de backend.

---

### ¿Por qué archivos `.mdx?`

Los archivos `.mdx` son una extensión de Markdown que **combina contenido estático (Markdown) con la capacidad de usar JSX directamente dentro del mismo archivo**. Esto significa que puedes escribir documentación con títulos, listas o tablas, pero también **insertar componentes React, importar módulos o renderizar lógica interactiva sin cambiar de archivo**.

En el contexto de Nextra, cada archivo `.mdx` se trata como si fuera un archivo `.tsx` con soporte Markdown embebido. Esto es posible porque Nextra utiliza internamente **compiladores MDX como** `@mdx-js/react` [[ref](https://github.com/mdx-js/mdx)], que transforman el contenido `.mdx` en componentes React durante la compilación. Al correr el proyecto, esos archivos se compilan y se comportan como cualquier otro componente de React dentro de tu aplicación.

---

## Paso a paso: instalación y configuración

### Crear el proyecto base

```bash
npx create-next-app@latest nextra-nextjs15
```

Selecciona estas opciones al crear el proyecto:

```bash
✔ TypeScript:        Yes
✔ ESLint:            Yes
✔ Tailwind CSS:      Yes
✔ src/ directory:    Yes
✔ App Router:        Yes
✔ Turbopack:         Yes
✔ Import alias (@):  No
```

Esto asegura un entorno moderno, optimizado para documentación con soporte tipado y estilo configurable.

---

### Instalar dependencias

```bash
npm install nextra nextra-theme-docs
npm install -D pagefind
```

**Donde:**

- `nextra` [[ref](https://github.com/shuding/nextra)]— Sistema de plugins para extender Next.js con MDX.

- `nextra-theme-docs` [[ref](https://github.com/shuding/nextra-theme-docs)]— Tema especializado para documentación.
- `pagefind` [[ref](https://github.com/Pagefind/pagefind)]— Búsqueda local sin backend (genera índice estático post-build).

---

### Configurar búsqueda con Pagefind

Agrega en `package.json`:

```json
"scripts": {
  "postbuild": "pagefind --site .next/server/app --output-path public/_pagefind"
}
```

Este comando ejecuta **Pagefind** después de que Next.js termine su proceso de `build`, aprovechando el hook `postbuild`. Su propósito es generar un **índice de búsqueda estático** para que tu sitio pueda tener **búsqueda local sin backend**.

**Donde:**

- `pagefind`— Llama al paquete de Pagefind.

- `--site .next/server/app`— Le dice a Pagefind dónde buscar los archivos HTML renderizados por Next.js.
- `--output-path public/_pagefind` — Indica que el índice de búsqueda debe colocarse en `public/_pagefind`, lo cual es importante porque cualquier cosa dentro de `public/` será servida estáticamente por Next.js.

Y en `.gitignore`:

```ini
_pagefind/
```

Esto evita subir archivos generados automáticamente por el indexador de Pagefind.

---

### Configurar `next.config.ts`

```ts
// next.config.ts
import nextra from 'nextra';

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false,
  },
  contentDirBasePath: '/docs',
});

export default withNextra({
  reactStrictMode: true,
});
```

**Donde:**

- `latex`— Activa el soporte nativo para fórmulas matemáticas dentro de archivos `.mdx` utilizando KaTeX [[ref](https://katex.org/)]. Esto permite escribir expresiones matemáticas en formato LaTeX directamente en tu documentación.

- `search.codeblocks`:— Indica a Nextra que \*\*no incluya el contenido de los bloques de código (` ``` `) dentro del índice de búsqueda generado por Pagefind.
- `contentDirBasePath: '/docs'`— Redefine la ruta base del contenido `.mdx` que será expuesto como páginas públicas. Aunque tus archivos pueden estar físicamente en `src/content`, serán servidos bajo `/docs`.

---

### Sobrescribir componentes MDX

Crea el archivo `src/mdx-components.ts` [[ref](https://nextra.site/docs/file-conventions/mdx-components-file)]

```ts
// src/mdx-components.ts
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs';

const docsComponents = getDocsMDXComponents();

export const useMDXComponents: typeof getDocsMDXComponents = (components) => ({
  ...docsComponents,
  ...components,
});
```

Esta función sobrescribe el hook `useMDXComponents`, utilizado por Nextra internamente para renderizar los componentes dentro de los archivos `.mdx`.

Por defecto, `nextra-theme-docs` ya proporciona una serie de componentes personalizados (como `Note`, `Tabs`, `Callout`, etc.). Al redefinir `useMDXComponents`, tú puedes:

- **Extender**: Agregar nuevos componentes JSX que puedes usar directamente en tus archivos `.mdx` (como `<Card />`, `<Badge />`, etc.).

- **Reemplazar**: Cambiar el comportamiento de componentes existentes.

---

### — Estilos y páginas base

Actualiza las siguientes líneas en `src/app/globals.css`:

```css
/* src/app/globals.css */
@import 'nextra-theme-docs/style.css';
@import 'tailwindcss';
```

Importa los estilos base del tema `nextra-theme-docs`, incluyendo tipografías, sistema de diseño, tokens visuales y componentes como `Note`, `Tabs`, `Callout`, etc. Estos estilos definen la apariencia general de tu documentación.

---

###  Página principal (`src/app/page.tsx`)

Vamos a mejorar visualmente la página principal (`src/app/page.tsx`), tipo landing con **tipografía grande, subtítulo descriptivo y botones de acción**, al estilo de las páginas de inicio de **Next.js** o **React Docs**.

```tsx
// src/app/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nextra Docs Template',
  description: 'Modern documentation site built with Nextra & Next.js 15+',
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-24">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-b from-white to-neutral-400 text-transparent bg-clip-text">
        Build Beautiful Docs with
        <br />
        Next.js & Nextra
      </h1>

      <p className="mt-6 text-lg md:text-xl text-neutral-400 max-w-xl">
        A modern, blazing-fast documentation starter using the power of MDX,
        Tailwind and Pagefind.
      </p>

      <div className="mt-10 flex gap-4">
        <Link
          href="/docs"
          className="px-6 py-3 text-sm font-semibold rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors"
        >
          Get Started
        </Link>
        <a
          href="https://github.com/mauriciogc/nextra-nextjs15"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 text-sm font-semibold rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
        >
          GitHub
        </a>
      </div>
    </main>
  );
}
```

---

### Layout principal (`src/app/layout.tsx`)

El archivo `layout.tsx` de nextra [[ref](https://nextra.site/docs/docs-theme/built-ins/layout)] define la estructura global de la aplicación, incluyendo:

- Metadatos para SEO y configuraciones web.

- Navbar personalizado de nextra [[ref](https://nextra.site/docs/docs-theme/built-ins/navbar)].
- Footer personalizado de nextra [[ref](https://nextra.site/docs/docs-theme/built-ins/footer)].
- Integración con `nextra-theme-docs` usando el layout base.
- Carga dinámica del árbol de navegación (`pageMap`).

```tsx
// src/app/layout.tsx
import { getPageMap } from 'nextra/page-map';
import type { Metadata } from 'next';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import type { FC, ReactNode } from 'react';
import './globals.css';

/**
 * Define información que será utilizada en las etiquetas <meta>,
 * mejorando el posicionamiento en buscadores y la integración
 * con plataformas (como redes sociales, iOS, etc.).
 */
export const metadata: Metadata = {
  description: 'Next.js v15 documentation, made with Nextra & MDX',
  keywords: ['Nextra', 'Next.js', 'React', 'JavaScript', 'MDX', 'Markdown'],
  generator: 'Next.js',
  applicationName: 'nextra-nextjs15',
  appleWebApp: {
    title: 'Next.js v15 Documentation',
  },
  title: {
    default: 'Next.js v15 Documentation',
    template: '%s | Next.js v15 Documentation',
  },
};

/**
 * Puedes personalizar:
 * - El logo (texto, ícono, imagen o JSX).
 * - El projectLink (botón superior derecho que lleva a GitHub, por defecto).
 *
 * También puedes pasar props adicionales como navItems, version, etc.,
 * si quieres un navbar más avanzado.
 */
const navbar = (
  <Navbar
    logo={<h1>Next.js +15</h1>}
    projectLink="https://github.com/mauriciogc/nextra-nextjs15"
  />
);

/**
 * Footer admite cualquier JSX como contenido. Aquí usamos una versión
 * simple, pero podrías extenderlo con enlaces, íconos sociales,
 * enlaces legales, etc.
 */
const footer = (
  <Footer className="flex-col items-center md:items-start">
    Powered by Next.js & Nextra
  </Footer>
);

/**
 * navbar: Define la barra de navegación superior
 * footer: Define el pie de página
 * pageMap: Árbol de navegación generado por los .mdx
 * docsRepositoryBase: Base URL para el botón "Edit this page" en GitHub
 * editLink: Texto visible en el botón de edición
 * sidebar.defaultMenuCollapseLevel: Nivel de profundidad a partir del cual se colapsan los menús del sidebar
 */
const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const pageMap = await getPageMap();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/mauriciogc/nextra-nextjs15/tree/main"
          editLink="Edit this page on GitHub"
          sidebar={{
            defaultMenuCollapseLevel: 1,
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
```

---

### Página dinámica para contenido MDX [[ref](https://nextra.site/docs/file-conventions/content-directory#add-mdxpathpagejsx-file)]

Crea el archivo `src/app/docs/[[...mdxPath]]/page.tsx`:

```tsx
// src/app/docs/[[..mdxPath]]/page.tsx
import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { useMDXComponents } from '@/mdx-components';

// Toma todos los archivos .mdx y prepárame las rutas estáticas para /docs/...
export const generateStaticParams = generateStaticParamsFor('mdxPath');

/**
 * Permite que Next.js genere etiquetas <meta> (título, descripción, etc.)
 * de forma automática, usando el frontMatter definido en cada archivo .mdx.
 *
 * Ejemplo:
 * ---
 * title: "Getting Started"
 * description: "How to get started with Nextra."
 * ---
 */
export async function generateMetadata(props) {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath);
  return metadata;
}

/**
 * Esto asegura que cualquier archivo .mdx dentro de /src/content
 * sea interpretado como una página válida dentro de /docs.
 */
const Wrapper = useMDXComponents().wrapper;
export default async function Page(props) {
  const params = await props.params;
  const result = await importPage(params.mdxPath);
  const { default: MDXContent, toc, metadata } = result;

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
```

Este archivo se encarga de **renderizar dinámicamente cualquier archivo** `**.mdx**` ubicado dentro de tu directorio de contenido (`/src/content`), y sirve como router universal para la documentación.

---

### Página 404 reutilizada

Crea el archivo `src/app/not-found.tsx`:

```tsx
// src/app/not-found.tsx
export { NotFoundPage as default } from 'nextra-theme-docs';
```

En lugar de crearla desde cero, **Nextra ya provee una página 404 prediseñada** [[ref](https://nextra.site/docs/docs-theme/built-ins/not-found)] con diseño consistente, mensaje claro y estilizado para temas de documentación.

Al iniciar el servidor `npm run dev`, acceder a `http://localhost:3000`, deberías ver la página principal personalizada que diseñaste en `src/app/page.tsx`.

![](https://cdn-images-1.medium.com/max/1600/1*9OgFB3Ktt7LqZjO3Pg5Ksg.png)

Esta vista actúa como **landing page del sitio**, donde puedes destacar el propósito del proyecto, agregar accesos rápidos o información relevante antes de entrar a la documentación técnica.

---

## Siguiente paso: crear contenido en `.mdx`

Ahora que la estructura base está funcionando, el siguiente paso es comenzar a generar contenido técnico utilizando archivos `.mdx`.

Esto incluye:

- Páginas individuales de documentación (`index.mdx`, `introduction.mdx`, `concepts.mdx`, etc.)

- Secciones agrupadas por carpetas (como `/getting-started/`, `/api/`, `/concepts/`)
- Organización visual del contenido en el sidebar a través de `_meta.global.tsx`

---

### Crear contenido en `/src/content`

Crea el archivo `src/content/index.mdx`

```mdx
# Welcome to Nextra

Hello, world!
```

Este archivo representa la **página principal de la documentación**. Al tratarse de un archivo `index.mdx`, se sirve automáticamente en la raíz de la sección `/docs`.

Al iniciar el servidor `npm run dev`, acceder a `http://localhost:3000/docs`, deberías ver renderizada la página que acabas de crear, utilizando el layout proporcionado por `nextra-theme-docs`.

![](https://cdn-images-1.medium.com/max/1600/1*xFRMkw7PsNWaR9yTcvAvSg.png)

- Gracias a la configuración en `next.config.ts`, indicamos que los archivos `.mdx` que se encuentran en `/src/content` se sirvan en `/docs`.

- El sistema de rutas dinámicas definido en `src/app/docs/[[...mdxPath]]/page.tsx` permite que cualquier archivo `.mdx` sea cargado como página pública.
- La UI de Nextra (`Layout`, `Navbar`, `Sidebar`) se renderiza automáticamente con base en la estructura del contenido y los metadatos.

---

### Controlar el menú lateral con `_meta.global.tsx`

Para definir el orden, visibilidad y títulos del menú lateral que aparece en la documentación (`/docs`), crea el archivo `/src/app/_meta.global.tsx` [[ref](https://nextra.site/docs/file-conventions/meta-file#_metaglobal-file)]

```tsx
// src/app/_meta.global.tsx
const META = {
  index: {
    type: 'page',
    display: 'hidden',
  },
  docs: {
    type: 'page',
    title: 'Documentation',
  },
};

export default META;
```

Donde:

- `index` — Oculta la raíz (`/`) del navbar, ya que está reservada para la landing page.

- `docs` — Define que todo lo que esté bajo `/src/content` se agrupará como una sección titulada “_Documentation_”.

![](https://cdn-images-1.medium.com/max/1600/1*CJ7Y7pbRwc0gMiP-LYtSmA.png)

Una vez configurado el layout y el routing dinámico, puedes comenzar a estructurar el contenido técnico por secciones.

---

### Crear archivos `.mdx` sueltos (páginas)

Agrega nuevos archivos `.mdx` directamente dentro de `/src/content/`:

```bash
/src/content/project-structure.mdx
/src/content/deployment-guide.mdx
```

Crea el archivo `src/content/project-strcuture.mdx`

````mdx
---
title: 'Project Structure'
description: 'Overview of the recommended folder and file structure for the project.'
---

# Project Structure

This page explains the organization of the codebase and where to place your content.

```bash
.
├── src/
│   ├── content/         # MDX pages
│   ├── app/             # App Router (layout.tsx, page.tsx, etc.)
│   ├── components/      # Reusable UI components
│   └── mdx-components.ts
├── public/
├── next.config.ts
└── package.json
```

Organizing your project properly helps improve maintainability and collaboration.
````

En Nextra +4, los archivos `.mdx` pueden incluir metadatos en el encabezado (también llamado **frontMatter**) utilizando el formato `YAML` dentro de delimitadores `---`. Dos propiedades clave son:

```mdx
---
title: 'Project Structure'
description: 'Overview of the recommended folder and file structure for the project.'
---
```

#### `title`**— Define el título visible** de la página dentro del sitio.

Se utiliza para:

- El **título que aparece en el menú lateral (sidebar).**

- El `**<title>**` **del HTML** generado dinámicamente para esa página (SEO).
- El **encabezado inicial** si no defines manualmente uno con `#`.

> Si omites `title` y no defines uno manualmente con `#` Nextra intentará generar uno basado en el nombre del archivo (ej. `project-structure.mdx` → "Project Structure"), pero es menos confiable y no apto para SEO serio.

#### `description` — **Define una breve descripción** de la página del sitio.

Se utiliza para:

- Mejora la accesibilidad y experiencia del lector.

- Como `**<meta name="description">**` en el HTML para mejorar el **SEO** y las **vistas previas en redes sociales**.
- Para mostrar en vistas tipo “índice” o listados.

> Aunque no se renderiza visiblemente en la página por defecto, es clave para buscadores y herramientas cómo Pagefind.

Crea el archivo `src/content/deployment-guide.mdx`

````mdx
---
title: 'Deployment Guide'
description: 'How to deploy your Nextra + Next.js site to Vercel or other platforms.'
---

# Deployment Guide

This site can be deployed easily on [Vercel](https://vercel.com), [Netlify](https://www.netlify.com), or any static host.

## Vercel

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) and import your repository.
3. Set the build command:

```bash
npm run build
```

And the output directory:

```bash
.next
```

4. Done!!

## Netlify

Use a custom output adapter or export to static HTML using `next export`. (Not ideal for Nextra, which prefers SSR.)
````

Al iniciar el servidor con `npm run dev` y acceder a `http://localhost:3000`, verás una sección llamada **“Documentation”** en el menú superior (`navbar`), generada automáticamente por Nextra con base al archivo `_meta.global.tsx`.

También Nextra detecta la estructura del contenido y muestra las dos nuevas entradas que agregamos (**“Project Structure”** y **“Deployment Guide”**) como subpáginas . Ambas aparecen listadas en la navegación lateral, y al hacer clic sobre cualquiera de ellas, se renderiza la página correspondiente utilizando el layout y diseño del tema `nextra-theme-docs`.

![](https://cdn-images-1.medium.com/max/1600/1*ElW1qVxpwboXaXv_4UVg_Q.gif)

---

### Crear carpetas con secciones estructuradas

En Nextra, puedes agrupar contenido relacionado creando **carpetas dentro de** `/src/content/`. Cada carpeta representa una subsección navegable dentro de `/docs/`.

Estructura de ejemplo:

![](https://cdn-images-1.medium.com/max/1600/1*rQiUqc_Za5ojnkpSd68ofg.png)

Esto generará automáticamente las siguientes rutas públicas:

```bash
getting-started/index.mdx → /docs/getting-started
getting-started/prerequisites.mdx → /docs/getting-started/prerequisites
getting-started/install.mdx → /docs/getting-started/install
concepts/index.mdx → /docs/concepts
concepts/routing.mdx → /docs/concepts/routing
concepts/mdx-features.mdx → /docs/concepts/mdx-features
```

Crea el archivo `src/content/getting-started/index.mdx`

```mdx
---
title: 'Getting Started'
description: 'Start here to set up your environment and understand the basics.'
---

# Getting Started

Welcome! This section will help you prepare your development environment and guide you through the first steps.
```

Crea el archivo `src/content/getting-started/prerequisites.mdx`

```mdx
---
title: 'Prerequisites'
description: 'Tools and requirements needed before starting the project.'
---

# Prerequisites

Make sure you have the following installed before continuing:

- Node.js >= 18
- A package manager like npm or pnpm
- Git (optional, but recommended)
```

Crea el archivo `src/content/getting-started/install.mdx`

````mdx
---
title: 'Installation'
description: 'How to install the project using create-next-app and set up Nextra.'
---

# Installation

To get started quickly, run:

```bash
npx create-next-app@latest my-docs-site
```

Then install the necessary dependencies for Nextra and Tailwind...
````

Crea los demás archivos `src/content/concepts/...`

Al iniciar el servidor con `npm run dev` y acceder a `http://localhost:3000`, ve a **“Documentation”** en el menú superior.

![](https://cdn-images-1.medium.com/max/1600/1*yadKeTf2hlLZ-mtI7gYAdQ.gif)

Al explorar el árbol de navegación, notarás que las páginas y carpetas se listan en orden alfabético y sin una jerarquía intencional. Por ejemplo, “_Deployment Guide_” puede aparecer antes que “_Getting Started_”, aunque conceptualmente no sea el orden deseado.

---

## Siguiente paso: controlar el orden y estructura global

Para resolver esto y tener control total sobre el menú lateral, configuraremos dentro del archivo `_meta.global.tsx`. Este archivo nos permitirá definir el orden, los títulos visibles y la estructura de navegación global.

Actualiza el archivo `/src/app/_meta.global.tsx`

```tsx
// src/app/_meta.global.tsx

const GETTING_STARTED = {
  index: '',
  prerequisites: '',
  install: '',
};

const CONCEPTS = {
  index: '',
  routing: '',
  'mdx-features': '',
};

const META = {
  index: {
    type: 'page',
    display: 'hidden',
  },
  docs: {
    type: 'page',
    title: 'Documentation',
    items: {
      'project-structure': '',
      'deployment-guide': '',
      'getting-started': GETTING_STARTED,
      concepts: CONCEPTS,
    },
  },
};

export default META;
```

**Donde:**

- `items` representa el contenido dentro de `/src/content/` o `/src/content/folder/`

- Cada clave (como `'project-structure'`) debe coincidir con el **nombre del archivo o carpeta** en `src/content/`.
- Si el valor es una cadena vacía (`''`), Nextra usará el título definido en el frontMatter del `.mdx`.
- Si el valor es un objeto (como `GETTING_STARTED`), indica que se trata de una **carpeta** con varias subpáginas (cada clave es el nombre del archivo `.mdx` dentro de esa carpeta).

#### ¿Por qué usar constantes externas como `GETTING_STARTED`?

- Mejora la legibilidad.
- Permite modular el menú si tu proyecto crece.
- Evita errores al escribir rutas largas directamente.
- Puedes reusar o importar configuraciones de otros módulos si lo deseas

Al iniciar el servidor con `npm run dev` y acceder a `http://localhost:3000`, ve a **“Documentation”** en el menú superior.

![](https://cdn-images-1.medium.com/max/1600/1*P9a3PYI3BCxQAc8yGje5CA.png)

Al explorar el árbol de navegación, notarás que las páginas y secciones ya se muestran en el orden definido dentro del archivo `_meta.global.tsx`. Por ejemplo, **“_Getting Started_”** aparece antes que **“_Deployment Guide_”**, incluso si su orden alfabético fuera distinto, ya que ahora el menú sigue la jerarquía y el acomodo que tú determines explícitamente en ese archivo.

Esto permite organizar la documentación de forma lógica y coherente con la estructura del proyecto, en lugar de depender del orden automático por nombre de archivo o carpeta.

---

## Siguiente paso: Activar modo índice visual

Ahora, convertiremos los archivos `index.mdx` dentro de cada carpeta en **vistas tipo índice** usando `asIndexPage: true`. Esto hará que, al hacer clic sobre una carpeta como `getting-started/` o `concepts/`, no se navegue a una página más, sino que se despliegue una vista de entrada que actúe como resumen o punto de partida para esa sección.

Actualiza el archivo `src/content/getting-started/index.mdx` agregando `asIndexPage:true`

```mdx
---
asIndexPage: true
title: 'Getting Started'
description: 'Start here to set up your environment and understand the basics.'
---

# Getting Started

Welcome! This section will help you prepare your development environment and guide you through the first steps.

`asIndexPage: true` — **Activa el modo “índice visual”** de Nextra.
```

Se utiliza para:

- Convierte el `index.mdx` en una **vista de tipo resumen**, capaz de listar automáticamente todas las subpáginas de esa carpeta (como si fueran tarjetas, enlaces o bloques).

- Funciona junto al componente `<OverviewPage />` _(ver más abajo)_ para generar un diseño tipo dashboard o hub visual.
- Muy útil para secciones como `Getting Started`, `API`, `Components`, etc.

> Si el archivo `_index.mdx_` no tiene `_asIndexPage: true_`, se mostrará simplemente como una página de contenido normal.

Actualiza también el archivo `src/content/concepts/index.mdx` agregando `asIndexPage:true`

```mdx
---
asIndexPage: true
title: 'Core Concepts'
description: 'Fundamental concepts and inner workings of this documentation system.'
---

# Core Concepts

This section dives into how this documentation system is structured under the hood. It explains key ideas such as routing, MDX capabilities, and layout composition using Nextra and Next.js 15.

Pick a topic below to learn more.
```

> **Nota:** cuando utilices `asIndexPage: true` en el `index.mdx` de una carpeta, **no debes incluir la clave** `**index: ''**` dentro del objeto `items` correspondiente en `_meta.global.tsx`. Al hacerlo, evitarás que esa página se duplique en el menú como si fuera una entrada más, y se mostrará correctamente al hacer clic sobre la sección.

```tsx
// src/app/_meta.global.tsx

const GETTING_STARTED = {
  prerequisites: '',
  install: '',
};

const CONCEPTS = {
  routing: '',
  'mdx-features': '',
};

const META = {
  index: {
    type: 'page',
    display: 'hidden',
  },
  docs: {
    type: 'page',
    title: 'Documentation',
    items: {
      'project-structure': '',
      'deployment-guide': '',
      'getting-started': { items: GETTING_STARTED },
      concepts: { items: CONCEPTS },
    },
  },
};

export default META;
```

Al iniciar el servidor con `npm run dev` y acceder a `http://localhost:3000`, ve a **“Documentation”** en el menú superior.

![](https://cdn-images-1.medium.com/max/1600/1*u2yHL2ZKm8WVmlG9m4ZCNw.gif)

Al aplicar la propiedad `asIndexPage: true` en los archivos `index.mdx` de cada carpeta, su comportamiento cambia: ya **no se muestran como una página más dentro del árbol de navegación**, sino que actúan como **índices visuales** de sus respectivas secciones. Es decir, cuando haces clic sobre una carpeta como `getting-started` o `concepts` en el menú lateral, Nextra renderiza automáticamente ese `index.mdx` como **pantalla de entrada**, en lugar de listarlo como una subpágina adicional.

Esto mejora la experiencia de navegación, ya que convierte cada sección en una unidad visual clara, con su propio resumen o introducción, sin saturar el menú lateral con entradas redundantes.

---

### Crear vista tipo índice visual con `overview-page.tsx`

Cuando una carpeta de contenido (`/src/content/...`) incluye un archivo `index.mdx` con `asIndexPage: true`, es recomendable presentar una **vista visual de resumen** de sus subpáginas en forma de _Cards_, en lugar de una lista plana de enlaces.

Esto se logra con un componente como `OverviewPage`, que extrae dinámicamente la estructura del contenido con `pageMap` y genera una cuadrícula de tarjetas `Card` basada en el frontMatter de cada archivo `.mdx`.

Antes de generar una vista tipo índice para tus secciones, es recomendable contar con un componente visual que represente cada entrada de forma clara, estética y consistente. Para eso, vamos a crear el componente `Card`.

Crea componente `/src/components/card.tsx` :

```tsx
// src/components/card.tsx
import NextLink from 'next/link';

export default function Card({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
}) {
  return (
    <NextLink href={href}>
      <div className="h-full rounded-lg border border-gray-200 p-4 text-gray-700 hover:text-gray-900 dark:text-neutral-200 dark:hover:text-neutral-50 transition-all duration-200 hover:shadow-md hover:bg-slate-50 dark:hover:bg-neutral-900 dark:border-neutral-800 dark:hover:border-neutral-700">
        <div className="flex items-start gap-3">
          <div className={`mt-1 shrink-0 text-primary ${icon ? 'w-5' : ''}`}>
            {icon}
          </div>
          <div className="flex flex-col w-full max-w-xs">
            <h3 className="text-lg font-semibold mb-2 truncate">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
      </div>
    </NextLink>
  );
}
```

**Donde:**

- `title`:— [Obligatorio] Título visible de la tarjeta (obligatorio).

- `description` — [Opcional] Texto breve debajo del título (opcional).
- `href`— [Obligatorio] Ruta a la que se navega al hacer clic (obligatorio).
- `icon` — [Opcional] Un componente ícono (ej. lucide-react).

Crea el archivo `/src/components/overview-page.tsx` :

```tsx
// src/components/overview-page.tsx
import { getIndexPageMap, getPageMap } from 'nextra/page-map';
import type { PageMapItem } from 'nextra';

import Card from './card';

type OverviewPageProps = {
  filePath: string;
  icons?: Record<string, React.ComponentType>;
  pageMap?: PageMapItem[];
};

export const OverviewPage = async ({
  filePath,
  icons,
  pageMap: $pageMap,
}: OverviewPageProps) => {
  const currentRoute = filePath
    .replace('src/content', '/docs')
    .replace('/index.mdx', '');

  const pageMap = $pageMap ?? (await getPageMap(currentRoute));

  return getIndexPageMap(pageMap).map((pageItem, index) => {
    if (!Array.isArray(pageItem)) return null;

    return (
      <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16">
        {pageItem.map((item) => {
          const icon = item.frontMatter?.icon;
          const Icon = icons?.[icon];

          return (
            <Card
              key={item.name}
              title={item.frontMatter?.title || ''}
              description={item.frontMatter?.description || ''}
              href={item.route}
              icon={Icon && <Icon />}
            />
          );
        })}
      </div>
    );
  });
};
```

**Donde:**

- Usa `getPageMap()` para obtener el árbol de páginas correspondiente a la ruta actual.
- Usa `getIndexPageMap()` para obtener solo los nodos que dependen del `index.mdx` (las subpáginas).
- Renderiza una cuadrícula con _Cards_ personalizadas para cada subpágina.
- Cada tarjeta toma su `title`, `description` y `icon` desde el **frontMatter** del `.mdx`.

> Ideal cuando usas `asIndexPage: true` para que el `index.mdx` funcione como **índice visual** de una sección, como `/getting-started`, `/concepts`, etc.

Vamos a implementar el componente `OverviewPage` directamente en los archivos `index.mdx` de las subcarpetas `getting-started` y `concepts`.

Esto nos permitirá transformar cada `index.mdx` en una **vista de entrada visual** que muestra, mediante **_Cards_** **_dinámicas_**, las páginas internas de esa sección.

Actualiza el archivo `/src/content/getting-started/index.mdx`

```mdx
---
asIndexPage: true
title: 'Getting Started'
description: 'Start here to set up your environment and understand the basics.'
---

# Getting Started

Welcome! This section will help you prepare your development environment and guide you through the first steps.

import { OverviewPage } from '../../components/overview-page';

<OverviewPage filePath={metadata.filePath} />
```

Donde:

- `asIndexPage: true`— Hace que esta página **se muestre al hacer clic en la carpeta**, y no como una entrada adicional en el sidebar.
- `OverviewPage` — Genera dinámicamente un índice visual de _Cards_ de las subpáginas de esta sección (`prerequisites.mdx`, `install.mdx`, etc.)

**_Recuerda_**_: Los archivos_ `_.mdx_` _son una extensión de Markdown que combina contenido estático (Markdown) con la capacidad de usar JSX directamente dentro del mismo archivo_

Actualiza el archivo `/src/content/concepts/index.mdx`

```mdx
---
asIndexPage: true
title: 'Core Concepts'
description: 'Fundamental concepts and inner workings of this documentation system.'
---

# Core Concepts

This section dives into how this documentation system is structured under the hood. It explains key ideas such as routing, MDX capabilities, and layout composition using Nextra and Next.js 15.

Pick a topic below to learn more.

import { OverviewPage } from '../../components/overview-page';

<OverviewPage filePath={metadata.filePath} />
```

Al iniciar el servidor con `npm run dev` y acceder a `http://localhost:3000`, ve a **“Documentation”** en el menú superior.

![](https://cdn-images-1.medium.com/max/1600/1*rpnb_6CdSNVFs7ykTG6qIg.gif)

Verás que se renderiza una vista tipo índice visual: una cuadrícula de _Cards_ que representan cada una de las subpáginas dentro de esa carpeta. Este comportamiento es posible gracias al uso de `asIndexPage: true` en el archivo `index.mdx`, junto con el componente `OverviewPage`, que lee el árbol de contenido y genera dinámicamente las tarjetas (`Cards`).

Cada _Card_ muestra el título y la descripción definidos en el **frontMatter** del archivo `.mdx` correspondiente, por lo que es fundamental que todos los documentos dentro de una sección incluyan estos campos. Además, si se agrega un campo `icon`, puede mostrarse un ícono personalizado junto al título.

Actualiza el archivo `/src/content/getting-started/installation.mdx`, agregando el nombre del icono `icon:'Wrench'`:

````mdx
---
icon: 'Wrench'
title: 'Installation'
description: 'How to install the project using create-next-app and set up Nextra.'
---

# Installation

To get started quickly, run:

```bash
npx create-next-app@latest my-docs-site
```

Then install the necessary dependencies for Nextra and Tailwind...
````

Actualiza el archivo `/src/content/getting-started/index.mdx`, importando la librería de `lucide-react` (o la de tu preferencia) y pásalo como parámetro al componente `OverviewPage`:

```mdx
---
asIndexPage: true
title: 'Getting Started'
description: 'Start here to set up your environment and understand the basics.'
---

# Getting Started

Welcome! This section will help you prepare your development environment and guide you through the first steps.

import { OverviewPage } from '../../components/overview-page';
import { Wrench } from 'lucide-react';

<OverviewPage
  filePath={metadata.filePath}
  icons={{
    Wrench,
  }}
/>
```

> **Nota**: No olvides instalar el paquete de los iconos `npm i lucide-react`

![](https://cdn-images-1.medium.com/max/1600/1*33BrPVpemzPbD6I10L50NQ.png)

---

### Generar el índice de búsqueda con Pagefind

Una vez que hayas creado el contenido y estructurado tu documentación, es momento de **generar el índice de búsqueda estático con Pagefind**, que permitirá realizar búsquedas sin backend directamente en el navegador.

Este paso **no se realiza durante el desarrollo (**`**npm run dev**`**)**, ya que **Pagefind** necesita acceder a los archivos HTML generados por Next.js al compilar el sitio.

Para generar el índice correctamente:

Ejecuta el comando de build de Next.js:

```bash
npm run build
```

Una vez completado el build, Nextra ejecutará automáticamente el script que definiste en `package.json` bajo `postbuild`:

```json
"postbuild": "pagefind --site .next/server/app --output-path public/_pagefind"
```

Esto ejecuta Pagefind sobre los archivos HTML generados por Next.js, y guarda el índice resultante en la carpeta `public/_pagefind`.

Para verificar que la búsqueda funciona correctamente en un entorno local de producción, ejecuta:

```bash
npm run start
```

Luego visita `http://localhost:3000` y prueba la barra de búsqueda. Los resultados deberían cargarse al instante, sin conexión a un servidor externo.

![](https://cdn-images-1.medium.com/max/1600/1*IU7g7I2eETYpq_YghExZoA.gif)

Pagefind genera un índice completamente estático, por lo que todo lo necesario para la búsqueda queda contenido dentro del directorio `public/_pagefind`. Esto lo hace ideal para despliegues en Vercel o cualquier plataforma estática. Solo asegúrate de **no ignorar accidentalmente la carpeta** `**public/_pagefind**` **al hacer deploy**.

Con esto, tu sitio está listo para producción: con contenido navegable, documentación modular, y búsqueda rápida sin servidor.

---

## ¿Qué más se puede hacer con Nextra?

Hasta este punto, ya tienes un sitio de documentación completamente funcional: estructurado con Next.js 15+, potenciado con Nextra v4, con búsqueda local gracias a Pagefind, soporte para componentes MDX, vistas tipo índice y un menú de navegación totalmente personalizado.

Pero esto es solo el inicio. Nextra es altamente extensible y está pensado para escalar tanto en contenido como en experiencia de usuario. Si deseas llevar tu documentación aún más lejos, puedes explorar funcionalidades adicionales como:

- Uso de `headings` personalizados y niveles automáticos para TOC.

- Personalizar el layout con componentes propios (`Navbar`, `Footer`, `Banner`, etc.).
- Insertar demos interactivos o sandboxes de código en línea.
- Controlar la navegación con slugs, versiones o estructuras avanzadas.
- Incluir traducciones, internacionalización (i18n) y más.

Puedes consultar más ideas, guías y patrones avanzados directamente en la documentación oficial:

- Guía oficial de Nextra [[ref](https://nextra.site/docs/guide)]

- Funciones avanzadas [[ref](https://nextra.site/docs/advanced)]
