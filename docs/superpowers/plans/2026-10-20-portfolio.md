# Portfolio Gabriel Sosa — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir y publicar en `gabrielsosa32.github.io` un portfolio de una página, en español con botón ES | EN, que presente a Gabriel como desarrollador Full-Stack: proyectos de Teros contados como historias, una sección de datos y animaciones cuidadas.

**Architecture:** Nuxt 4 generado como sitio estático (`nuxt generate`). Todo el texto vive en dos objetos tipados (`es.ts` / `en.ts`) que cumplen una única interfaz `SiteContent`. Los componentes solo renderizan ese contenido. El idioma es estado del cliente (sin recargar). La lógica pura (partir palabras, simulación de la red de puntos, hash ↔ proyecto) está en `app/utils/` y se testea con Vitest.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, CSS propio (sin Tailwind), Vitest, `@nuxt/fonts` (Inter), GitHub Actions → GitHub Pages. Node 24, pnpm 12.

**Spec:** `docs/superpowers/specs/2026-10-20-portfolio-design.md`

**Desviación del spec (decisión de Claude, anotada):** el spec decía `@nuxtjs/i18n`. Con solo dos idiomas, sin rutas por idioma y con cambio sin recarga, alcanza un composable propio de ~20 líneas (`useLang`) y se ahorra la dependencia. El resultado visible es el mismo.

## Global Constraints

- Paleta B: fondo `#fafaf9`, texto `#1c1917`, secundario `#78716c`, bordes `#e7e5e4`, acento `#2563eb`, degradado del titular `#2563eb → #7c3aed`, "en vivo" `#16a34a`. Tipografía Inter. Botones tipo píldora (`border-radius: 999px`), tarjetas blancas con borde suave.
- Español por defecto; botón `ES | EN` en la barra superior; el cambio no recarga y se recuerda en `localStorage` (envuelto en try/catch).
- Título de Gabriel en Teros: **"Desarrollador Full-Stack en Teros (único desarrollador)"**. Nunca "Co-fundador", "CTO" ni "lo hice solo" a secas.
- Frase de rol: *"Único desarrollador: diseñé y programé todo, de la base de datos al despliegue. Las ideas de producto las definimos con mi socio."*
- En los proyectos de Teros se destaca la ingeniería (arquitectura, pagos, IA, hardware, tests, despliegue), no el diseño visual de las pantallas.
- Ubicación: "Funes, Santa Fe, Argentina". Mail: `gabbysosa32@gmail.com`. GitHub `https://github.com/gabrielsosa32`. LinkedIn `https://www.linkedin.com/in/gabrielsosa32/`.
- Toda cifra se verifica contra el código, el notebook o el sitio en vivo antes de ponerla. Si no se puede verificar, no va.
- No linkear repos de Teros (`Teros12/*`) ni los repos `series-prediction` y `Clasificador-imagenes`.
- Ninguna captura muestra datos de clientes o usuarios reales, ni secretos.
- `prefers-reduced-motion: reduce` → sin animación del titular, la red se dibuja quieta.
- Sin scroll horizontal a 360 px de ancho; margen lateral de 16 px en el celular.

## Review Focus

1. **Celular de gama media y ancho de 360 px**: la red de puntos no puede trabar el scroll y no puede haber desborde horizontal (la cinta de tags y las tarjetas). Esperado: scroll fluido, nada cortado. → Tarea 4 (pausa del canvas fuera de pantalla, densidad según ancho) y verificación en la Tarea 8.
2. **Link directo `/#pases` abierto en una pestaña nueva**: el panel tiene que abrirse solo al cargar, y "atrás" lo tiene que cerrar. Un hash desconocido (`#xyz`) no rompe nada. → Tarea 5 (`projectIdFromHash` tests + verificación).
3. **Cambiar de idioma con el panel abierto**: el panel sigue abierto y muestra el mismo proyecto en el otro idioma. → Tarea 5, paso de verificación.
4. **Contenido EN incompleto o desalineado con ES** (falta un proyecto, un campo vacío, una URL distinta). Esperado: el test falla antes de publicar. → Tarea 2 (`content.test.ts`).
5. **`localStorage` bloqueado (modo privado, Safari)**: la página carga en español y el botón funciona igual, solo que no recuerda la elección. → Tarea 3 (test de `useLang` con storage que tira error).

---

## Estructura de archivos

```
Portfolio/
  nuxt.config.ts            # ssr+generate, app.head (lang, meta, OG), fonts
  package.json
  vitest.config.ts
  .gitignore                # incluye .superpowers/ y .output/
  .github/workflows/deploy.yml
  public/
    cv/gabriel-sosa-cv-es.pdf, cv/gabriel-sosa-cv-en.pdf
    img/projects/*.webp     # capturas
    img/og.png              # vista previa 1200x630
    img/photo.webp          # (cuando Gabriel la pase)
  app/
    app.vue                 # monta las secciones en orden
    assets/css/main.css     # tokens y estilos base
    content/types.ts        # SiteContent, Project, …
    content/es.ts, content/en.ts
    composables/useLang.ts  # idioma actual + toggle + content reactivo
    utils/words.ts          # splitWords
    utils/network.ts        # simulación pura de la red
    utils/hash.ts           # projectIdFromHash / hashForProject
    components/
      SiteNav.vue, HeroSection.vue, TitleReveal.vue, NetworkBackground.vue,
      ProjectsSection.vue, ProjectCard.vue, ProjectPanel.vue,
      DataSection.vue, AboutSection.vue, ContactSection.vue
  tests/
    content.test.ts, lang.test.ts, words.test.ts, network.test.ts, hash.test.ts
```

---

### Task 1: Esqueleto del proyecto, repo propio y estilos base

**Files:**
- Create: `package.json`, `nuxt.config.ts`, `vitest.config.ts`, `.gitignore`, `app/app.vue`, `app/assets/css/main.css`, `tests/smoke.test.ts`

**Interfaces:**
- Produces: clases CSS globales `.container` (max-width 1080px, padding 0 16px), `.section`, `.pill`, `.pill--dark`, `.card`, `.tag`, `.eyebrow`; variables CSS `--bg --fg --muted --border --accent --accent-2 --live --card`.

- [ ] **Step 1:** `git init` dentro de `C:\Users\gabby\Documents\Teros\Portfolio` (tiene que quedar con su propio `.git`; verificar con `git rev-parse --show-toplevel` → `.../Teros/Portfolio`). Rama `main`.
- [ ] **Step 2:** Crear la app Nuxt 4 a mano (sin el asistente interactivo): `pnpm add nuxt vue vue-router` y `pnpm add -D vitest @nuxt/fonts typescript`. Scripts: `dev`, `generate`, `preview`, `test: vitest run`, `postinstall: nuxt prepare`.
- [ ] **Step 3:** `nuxt.config.ts`: `compatibilityDate` actual, `modules: ['@nuxt/fonts']`, `css: ['~/assets/css/main.css']`, `app.baseURL: '/'` (user page), `app.head.htmlAttrs.lang: 'es'`, `nitro.prerender.routes: ['/']`.
- [ ] **Step 4:** `.gitignore`: `node_modules`, `.nuxt`, `.output`, `.data`, `dist`, `.superpowers/`.
- [ ] **Step 5:** `main.css` con los tokens de Global Constraints, reset mínimo, `body{background:var(--bg);color:var(--fg);font-family:Inter,system-ui,sans-serif}` y las clases de Interfaces.
- [ ] **Step 6:** `tests/smoke.test.ts` con `expect(1+1).toBe(2)`; `vitest.config.ts` con `environment: 'node'` y `include: ['tests/**/*.test.ts']`. Run: `pnpm test` → PASS.
- [ ] **Step 7:** Run: `pnpm generate` → termina sin errores y existe `.output/public/index.html`.
- [ ] **Step 8:** Commit `chore: esqueleto Nuxt 4 + estilos base`.

---

### Task 2: Modelo de contenido y textos ES/EN

**Files:**
- Create: `app/content/types.ts`, `app/content/es.ts`, `app/content/en.ts`, `tests/content.test.ts`

**Interfaces:**
- Produces:
```ts
export type Lang = 'es' | 'en'
export type ProjectStatus = 'live' | 'pilot' | 'in-progress'
export interface Project {
  id: 'pases' | 'reservas' | 'plugo' | 'resortes'
  name: string; status: ProjectStatus; url?: string
  tagline: string            // 1 línea: el problema que resuelve
  stack: string[]
  image: string              // '/img/projects/<id>.webp'
  imageAlt: string
  problem: string            // párrafo
  built: string[]            // qué construí (bullets)
  hard: string[]             // lo difícil (bullets)
  result: string[]           // resultado (bullets, cifras verificadas)
}
export interface MiniProject { name: string; description: string; stack: string[] }
export interface DataProject { name: string; metric?: string; description: string; repo?: string }
export interface SiteContent {
  meta: { title: string; description: string }
  nav: { projects: string; data: string; about: string; contact: string }
  hero: { role: string; location: string; titleLead: string; titleHighlight: string; subtitle: string; availability: string; cta: { cv: string; contact: string } ; cvHref: string }
  projects: { eyebrow: string; title: string; more: string; close: string; live: string; labels: { problem: string; built: string; hard: string; result: string; visit: string }; main: Project[]; others: MiniProject[] }
  data: { eyebrow: string; title: string; intro: string; projects: DataProject[]; tools: string[]; certificates: string[] }
  about: { eyebrow: string; title: string; paragraphs: string[]; role: string; howIWork: string[]; stack: string[] }
  contact: { title: string; subtitle: string; email: string; github: string; linkedin: string }
}
```
  El titular del hero se arma como `titleLead + titleHighlight`. Lo que va en degradado es `titleHighlight` (ES: lead "Armo productos completos, de la", highlight "idea a producción.").

- [ ] **Step 1: Test que falla** — `tests/content.test.ts`:
  - `es.projects.main.map(p => p.id)` igual a `en...` y igual a `['pases','reservas','plugo','resortes']`.
  - Para cada `Project` en ambos idiomas: `tagline, problem` no vacíos; `built, hard, result` con largo ≥ 2; `url` y `image` y `stack` idénticos entre ES y EN.
  - `others.length` y `data.projects.length` iguales entre idiomas; `repo` idénticos.
  - Ningún string del contenido (recorrido recursivo) contiene `/Co-?fundador|CTO|Co-?founder|TODO|lorem/i`.
  - Ningún `repo`/`url` contiene `Teros12`, `series-prediction` ni `Clasificador-imagenes`; todas empiezan con `https://`.
  - `es.about.role` contiene "Único desarrollador".
- [ ] **Step 2:** Run `pnpm test` → FAIL (módulos no existen).
- [ ] **Step 3: Investigación de cada proyecto (solo lectura).** Para Pases (`Documents\Teros\entradas-app`), Reservas (`tero-reservas`), Plugo (`toma-app`) y Resortes (`ResortesV2`), leer README, docs y estructura, y escribir `problem / built / hard / result`. Reglas:
  - Cada cifra sale de algo contado en el repo (por ejemplo `git rev-list --count HEAD`, cantidad de archivos `*.test.ts`) y se redondea hacia abajo ("más de 90 archivos de test").
  - El estado `live` solo si la URL responde con el producto (abrir `pases.teros.com.ar`, `reservas.teros.com.ar`, `resortesnv.com.ar`; para Plugo probar `plugo.com.ar` y si no responde, va `pilot` sin `url`).
  - Nunca copiar `.env` ni nada que parezca una clave o una URL interna (`*.railway.app`).
  - Otros: Techos, Teros Pedidos, Avatar Companion, Scraper de leads (una línea cada uno).
  - Datos: Vuelos (repo `Flight-price-prediction`, R² verificado en el notebook `Data Science\Proyectos\Vuelos\PruebaFinal.ipynb`), Noticias falsas (`tp-final-deep-learning`, accuracy verificada en `TPFinalSosaGabriel.ipynb`), Casas (`house-price-prediction`), Enfermedad cardíaca / Boosting (`Boostingmodels`), Churn (`churn-prediction`). Certificados: un nombre por certificado distinto en `Data Science\Certificados Data Cience\` (los duplicados de SQL cuentan una vez).
  - Textos de "Sobre mí" y del hero: reutilizar tono y datos de `Documents\Portfolio\cv.html` y `plantillas-mail.md`, aplicando el título nuevo.
- [ ] **Step 4:** Escribir `es.ts` (fuente de verdad) y después `en.ts` como traducción natural (no literal). `cvHref`: `/cv/gabriel-sosa-cv-es.pdf` / `...-en.pdf`.
- [ ] **Step 5:** Run `pnpm test` → PASS.
- [ ] **Step 6:** Escribir `docs/fuentes-de-cifras.md`: cada cifra del sitio → de dónde sale. Así Gabriel puede defenderla en una entrevista.
- [ ] **Step 7:** Commit `feat: contenido ES/EN de proyectos y datos`.

---

### Task 3: Idioma, barra superior y presentación con titular animado

**Files:**
- Create: `app/composables/useLang.ts`, `app/utils/words.ts`, `app/components/SiteNav.vue`, `app/components/HeroSection.vue`, `app/components/TitleReveal.vue`, `tests/lang.test.ts`, `tests/words.test.ts`
- Modify: `app/app.vue`

**Interfaces:**
- Consumes: `SiteContent`, `Lang`, `es`, `en` (Tarea 2).
- Produces:
  - `useLang(): { lang: Ref<Lang>; content: ComputedRef<SiteContent>; toggle(): void; setLang(l: Lang): void }`. Usa `useState('lang', () => 'es')`. Al montar lee `localStorage['lang']`; al cambiar guarda y actualiza `document.documentElement.lang`.
  - Helpers puros exportados para testear: `readStoredLang(storage: Pick<Storage,'getItem'> | undefined): Lang` y `storeLang(storage: Pick<Storage,'setItem'> | undefined, l: Lang): void`. Ninguno tira error.
  - `splitWords(text: string): string[]`: separa por espacios y descarta los vacíos.
  - Ids de sección para la barra: `#proyectos`, `#datos`, `#sobre-mi`, `#contacto`.

- [ ] **Step 1: Tests que fallan.**
  - `readStoredLang(undefined) === 'es'`; storage que devuelve `'en'` → `'en'`; devuelve `'fr'` → `'es'`; `getItem` que tira error → `'es'`.
  - `storeLang` con `setItem` que tira error no tira.
  - `splitWords('  Armo  productos ') ` → `['Armo','productos']`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implementar. **Step 4:** Run → PASS.
- [ ] **Step 5:** `SiteNav`: nombre a la izquierda; links + botón `ES | EN` (con el idioma activo en negrita, `aria-label` "Cambiar idioma / Switch language"). En menos de 640 px los links se esconden y queda nombre + botón. Barra fija arriba con fondo semitransparente y `backdrop-filter`.
- [ ] **Step 6:** `TitleReveal` (props `lead: string`, `highlight: string`): cada palabra es un `<span>` con `animation-delay: i*90ms` (entra desde `translateY(24px) rotate(4deg)`, 700 ms, `cubic-bezier(.2,.8,.2,1)`). Las palabras de `highlight` llevan el degradado. Hay que mantener el texto completo accesible (`aria-label` en el `h1`, spans `aria-hidden`). Con `prefers-reduced-motion` no hay animación. Al cambiar de idioma se re-anima (`:key="lang"`).
- [ ] **Step 7:** `HeroSection`: foto (`/img/photo.webp` si existe; si no, círculo "GS"), rol · ubicación en azul, `TitleReveal`, subtítulo, disponibilidad en verde con punto, botones CV (`download`), Contacto (`#contacto`), GitHub y LinkedIn (`target=_blank rel=noopener`). Deja un slot o contenedor de fondo para la Tarea 4.
- [ ] **Step 8: Verificación visual:** `pnpm dev`, abrir en el panel del navegador. El titular entra animado, ES ↔ EN cambia todo sin recargar y al recargar se recuerda. A 360 px no hay desborde.
- [ ] **Step 9:** Commit `feat: hero, nav e idioma ES/EN`.

---

### Task 4: Fondo de red de puntos

**Files:**
- Create: `app/utils/network.ts`, `app/components/NetworkBackground.vue`, `tests/network.test.ts`
- Modify: `app/components/HeroSection.vue`

**Interfaces:**
- Produces:
```ts
export interface Node { x: number; y: number; vx: number; vy: number }
export function createNodes(count: number, w: number, h: number, rand?: () => number): Node[]
export function stepNodes(nodes: Node[], w: number, h: number, mouse: { x: number; y: number } | null): void // muta
export function nodeCountFor(width: number): number   // 360px → ~25, 1440px → ~70, tope 80
export function linkAlpha(dist: number, maxDist: number): number // 0 si dist>=max, lineal hasta 1
```

- [ ] **Step 1: Tests que fallan:**
  - `createNodes(10, 100, 50, () => 0.5)` → 10 nodos dentro de `[0,100]×[0,50]`.
  - Después de 500 `stepNodes` sin mouse, todos siguen dentro de los límites (rebotan).
  - Un nodo a 10 px del mouse se aleja (la distancia aumenta después de un paso).
  - `nodeCountFor(360) < nodeCountFor(1440)`, `nodeCountFor(5000) <= 80`.
  - `linkAlpha(0,80)===1`, `linkAlpha(80,80)===0`, `linkAlpha(100,80)===0`.
- [ ] **Step 2:** FAIL → **Step 3:** implementar → **Step 4:** PASS.
- [ ] **Step 5:** `NetworkBackground.vue`: `<canvas>` absoluto detrás del hero, `aria-hidden`. Tiene en cuenta `devicePixelRatio` (máximo 2) y se recalcula con `ResizeObserver`. Usa `IntersectionObserver` para pausar el `requestAnimationFrame` cuando el hero no está en pantalla, y lo pausa también con `document.hidden`. Con `prefers-reduced-motion` dibuja un solo cuadro. Color de puntos y líneas: acento con opacidad baja (≈0.35 máx.) para no competir con el texto. Mouse = `pointermove` sobre el hero (en el táctil no hay mouse, solo deriva).
- [ ] **Step 6: Verificación:** en el panel con viewport `mobile` el scroll es fluido. En DevTools Performance (o `javascript_tool` midiendo frames durante 3 s) no hay frames largos sostenidos. Al scrollear fuera del hero, el loop se detiene (log temporal o contador).
- [ ] **Step 7:** Commit `feat: fondo de red animada`.

---

### Task 5: Proyectos — tarjetas y panel "Ver más" con URL propia

**Files:**
- Create: `app/utils/hash.ts`, `app/components/ProjectsSection.vue`, `app/components/ProjectCard.vue`, `app/components/ProjectPanel.vue`, `tests/hash.test.ts`

**Interfaces:**
- Consumes: `Project`, `useLang` (Tareas 2–3).
- Produces: `projectIdFromHash(hash: string, ids: readonly string[]): string | null` y `hashForProject(id: string): string` (→ `#pases`).

- [ ] **Step 1: Tests que fallan:** `projectIdFromHash('#pases', ids) === 'pases'`; `'#PASES'` → `'pases'`; `'#xyz'` → `null`; `''` → `null`; `'#proyectos'` → `null`; `hashForProject('plugo') === '#plugo'`.
- [ ] **Step 2–4:** FAIL → implementar → PASS.
- [ ] **Step 5:** `ProjectCard`: captura (`<img loading="lazy" width height>`), nombre, chip verde "● en vivo" si `status==='live'`, tagline, stack como tags y botón "Ver más". La grilla es de 2 columnas en ≥ 768 px y 1 columna debajo. Animación sutil de hover (sombra y `translateY(-2px)`).
- [ ] **Step 6:** `ProjectPanel`: usa `<dialog>` nativo (`showModal`), que da foco atrapado y Esc. Contiene título, estado, captura grande, las cuatro secciones con sus `labels`, botón "Visitar sitio" si hay `url` y botón cerrar. Abrir hace `history.pushState(null,'',hashForProject(id))`; cerrar (botón, Esc o clic en el fondo) hace `history.back()` si lo abrió la página, o `replaceState` sin hash si se entró con el link directo. Escucha `popstate`/`hashchange` → abre o cierra según `projectIdFromHash`. Al montar, si el hash es de un proyecto, lo abre. El body no scrollea mientras está abierto. En celular el panel ocupa toda la pantalla.
- [ ] **Step 7:** `ProjectsSection` (`id="proyectos"`): eyebrow + título, grilla de los 4 principales y debajo los `others` como fila de tarjetas chicas (nombre + 1 línea).
- [ ] **Step 8: Verificación (Review Focus 2 y 3):** abrir `/#pases` en una pestaña nueva → se abre el panel. Botón atrás → se cierra. `/#xyz` → página normal. Con el panel abierto, cambiar a EN → el mismo proyecto en inglés.
- [ ] **Step 9:** Commit `feat: proyectos con panel de detalle`.

---

### Task 6: Datos, Sobre mí y Contacto

**Files:**
- Create: `app/components/DataSection.vue`, `app/components/AboutSection.vue`, `app/components/ContactSection.vue`
- Modify: `app/app.vue` (orden final: Nav, Hero, Projects, Data, About, Contact)

**Interfaces:**
- Consumes: `content.data`, `content.about`, `content.contact` (Tarea 2).

- [ ] **Step 1:** `DataSection` (`id="datos"`, fondo `#f5f5f4`): intro de una línea; tarjetas con `metric` grande en azul cuando existe, link "Ver código" al `repo`; tools como tags; certificados como lista con nombre.
- [ ] **Step 2:** `AboutSection` (`id="sobre-mi"`): párrafos, la frase `role` destacada (cita con borde izquierdo azul), lista "cómo trabajo", stack como tags.
- [ ] **Step 3:** `ContactSection` (`id="contacto"`, fondo `#1c1917`, texto claro): título "¿Hablamos?", botones mail (`mailto:`), LinkedIn, GitHub y Descargar CV. Pie con "© 2026 Gabriel Sosa".
- [ ] **Step 4:** Aparición suave al scrollear las secciones (opacity + translateY 12px, una vez, con `IntersectionObserver`; nada con reduced-motion). El contenido es visible sin JS (la clase oculta solo se aplica si JS corrió).
- [ ] **Step 5: Verificación:** recorrer la página completa en ES y EN, en desktop y a 360 px. Todos los links abren donde deben y `pnpm test` está verde.
- [ ] **Step 6:** Commit `feat: secciones datos, sobre mí y contacto`.

---

### Task 7: Capturas, CV en PDF, imagen para compartir y metadatos

**Files:**
- Create: `public/img/projects/{pases,reservas,plugo,resortes}.webp`, `public/cv/gabriel-sosa-cv-es.pdf`, `public/cv/gabriel-sosa-cv-en.pdf`, `public/img/og.png`, `scripts/` (scripts de captura, opcional)
- Modify: `nuxt.config.ts` (`app.head`)

- [ ] **Step 1: Capturas** (1280×800, convertidas a WebP de ≤ 150 KB) de las páginas **públicas** de cada producto con el navegador del panel. Antes de guardar, mirar cada captura: no puede haber nombres, mails, teléfonos ni datos de clientes reales. Si la única pantalla interesante tiene datos reales, se usa la landing o la página de login. Si Plugo no tiene página pública, una captura de la pantalla de pago en local con datos de prueba o, si no, una ilustración simple con el logo.
- [ ] **Step 2: CV.** Partir de `Documents\Portfolio\cv.html`. Hacer una copia en `docs/cv/cv-es.html` con el título nuevo "Desarrollador Full-Stack en Teros (único desarrollador)", el link al portfolio y las mismas cifras que la página. Traducirla a `cv-en.html` e imprimir ambas a PDF con el navegador headless (`chrome --headless --print-to-pdf`). Verificar que el PDF tiene texto seleccionable (para los ATS).
- [ ] **Step 3: OG image** 1200×630: fondo `#fafaf9`, "Gabriel Sosa", "Desarrollador Full-Stack", la frase del titular. Se genera con un HTML + captura headless.
- [ ] **Step 4:** `app.head`: `title`, `description`, `og:title/description/image` (URL absoluta `https://gabrielsosa32.github.io/img/og.png`), `og:type=website`, `twitter:card=summary_large_image`, favicon simple (círculo con "GS"), `theme-color`. El `title` y la `description` se actualizan con el idioma vía `useHead`.
- [ ] **Step 5: Verificación:** `pnpm generate`. Abrir `.output/public` con `pnpm preview` y comprobar que cargan las 4 imágenes, que los dos PDFs se descargan desde ES y EN y que no hay 404 en la consola de red.
- [ ] **Step 6:** Commit `feat: capturas, CV PDF y metadatos`.

---

### Task 8: Pulido final — accesibilidad, rendimiento y celular

**Files:** Modify: los que haga falta.

- [ ] **Step 1:** Con el sitio generado (`pnpm preview`), correr Lighthouse en modo móvil (`npx lighthouse http://localhost:3000 --preset=perf --form-factor=mobile --quiet --chrome-flags=--headless` y una corrida sin preset). Objetivo: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95. Arreglar lo que baje de eso.
- [ ] **Step 2:** Revisión con el viewport `mobile` del panel (375 px) y uno de 360 px: sin scroll horizontal (`document.documentElement.scrollWidth <= innerWidth` vía `javascript_tool`), botones de al menos 44 px de alto, el panel de proyecto ocupa toda la pantalla y se cierra bien.
- [ ] **Step 3:** Navegación solo con teclado: se pueden alcanzar los links, el botón de idioma, "Ver más" y el cierre del panel; el foco es visible.
- [ ] **Step 4:** Emular `prefers-reduced-motion: reduce` y confirmar que no hay animaciones.
- [ ] **Step 5:** Commit `chore: pulido de accesibilidad y rendimiento`.

---

### Task 9: Publicar en GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md` (corto: qué es, cómo correrlo, dónde se editan los textos: `app/content/es.ts` y `en.ts`)

- [ ] **Step 1:** `deploy.yml`: on push a `main` + `workflow_dispatch`. Pasos: checkout, `pnpm/action-setup`, `actions/setup-node` con Node 24 y cache pnpm, `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm generate`, `actions/upload-pages-artifact` con `.output/public`, `actions/deploy-pages`. Permisos `pages: write`, `id-token: write`. Agregar `public/.nojekyll`.
- [ ] **Step 2: (Gabriel)** Crear en GitHub el repo público **`gabrielsosa32.github.io`**, vacío, y en Settings → Pages elegir "Source: GitHub Actions". No hay `gh` CLI en esta máquina, así que lo hace él desde la web. Avisarle y esperar su confirmación.
- [ ] **Step 3: Pedir confirmación antes de pushear** (es publicar): `git remote add origin https://github.com/gabrielsosa32/gabrielsosa32.github.io.git` y `git push -u origin main`.
- [ ] **Step 4: Verificar el CI** (regla de Gabriel: un push no está terminado hasta que el run quede verde). Revisar el run en `https://github.com/gabrielsosa32/gabrielsosa32.github.io/actions`. Si falla, leer el log y arreglarlo.
- [ ] **Step 5:** Abrir `https://gabrielsosa32.github.io` y `https://gabrielsosa32.github.io/#pases` en el navegador y repetir la verificación rápida: ES/EN, panel, CV y sin errores en consola.
- [ ] **Step 6:** Commit del README si cambió y entregarle a Gabriel el link junto con la lista de textos para revisar (`docs/fuentes-de-cifras.md`).
