# Rediseño "Sala de control" — Diseño

Fecha: 2026-10-22 · Repo: `C:\Users\gabby\Documents\Teros\Portfolio` · Sitio: https://gabrielsosa32.github.io/Portfolio/
Diseño anterior (sigue vigente en todo lo que este documento no cambia): `docs/superpowers/specs/2026-10-20-portfolio-design.md`.

## Por qué

Gabriel siente que la página "se ve muy común, similar a las otras páginas". En particular, no le gusta la portada actual (titular enorme con una parte en degradado y un párrafo debajo): "todas las páginas tienen ese mismo formato". También notó que la red de puntos animada solo está en la portada y que al bajar el fondo queda negro liso.

Lo que quiere (en sus palabras): que quien entra **"vea mis proyectos funcionando apenas entran"**.

El concepto que eligió es una **sala de control**: el portfolio se siente como el panel de monitoreo de sus propios productos andando. Eligió la portada "A · Panel en vivo" y el estilo "1 · Sala de control" para el resto (bocetos en `.superpowers/brainstorm/1756-1792703669/content/portada.html` y `resto.html`).

## Objetivos

1. La primera pantalla son **los productos funcionando**, no una frase sobre Gabriel.
2. Toda la página comparte un mismo lenguaje visual de "panel/consola", reconocible y distinto de las plantillas habituales.
3. El fondo animado acompaña **toda** la página, no solo la portada.
4. Se mantiene todo lo que ya funciona: textos y cifras verificados, ES | EN, tema oscuro, foto, contador de visitas, links directos `/#proyecto`, rendimiento y accesibilidad.

## No-objetivos

- Cambiar textos, cifras o decisiones de contenido. El contenido de `app/content/es.ts` y `en.ts` se reutiliza; solo se agregan textos cortos nuevos que pida el diseño (por ejemplo etiquetas de la portada).
- Cambiar el CV en PDF, la imagen para compartir (`og.png`) o el despliegue.
- Demos interactivas "jugables": las demos se miran, no se manejan.

## Anti-objetivos

- **Que se vuelva lenta o pesada**, sobre todo en el celular. Cuatro demos animadas más el fondo no pueden trabar el scroll en un teléfono de gama media.
- **Que las demos parezcan datos reales.** Son con datos inventados y tiene que estar dicho (como hoy en el chat del bot).
- **Que se pierda legibilidad** por el estilo "código": la letra monoespaciada es para etiquetas y fichas cortas, no para párrafos.
- **Que la estética tape el contenido**: un reclutador sin perfil técnico tiene que entender igual quién es Gabriel, qué hizo y cómo contactarlo en segundos.
- Romper lo ya cuidado: nada de "co-fundador/CTO", "único desarrollador", "hardware", datos de contacto de terceros, links a repos privados (los tests de contenido lo controlan).

## Lo que decidió Gabriel

- **Portada A · Panel en vivo:**
  - Columna izquierda chica con: foto, nombre, rol ("Desarrollador Full-Stack"), ubicación, disponibilidad, una línea corta tipo "Estos productos los diseñé y programé yo", botones Descargar CV / Contacto / GitHub / LinkedIn y el selector ES | EN (o el ES | EN queda en la barra superior, ver "a criterio").
  - A la derecha, grilla 2×2 con **4 demos animadas**: Teros Reservas (chat de WhatsApp reservando un turno), Pases (puerta escaneando un QR que da "ADENTRO" y suma ingresos), Plugo (cargador descontando minutos con anillo de progreso y "Cobraste $…"), Techos (presupuesto que se arma ítem por ítem hasta el total). Cada cuadro con nombre del producto y estado (en producción / piloto / MVP en staging).
  - Se elimina el titular grande "Armo productos completos, de la idea a producción" de la portada.
- **Fondo:** la animación acompaña toda la página al bajar, no solo la portada.
- **Resto de la página, estilo "1 · Sala de control":**
  - Fondo de grilla tenue en todo el sitio.
  - Etiquetas de sección en letra de código (estilo `// proyectos`).
  - **Proyectos:** cada uno como un "caso" grande: captura (o demo) alternando de lado y ficha técnica en monoespaciada (stack, tests, lo difícil, estado). "Ver más" sigue abriendo el panel con la historia completa. Avatar Companion y el buscador de clientes como casos chicos.
  - **Experiencia:** como un `git log` con los tres trabajos.
  - **Recomendación de Alan:** bloque tipo mensaje/comentario de código, misma cita y aclaraciones que hoy.
  - **Datos:** los 5 modelos como medidores (cifra + barra); herramientas y certificaciones debajo.
  - **Sobre mí:** texto + "cómo trabajo" como checklist con tildes.
  - **Contacto:** una terminal con mail, LinkedIn, GitHub y CV, cursor parpadeando.

## Decisiones de Claude (Gabriel puede cambiarlas)

- **Clic en un cuadro de la portada abre el "Ver más"** de ese producto (mismo panel y mismo link `/#id` que hoy).
- **Celular:** la columna de presentación va arriba y las demos debajo, en una columna (una demo por fila, con altura acotada) o 2×2 chicas si entran legibles; el builder decide midiendo a 360 px. Nada de scroll horizontal.
- **Las demos solo se animan cuando están en pantalla** (como el chat actual) y con "reducir movimiento" muestran su estado final quieto.
- **Fondo:** una sola capa fija detrás de todo el sitio: grilla tenue (CSS) + la red de puntos existente (`NetworkBackground`), más tenue que hoy fuera de la portada. El canvas se pausa con la pestaña oculta y con "reducir movimiento" queda quieto. Densidad según ancho, como hoy.
- **Las demos reutilizan lo que existe:** el chat del bot (`BotChatDemo` + `utils/chat.ts` + `projects.botDemo`) se reutiliza tal cual; las otras tres demos se construyen nuevas con la misma idea (datos inventados en los archivos de contenido ES/EN, aviso de "datos de ejemplo").
- **Qué ve la demo de Pases:** un QR dibujado de forma convincente (no un tablero de ajedrez) y el veredicto verde "ADENTRO", que es lo que muestra la app real. **Plugo:** anillo de carga y montos inventados. **Techos:** los mismos ítems del presupuesto de demostración que ya se usaron para su captura.
- **Dónde va cada demo:** las 4 demos animadas viven en la portada. En la sección Proyectos, cada caso usa su **captura** (también Reservas: el chat sale de la tarjeta). En el panel "Ver más", el producto que tiene demo la muestra arriba de la captura; como hay un solo panel abierto a la vez, nunca hay más de 4 animaciones simultáneas (más el fondo).
- **Sin "todo esto está andando ahora":** el cartel del boceto se saca porque las demos usan datos de ejemplo y Techos no está en producción. En su lugar, una sola aclaración para toda la grilla: "Demos con datos de ejemplo de productos reales" (ES/EN). El estado real de cada producto va en cada cuadro.
- **Se publica todo junto:** el trabajo va en una rama aparte; recién al terminar y con el OK de Gabriel se integra a `main` (que publica). Lighthouse se mide primero sobre el build local servido bajo `/Portfolio/` y se confirma en el sitio publicado.
- **Resortes NV** no tiene demo (es un sitio, no una app); aparece como un caso más en Proyectos con su captura.
- **Tipografía de código:** JetBrains Mono (Google Fonts vía `@nuxt/fonts`), solo para etiquetas, fichas, `git log`, terminal y cifras.
- **Paleta:** la oscura actual (tonos piedra, acento azul→violeta, verde para "en vivo"), más el amarillo/ámbar para los hashes del `git log`.
- **El `og.png` y el CV no se tocan** en este rediseño.

## Lo que queda a criterio de quien construya

- Composición exacta, tamaños, tiempos de animación y curvas, siempre fiel a los bocetos aprobados.
- Si el ES | EN vive en la barra superior (que aparece al bajar) o en la columna de la portada.
- Cómo se ven las fichas técnicas de cada caso (qué 3–4 líneas mostrar), tomando datos que ya están en el contenido.
- Si la barra de navegación se mantiene fija desde el principio o aparece al pasar la portada.

## Criterios de "terminado"

- Lighthouse móvil en el sitio publicado: rendimiento ≥ 90, accesibilidad, buenas prácticas y SEO ≥ 95.
- A 360 px: sin scroll horizontal; demos legibles; botones ≥ 44 px.
- Con "reducir movimiento": nada se mueve y todo se ve completo.
- Todos los tests de contenido siguen pasando; los textos nuevos están en ES y EN con la misma estructura.
- Links directos `/#pases`, `/#reservas`, etc. siguen abriendo su panel, y "atrás" lo cierra.
