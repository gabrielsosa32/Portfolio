# Rediseño "Sala de control" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la portada por un panel con 4 demos animadas de los productos y llevar toda la página a un lenguaje visual de "sala de control", con fondo animado continuo.

**Architecture:** Mismo Nuxt 4 estático. Lo nuevo se suma sin tocar el contenido verificado: nuevos campos en `SiteContent` (ES/EN) para las demos y la portada, tres componentes de demo con su lógica pura en `app/utils/` (testeada), un composable compartido que decide cuándo animar (`useInView`), y un composable `usePanel` que saca del componente de proyectos el estado del panel "Ver más" para que también lo abran los cuadros de la portada. El resto es CSS y plantillas.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Vitest, `@nuxt/fonts` (Inter + JetBrains Mono).

**Spec:** `docs/superpowers/specs/2026-10-22-rediseno-sala-de-control-design.md` (y el diseño original `docs/superpowers/specs/2026-10-20-portfolio-design.md` en lo que no cambia).

## Global Constraints

- Trabajo en la rama `rediseno-sala-de-control`. **No se mergea a `main` ni se pushea sin el OK de Gabriel** (`main` publica).
- No cambian textos ni cifras existentes; solo se agregan claves nuevas, siempre en ES y EN con la misma estructura (`tests/parity.test.ts`).
- Las reglas de contenido siguen: nada de "co-fundador/CTO", "único desarrollador/sole developer", "hardware", datos de contacto de terceros, links a repos privados.
- Las demos usan datos inventados y lo dicen una sola vez para toda la grilla: ES "Demos con datos de ejemplo de productos reales", EN "Demos with sample data from real products". Prohibido el texto "todo esto está andando ahora" o similares.
- Las demos animan solo en pantalla; con `prefers-reduced-motion: reduce` muestran su estado final quieto.
- Monoespaciada (JetBrains Mono) solo para etiquetas, fichas, `git log`, terminal y cifras; los párrafos siguen en Inter.
- A 360 px: sin scroll horizontal, botones ≥ 44 px de alto.
- Paleta: la oscura actual (`main.css`), más ámbar `#fbbf24` para los hashes del `git log`.

## Review Focus

1. **Abrir un "Ver más" desde la portada y apretar "atrás":** tiene que cerrar el panel y seguir en la página, igual que desde Proyectos. → Tarea 4 (tests de `usePanel` reusan `createPanelHistory`; verificación en navegador).
2. **Teléfono de gama media con 4 demos + fondo:** scroll fluido. → Tarea 3 (`useInView` pausa fuera de pantalla) y Tarea 8 (medición).
3. **Pestaña en segundo plano:** los timers de las demos no se acumulan ni "corren" de golpe al volver. → Tarea 3 (test de `useInView`: `document.hidden` pausa).
4. **Cambio de idioma con las demos andando:** las demos reinician en el otro idioma sin quedar mitad y mitad. → Tarea 3 (las demos se reinician al cambiar `demo` por props).
5. **Total del presupuesto de Techos coherente con sus ítems** en ES y EN (si alguien edita un ítem). → Tarea 2 (test que suma los ítems y compara con el total mostrado).

---

## Estructura de archivos

```
app/
  assets/css/main.css            # + fondo global (grilla), .eyebrow monoespaciada "// ", tokens nuevos
  content/types.ts               # + HeroDemos, DoorDemo, ChargeDemo, QuoteDemo, DataProject.score, hero.intro/demoNote
  content/es.ts, en.ts           # + textos/datos de las demos y de la portada
  utils/demos.ts                 # NUEVO: lógica pura de las 3 demos nuevas
  composables/useInView.ts       # NUEVO: animar solo en pantalla / pestaña visible / sin reduced-motion
  composables/usePanel.ts        # NUEVO: estado global del panel "Ver más" (sale de ProjectsSection)
  components/
    SiteBackground.vue           # NUEVO: capa fija detrás de todo (grilla + NetworkBackground)
    NetworkBackground.vue        # prop `fixed` (mide la ventana en vez del padre)
    HeroSection.vue              # reescrito: columna de presentación + grilla 2×2 de DemoTile
    DemoTile.vue                 # NUEVO: marco del cuadro (nombre, estado, clic → panel)
    DoorDemo.vue, ChargeDemo.vue, QuoteDemo.vue   # NUEVOS
    BotChatDemo.vue              # usa useInView
    ProjectsSection.vue          # casos alternados; usa usePanel
    ProjectCase.vue              # NUEVO (reemplaza ProjectCard.vue, que se borra)
    ProjectPanel.vue             # muestra la demo del producto si tiene
    ExperienceSection.vue        # estilo git log
    TestimonialSection.vue       # estilo comentario de código
    DataSection.vue              # medidores
    AboutSection.vue             # panel con checklist
    ContactSection.vue           # terminal
    TitleReveal.vue              # se borra (ya no hay titular animado)
tests/
  demos.test.ts, inview.test.ts, panel.test.ts (NUEVOS), content.test.ts (+ casos)
```

---

### Task 1: Fondo global y tipografía de código

**Files:** Create `app/components/SiteBackground.vue` · Modify `app/components/NetworkBackground.vue`, `app/app.vue`, `app/components/HeroSection.vue` (quitar `<NetworkBackground />`), `app/assets/css/main.css`, `nuxt.config.ts`

**Interfaces:** Produces clase global `.eyebrow` en monoespaciada con prefijo `// ` (vía `::before`), variable `--mono`, y `<SiteBackground />` montado una vez en `app.vue` antes de `<SiteNav />`.

- [ ] **Step 1:** `nuxt.config.ts`: agregar `{ name: 'JetBrains Mono', provider: 'google', weights: [400, 500, 700] }` a `fonts.families`. `main.css`: `--mono: 'JetBrains Mono', Consolas, monospace;`, `.eyebrow { font-family: var(--mono); letter-spacing: .06em; text-transform: none }` con `.eyebrow::before { content: '// '; color: var(--muted) }`.
- [ ] **Step 2:** `NetworkBackground.vue` acepta `fixed?: boolean`. Con `fixed`, el canvas es `position: fixed; inset: 0; z-index: -1`, mide `window.innerWidth/innerHeight`, escucha `resize` (no `ResizeObserver` del padre) y escucha `pointermove` en `window`; no usa `IntersectionObserver` (siempre visible) pero sí `visibilitychange`. Sin máscara de degradado. Opacidad de líneas ≈ 0.16, puntos ≈ 0.35 (más tenue que hoy).
- [ ] **Step 3:** `SiteBackground.vue`: un `div` fijo a pantalla completa (`z-index: -2`, `pointer-events: none`, `aria-hidden`) con la grilla (`linear-gradient` de líneas `rgba(var(--net-rgb), .05)` cada 32 px) + `<NetworkBackground fixed />`. `body` deja de pintar fondo propio debajo (el `background` de `body` queda en `var(--bg)` y la capa va encima con `z-index` negativo dentro de un contexto `isolation: isolate` en `#__nuxt`).
- [ ] **Step 4: Verificación:** `pnpm dev`; al bajar hasta Contacto la grilla y los puntos siguen visibles; las secciones con fondo propio (`section--alt`, contacto) pasan a fondo semitransparente (`rgb(18 16 14 / .7)`) para que la grilla se intuya. `pnpm test` → todo verde (no cambia lógica).
- [ ] **Step 5:** Commit `feat: fondo animado en toda la página y tipografía de código`.

---

### Task 2: Contenido de las demos y de la portada (ES/EN)

**Files:** Modify `app/content/types.ts`, `app/content/es.ts`, `app/content/en.ts`, `tests/content.test.ts`

**Interfaces:**
- Produces (en `types.ts`):
```ts
export interface DoorDemo { label: string; event: string; verdict: string; countLabel: string; startCount: number }
export interface ChargeDemo { label: string; place: string; status: string; startSeconds: number; paid: string }
export interface QuoteDemo { label: string; title: string; items: { description: string; amount: number }[]; total: number }
export interface HeroDemos { note: string; door: DoorDemo; charge: ChargeDemo; quote: QuoteDemo }
// SiteContent.hero gana: intro: string; demos: HeroDemos
// DataProject gana: score?: number   // 0..1, para la barra del medidor
// SiteContent.projects gana: caseLabels: { stack: string; hard: string; result: string }  // ES 'stack' / 'lo difícil' / 'resultado' · EN 'stack' / 'hard part' / 'result'
```
- Valores fijos: `quote.items` = los 5 del presupuesto de demostración de Techos (`Retiro de chapas dañadas y limpieza` 85000; `Chapa sinusoidal galvanizada C25 (24 m²)` 444000; `Membrana aislante bajo chapa (24 m²)` 100800; `Cumbrera y babetas de zinguería (8 ml)` 96000; `Mano de obra` 320000), `total` 1045800. `door.startCount` 212, `door.verdict` "ADENTRO"/"IN". `charge.startSeconds` 2825 (47:05), `charge.paid` "Cobraste $ 2.800 · 1 h" / "You earned $ 2,800 · 1 h". `hero.demos.note` = las frases de Global Constraints. `hero.intro` ES "Estos productos los diseñé y programé yo. Hacé clic en cualquiera para ver cómo están hechos." / EN "I designed and built these products. Click any of them to see how they work.". `score` de datos: vuelos 0.97, fake news 0.91, corazón 0.89, churn 0.86, casas 0.63.

- [ ] **Step 1: Tests que fallan** en `tests/content.test.ts`:
  - `test('el total del presupuesto de demo es la suma de sus ítems')`: para `es` y `en`, `sum(items.amount) === quote.total` y `quote.total === 1045800`.
  - `test('la portada aclara que las demos usan datos de ejemplo y no dice que está todo andando')`: `es.hero.demos.note` contiene "datos de ejemplo"; `en.hero.demos.note` contiene "sample data"; ningún string de `hero` matchea `/andando ahora|running now|en vivo ahora/i`.
  - `test('cada proyecto de datos con métrica tiene score entre 0 y 1')`.
- [ ] **Step 2:** `pnpm test` → FAIL (campos inexistentes).
- [ ] **Step 3:** Agregar tipos y contenido ES/EN con los valores de arriba (los campos viejos `titleLead`/`titleHighlight`/`subtitle` se mantienen: los usan el `og` y `meta`; solo dejan de mostrarse).
- [ ] **Step 4:** `pnpm test` → PASS (incluye paridad ES/EN).
- [ ] **Step 5:** Commit `feat: contenido de las demos de la portada`.

---

### Task 3: Lógica de las demos y cuándo animar

**Files:** Create `app/utils/demos.ts`, `app/composables/useInView.ts`, `tests/demos.test.ts`, `tests/inview.test.ts` · Modify `app/components/BotChatDemo.vue`

**Interfaces:**
- Produces (`utils/demos.ts`):
```ts
export function formatClock(totalSeconds: number): string          // 2825 → "47:05"; negativos → "00:00"
export function chargeProgress(remaining: number, total: number): number // 0..1, acotado
export function quoteSteps(items: { amount: number }[]): number[]  // totales acumulados: [85000, 529000, ...]
export function formatMoney(n: number, lang: 'es' | 'en'): string  // es "$ 1.045.800" · en "$ 1,045,800"
```
- Produces (`composables/useInView.ts`):
```ts
export function shouldAnimate(s: { visible: boolean; hidden: boolean; reduced: boolean }): boolean
export function useInView(target: Ref<HTMLElement | null>, opts?: { threshold?: number }): { active: Readonly<Ref<boolean>>; reduced: Readonly<Ref<boolean>> }
```
  `active` = `shouldAnimate(...)` reactivo (IntersectionObserver + `visibilitychange` + `matchMedia`). Las demos arrancan su loop cuando `active` pasa a true y limpian sus timers cuando pasa a false.

- [ ] **Step 1: Tests que fallan:** `formatClock(2825) === '47:05'`, `formatClock(59) === '00:59'`, `formatClock(-3) === '00:00'`; `chargeProgress(0, 3600) === 1`, `chargeProgress(3600, 3600) === 0`, `chargeProgress(5000, 3600) === 0`; `quoteSteps([{amount:1},{amount:2},{amount:3}])` → `[1,3,6]`; `formatMoney(1045800,'es') === '$ 1.045.800'`, `formatMoney(1045800,'en') === '$ 1,045,800'`; `shouldAnimate` es true solo con `{visible:true, hidden:false, reduced:false}` (probar las 3 negaciones).
- [ ] **Step 2:** `pnpm test` → FAIL. **Step 3:** implementar. **Step 4:** `pnpm test` → PASS.
- [ ] **Step 5:** `BotChatDemo.vue` pasa a usar `useInView` (sin su propio `IntersectionObserver`) y reinicia el loop cuando cambia `props.demo` (Review Focus 4). Verificar en navegador que el chat sigue funcionando y que, al cambiar ES↔EN, arranca de cero en el otro idioma.
- [ ] **Step 6:** Commit `feat: lógica de las demos y animación solo en pantalla`.

---

### Task 4: Panel "Ver más" compartido

**Files:** Create `app/composables/usePanel.ts`, `tests/panel.test.ts` · Modify `app/components/ProjectsSection.vue`

**Interfaces:**
- Produces: `usePanel(): { openId: Ref<ProjectId | null>; open(id: ProjectId): void; close(): void; init(ids: ProjectId[]): void }`. Estado en `useState('panel-open')`; usa `createPanelHistory` y `projectIdFromHash` tal como hoy hace `ProjectsSection` (mover esa lógica, no reescribirla). `init` registra `popstate`/`hashchange` una sola vez aunque se llame dos veces.
- Pure helper testeable: `export function nextPanelState(current: ProjectId | null, action: { type: 'open', id } | { type: 'close' } | { type: 'hash', id: ProjectId | null }): ProjectId | null`.

- [ ] **Step 1: Tests que fallan** (`tests/panel.test.ts`): `nextPanelState(null, {type:'open', id:'pases'}) === 'pases'`; `nextPanelState('pases', {type:'close'}) === null`; `nextPanelState('pases', {type:'hash', id:null}) === null`; `nextPanelState(null, {type:'hash', id:'techos'}) === 'techos'`.
- [ ] **Step 2–4:** FAIL → implementar → PASS (los 7 tests de `panelHistory.test.ts` siguen en verde).
- [ ] **Step 5:** `ProjectsSection.vue` usa `usePanel()`; `<ProjectPanel>` se monta una sola vez en `app.vue` (no dentro de la sección) leyendo `usePanel().openId`.
- [ ] **Step 6: Verificación (Review Focus 1):** abrir desde Proyectos → atrás cierra; `/#plugo` directo → abre y atrás cierra sin salir del sitio.
- [ ] **Step 7:** Commit `refactor: estado del panel compartido`.

---

### Task 5: Portada "Panel en vivo"

**Files:** Create `app/components/DemoTile.vue`, `DoorDemo.vue`, `ChargeDemo.vue`, `QuoteDemo.vue` · Rewrite `app/components/HeroSection.vue` · Delete `app/components/TitleReveal.vue`, `app/utils/words.ts`, `tests/words.test.ts`

**Interfaces:**
- Consumes: `hero.demos`, `projects.botDemo`, `projects.main` (nombre/estado), `usePanel().open`, `useInView`, `utils/demos.ts`.
- `DemoTile` props `{ project: Project; statusLabel: string }`, slot por defecto = la demo; todo el cuadro es un `<button>`-like accesible: contenedor `role="button"` `tabindex="0"` con `aria-label="{projects.more}: {name}"`, Enter/Espacio y clic → `usePanel().open(project.id)`. (No `<button>` real porque la demo tiene bloques adentro.)
- `DoorDemo` props `{ demo: DoorDemo }`: QR dibujado como SVG de módulos (patrón fijo generado con un seed, con los 3 "ojos" de esquina), línea de escaneo, cada ~2.7 s overlay verde con `verdict` y contador +1 (`countLabel: N`).
- `ChargeDemo` props `{ demo: ChargeDemo }`: anillo `conic-gradient` con `chargeProgress`, reloj `formatClock` descontando 1/s desde `startSeconds` y reiniciando en 40:00, texto `paid`.
- `QuoteDemo` props `{ demo: QuoteDemo; lang }`: filas que aparecen cada ~0.7 s con `formatMoney`, total acumulado con `quoteSteps`, pausa 2.8 s y reinicia.
- `HeroSection` layout: ≥ 1024 px grid `minmax(260px, 1fr) 2fr`; columna izquierda: foto (88 px), nombre (h1, `Gabriel Sosa`), rol + ubicación, disponibilidad con pulso, `hero.intro`, botones (CV, Contacto, GitHub, LinkedIn); derecha: grilla 2×2 de `DemoTile` en orden Reservas, Pases, Plugo, Techos, alto mínimo de cuadro 210 px, y debajo `hero.demos.note` en monoespaciada chica. < 1024 px: una columna; grilla 2×2 a partir de 640 px; < 640 px una demo por fila con alto 220 px. El `h1` es el nombre (SEO: el `<title>` sigue igual).

- [ ] **Step 1:** Crear las tres demos y `DemoTile`; reescribir `HeroSection`; borrar `TitleReveal`/`words`.
- [ ] **Step 2:** `pnpm test` → PASS (sin `words.test.ts`).
- [ ] **Step 3: Verificación en navegador:** a 1280 px las 4 demos se mueven; clic en Pases abre su panel; a 360 px sin scroll horizontal; con `--force-prefers-reduced-motion` (captura headless) las 4 muestran estado final; al bajar fuera de la portada los timers se detienen (contar `setTimeout` activos o loguear temporalmente).
- [ ] **Step 4:** Commit `feat: portada panel en vivo con 4 demos`.

---

### Task 6: Proyectos como casos y panel con demo

**Files:** Create `app/components/ProjectCase.vue` · Modify `ProjectsSection.vue`, `ProjectPanel.vue` · Delete `ProjectCard.vue`

- `ProjectCase` props `{ project: Project; index: number }`: grid 2 columnas ≥ 900 px (captura 1.1fr / ficha 1fr; en índices impares se invierte); ficha con nombre, estado (`● en producción` en verde / piloto / MVP), `tagline`, y una lista `dl` monoespaciada de 3 filas: `stack` (primeros 3 de `project.stack` unidos con " · "), `difícil` (primer ítem de `project.hard`, recortado a la primera oración), `resultado` (primer ítem de `project.result`); etiquetas de esas filas en `projects.caseLabels` (Task 2). Botón "Ver más" → `usePanel().open`.
- Otros proyectos: dos casos chicos en fila (mismo estilo de panel, sin captura).
- `ProjectPanel`: arriba de la captura, si `project.id` es `reservas`/`pases`/`plugo`/`techos`, renderiza la demo correspondiente (componentes de Task 5) en un marco de 320 px de alto.

- [ ] **Step 1:** Implementar. **Step 2:** `pnpm test` → PASS. **Step 3:** Verificación: los 5 casos alternan; 360 px sin desborde; `/#reservas` muestra el chat arriba en el panel.
- [ ] **Step 4:** Commit `feat: proyectos como casos de sala de control`.

---

### Task 7: Experiencia, recomendación, datos, sobre mí y contacto

**Files:** Modify `ExperienceSection.vue`, `TestimonialSection.vue`, `DataSection.vue`, `AboutSection.vue`, `ContactSection.vue`, `app/assets/css/main.css`

- **Experiencia (`git log`):** caja oscura monoespaciada; por ítem: `* {period}` en ámbar `#fbbf24`, `{role} · {org}` en `--fg`, y los `points` como líneas `│  …` en `--muted`. Título visible `git log --author=gabriel` como `h2` decorativo con `aria-label` = `experience.title`.
- **Recomendación:** bloque con borde izquierdo de acento y formato de comentario: primera línea `/**` en `--muted`, la cita en Inter (no mono) con prefijo ` * ` visual, firma `— Alan Graef, …` y la nota; cierra `*/`. Mismos textos.
- **Datos:** cada proyecto como medidor: nombre, `metric` en monoespaciada con color acento, barra de `score*100%` con degradado acento→violeta, descripción y "Ver código". Herramientas y certificaciones debajo como hoy.
- **Sobre mí:** panel con borde; párrafos en Inter; "cómo trabajo" con `✓` verdes (ya existe), stack como etiquetas monoespaciadas.
- **Contacto (terminal):** caja negra con barra de título `● ● ●`, líneas: `gabriel@funes ~ $ contacto` (prompt en verde), luego mail (`mailto:`), LinkedIn, GitHub y "Descargar CV" como links reales con `→`, y una última línea de prompt con cursor parpadeante (sin animación con reduced-motion). El título `¿Hablamos?` y el subtítulo quedan arriba de la terminal.

- [ ] **Step 1:** Implementar. **Step 2:** `pnpm test` → PASS. **Step 3:** Verificación visual a 1280 y 360 px; links de contacto funcionan; lector de pantalla: los decorativos (`│`, `*`, prompts) con `aria-hidden`.
- [ ] **Step 4:** Commit `feat: secciones con estilo sala de control`.

---

### Task 8: Verificación final y entrega

- [ ] **Step 1:** `pnpm test` y `pnpm generate` sin errores; servir `.output/public` bajo `/Portfolio/` (copia en scratchpad + `python -m http.server`).
- [ ] **Step 2:** Lighthouse móvil local: rendimiento ≥ 90, accesibilidad/buenas prácticas/SEO ≥ 95. Si rendimiento < 90, revisar primero el costo de las demos (pausar las que no están en pantalla ya está) y la densidad del canvas.
- [ ] **Step 3:** 360 px: `scrollWidth <= innerWidth`; reduced-motion: captura headless a 150 ms muestra todo completo y quieto; ES↔EN con panel abierto; `/#pases` directo + atrás.
- [ ] **Step 4:** Revisión final de la rama con un revisor nuevo.
- [ ] **Step 5:** Mostrarle a Gabriel la página local y **pedir OK** antes de mergear a `main` (que publica). Tras el OK: merge, push, verificar que el workflow quede verde y medir Lighthouse en el sitio publicado.
