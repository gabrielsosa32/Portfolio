# Portfolio personal de Gabriel Sosa — Diseño

Fecha: 2026-10-20 · Carpeta: `C:\Users\gabby\Documents\Teros\Portfolio`

## Para qué es y por qué

Gabriel necesita conseguir trabajo, y lo necesita pronto. Va a mandar CVs a todos lados y el link a esta página va en cada uno. La van a abrir dos tipos de personas:

- **Reclutadores / RRHH**: la miran 30 segundos, muchas veces desde el celular y sin perfil técnico.
- **Líderes técnicos o dueños de empresas**: entran a ver detalles, el código y cómo piensa.

**El mensaje central** (palabras de Gabriel): *puede armar productos completos de punta a punta y aprende lo que haga falta.* La prueba son sus productos de Teros, que están en producción, tienen usuarios y pagos reales, y **los hizo todos solo**.

**El perfil buscado es desarrollador** (Full-Stack). Lo de datos y ML aparece como un plus, no como protagonista.

**Urgencia:** es preferible tener algo bueno publicado rápido antes que algo perfecto tarde. El orden de prioridades es primero salir, después pulir.

## Objetivos

1. En los primeros segundos, cualquiera entiende quién es, qué hace, que está disponible (remoto o presencial, le da igual) y cómo contactarlo o bajar su CV.
2. Los proyectos de Teros se cuentan como historias (problema → qué construyó → lo difícil → resultado), no como una lista de tecnologías.
3. La página en sí demuestra nivel de front-end: tiene animaciones cuidadas, es responsive y anda rápido.
4. Está en español, con un botón ES | EN arriba que cambia todo el contenido a inglés.

## No-objetivos

- Blog, CMS o panel para editar contenido.
- Formulario de contacto con backend (alcanza con mail, LinkedIn y GitHub).
- Las demos interactivas de cada producto (por ejemplo, un chat de WhatsApp simulado). Gabriel no estaba seguro, así que quedan para una versión futura.
- Arreglar los READMEs de los repos de datos (ver "Pendientes aparte").

## Anti-objetivos (cosas que la harían fracasar aunque funcione)

- **Inventar o inflar algo.** Cada cifra (R², % de acierto, cantidad de tests o commits, "en producción") tiene que salir del código, de los notebooks o del sitio en vivo. Si no se puede verificar, no se pone. Un reclutador técnico que encuentra una afirmación falsa descarta al candidato.
- **Que sea lenta o pesada en el celular.** Si las animaciones traban el scroll en un teléfono de gama media, se sacan o se simplifican.
- **Mostrar datos reales de clientes.** Las capturas de Pases, Reservas y Plugo no pueden mostrar nombres, mails ni datos de clientes o usuarios reales. Se usan páginas públicas, landings o datos de demo.
- **Mostrar secretos o detalles internos** (claves, URLs de APIs internas, cosas de `.env`).
- **Linkear algo roto o que no coincide:** una app "desplegada" que no existe, un README que describe otro proyecto, etc.

## Decisiones tomadas por Gabriel

- **Estilo visual:** opción "B · Claro y limpio". Fondo claro tipo piedra (`#fafaf9`), texto oscuro (`#1c1917`), acento azul (`#2563eb`), tipografía Inter, botones redondeados tipo píldora, tarjetas blancas con borde suave. Lleva foto circular.
- **Estructura** (en este orden):
  1. **Presentación:** foto, "Desarrollador Full-Stack · Funes, Santa Fe, Argentina" (sale del CV existente), titular "Armo productos completos, de la idea a producción.", un subtítulo, "● Disponible · remoto o presencial" y botones Descargar CV / Contacto / GitHub / LinkedIn.
  2. **Proyectos principales:** Pases, Teros Reservas, Plugo y Resortes NV, en tarjetas con captura, una línea sobre el problema, stack y la etiqueta "en vivo" cuando corresponda. Debajo, más chicos: Techos, Teros Pedidos, Avatar Companion y Scraper de leads.
  3. **También trabajo con datos:** Precio de vuelos (R² 0,97), Noticias falsas (LSTM, 92%), las 3 apps de Streamlit (Casas, Corazón/Boosting, Churn), herramientas (Python, pandas, scikit-learn, SQL, Tableau, Power BI) y los certificados (contados sin duplicados: en la carpeta hay 7 imágenes pero SQL aparece 3 veces; se listan por nombre y emisor, sin cifra inflada — decisión de Claude).
  4. **Sobre mí y cómo trabajo:** un párrafo corto, más cómo trabaja (tests, CI, documentación, pagos reales en producción) y su stack.
  5. **Contacto.**
- **"Ver más" por proyecto:** cada proyecto principal abre un panel (sin salir de la página) con: **el problema**, **qué construí** (partes y roles de usuario), **lo difícil** (el desafío técnico interesante), **resultado** (estado en producción, tests, etc.), **capturas** y **link al sitio en vivo**. Los textos los redacta Claude leyendo el código y la documentación de cada repo, y Gabriel los corrige.
- **Animaciones elegidas:**
  - **Titular que entra palabra por palabra**, con degradado azul→violeta en la parte final.
  - **Fondo de red de puntos animada** detrás de la presentación, que reacciona al mouse.
- **Idiomas:** español por defecto, inglés con el botón ES | EN.
- **Cómo se describe su rol en Teros** (confirmado por Gabriel): es el **único desarrollador**. Diseñó y programó todo, desde la base de datos hasta el despliegue. Su socio Alan financia, define el producto (escribió las especificaciones de los últimos proyectos) y está rediseñando parte del front-end de algunos productos porque es quien más sabe de eso. La frase base es: *"Único desarrollador: diseñé y programé todo, de la base de datos al despliegue. Las ideas de producto las definimos con mi socio."* Por lo tanto:
  - No usar "lo hice solo" a secas.
  - No atribuirle a Gabriel el diseño visual de las pantallas de los productos: en las capturas puede verse el rediseño de Alan. Lo que se destaca en cada proyecto es la ingeniería: arquitectura, pagos, IA, hardware, tests y despliegue.
  - El título en Teros es **"Desarrollador Full-Stack en Teros (único desarrollador)"**, no "Co-fundador & CTO". Decidido por Gabriel para no abrir preguntas sobre la empresa ni dar a entender que se va a ir. El CV PDF que se genere tiene que usar el mismo título; LinkedIn lo actualiza Gabriel.

## Decisiones de Claude (Gabriel puede cambiarlas)

- **Tecnología: Nuxt 4 + Vue 3 + TypeScript, generado como sitio estático** (`nuxt generate`), con `@nuxtjs/i18n` para ES/EN. Por qué: es el stack que Gabriel ya domina (Reservas, Pedidos, Techos, Resortes), así que lo puede mantener solo, y un portfolio hecho con framework muestra más a un reclutador técnico que un HTML suelto. Sin librerías pesadas: la red de puntos es un `<canvas>` 2D propio, no three.js.
- **Hosting: GitHub Pages** en `gabrielsosa32.github.io`, con deploy automático vía GitHub Actions. Si más adelante quiere dominio propio, se agrega.
- **Repo propio:** el portfolio va en su propio repo git dentro de `Documents\Teros\Portfolio` (hoy esa carpeta cae dentro de un repo en la home del usuario, que no hay que usar), con remote en la cuenta personal `gabrielsosa32`.
- **Contenido en archivos de datos** (uno por idioma o con claves i18n), separado de los componentes, para que Gabriel pueda corregir textos sin tocar código.
- **El panel "Ver más"** tiene URL propia (`#pases`, `#reservas`, etc.), así Gabriel puede mandar el link directo a un proyecto.
- **"Reducir movimiento":** si el sistema lo tiene activado, no hay animaciones; la red se muestra quieta o no se muestra.
- **Capturas:** las saca Claude de los sitios públicos (pases.teros.com.ar, reservas.teros.com.ar, resortesnv.com.ar y la de Plugo si hay una pública), respetando el anti-objetivo de datos de clientes.
- **Repos de Teros:** se asumen **privados**. Para esos proyectos se muestra el sitio en vivo y capturas, no un link al código. Los repos de datos (públicos en `gabrielsosa32`) sí se linkean.
- **CV descargable:** PDF generado a partir del CV Full-Stack que ya existe (`Documents\Portfolio\cv.html`), en español y en inglés si hay tiempo.
- **Foto:** hasta que Gabriel la pase, va un círculo con las iniciales "GS".
- **Links de contacto:** GitHub `github.com/gabrielsosa32`, LinkedIn `linkedin.com/in/gabrielsosa32` y el mail del CV: gabbysosa32@gmail.com.
- **Metadatos para compartir:** título, descripción e imagen de vista previa (Open Graph), para que el link se vea bien en LinkedIn y WhatsApp.

## Material de referencia

- Proyectos de Teros: `C:\Users\gabby\Documents\Teros\` → `entradas-app` (Pases), `tero-reservas`, `toma-app` (Plugo), `ResortesV2`, `Techos`, `Teros-Pedidos`, `Avatar`, `Scrapping`.
- Datos: `C:\Users\gabby\Documents\Data Science\` (vuelos en `Proyectos\Vuelos`, fake news en `Machine learning\Redes neuronales\TPFinal`, apps en `Proyectos\Casas`, `Proyectos\Boosting`, `Machine learning\Redes neuronales\TP1`). Certificados en `Certificados Data Cience\`.
- Borrador anterior, CVs y plantillas de mail: `C:\Users\gabby\Documents\Portfolio\` (`index.html`, `cv.html`, `cv-ats.html`, `plantillas-mail.md`). Sirven para reutilizar textos; el borrador está orientado a datos y no se usa como base.
- Bocetos aprobados: `.superpowers/brainstorm/` dentro de esta carpeta (`estilo.html` → opción B, `pagina-completa.html`, `animaciones.html` → 1 y 3).

## Lo que queda a criterio de quien construya

- La implementación de las animaciones, los tiempos y las curvas, siempre que se parezcan a los bocetos aprobados.
- El diseño exacto del panel "Ver más" (modal o panel lateral) y del menú en el celular.
- La redacción final de los textos (en borrador, para que Gabriel corrija).
- Animaciones menores de aparición al hacer scroll, si son sutiles.

## Pendientes aparte (no bloquean la publicación)

- Corregir los READMEs de los repos de datos: el de `Flight-price-prediction` no tiene README, el de `series-prediction` describe otro proyecto, y los de `Boostingmodels` y `churn-prediction` tienen links de ejemplo `tuusuario/...`. Mientras no se arreglen, conviene no linkear `series-prediction` ni `Clasificador-imagenes` (su README menciona una app que no existe).
- Si Gabriel quiere: desplegar alguna de las apps de Streamlit en Streamlit Cloud para tener un link "pruébalo".
