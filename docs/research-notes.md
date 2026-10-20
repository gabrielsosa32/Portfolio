# Notas de investigación para el portfolio

Relevado el 2026-10-20, solo lectura. Todas las cifras salen de un comando o
archivo listado en **Fuentes de cifras** al final, redondeadas hacia abajo.
No se leyeron `.env` ni se copiaron claves, tokens ni URLs internas.

Advertencias generales antes de usar el texto:

- **Autoría.** En los repos aparecen como autores `gabriel`, `gabrielsosa32`,
  `gabby` y `Teros` (todos Gabriel), `Claude` (commits hechos desde sesiones de
  Claude Code de Gabriel) y **Alan Graef** (el socio): 37 commits en Pases,
  23 en Reservas, 71 en Techos. Por eso el texto dice "construí" y "único
  desarrollador", pero las cifras de commits son del repo entero, no solo de
  Gabriel. Si se quiere la cifra "solo míos", ver `git shortlog -sne HEAD`.
- **Plugo y hardware.** El firmware del ESP32 lo escribió Gabriel (el historial
  de `firmware/` es todo suyo), pero la placa y la instalación eléctrica las
  hace un tercero. No decir "diseñé el hardware": decir "escribí el firmware".
- **Repos privados.** Los cuatro productos principales viven en la org
  `Teros12` en GitHub y son privados: no linkear el código, solo el producto.
- **Cantidad de tests.** Se da cantidad de *archivos* de test, que es exacta.
  No se corrieron las suites: en Pases y Plugo los tests de integración
  escriben en la base de producción.

---

## 1. Pases (entradas-app)

- URL: https://pases.teros.com.ar — responde `HTTP/1.1 200 OK`, `Server: Vercel`,
  título "Pases — Entradas, puerta y barra para boliches".
- Repo: `Documents/Teros/entradas-app` (privado, `Teros12/Entradas`).

### ES

**Tagline:** Entradas con QR, control de puerta sin señal y barra con pedidos para boliches.

**Problema.** Los boliches venden entradas por canales sueltos (listas de RRPP,
transferencias, efectivo en puerta) y en la puerta no tienen cómo saber si un
QR es válido, ya se usó o es de otra noche, menos aún cuando el celular del
guardia se queda sin señal en el subsuelo. La plata se concilia a mano y la
plataforma que intermedia necesita cobrar su comisión sin tocar el dinero
del boliche.

**Qué construí**
- Venta pública por evento (`/[boliche]/[evento]`) con tandas de precio, cupos por sector, códigos de RRPP y pase digital con QR que llega por mail.
- App del guardia (PWA) que escanea QR y da veredicto verde / amarillo / rojo en la puerta, con venta en puerta incluida, funcionando offline.
- Barra: carta pública, pedidos y cobro, y pantalla de barra que canjea lo pedido.
- Panel del dueño: boliches, eventos, tandas, guardias, RRPP, movimientos en vivo y exportes CSV; panel de RRPP con su link de venta.
- Panel de administración de la plataforma (alta de organizaciones, comisiones, incidentes).

**Lo difícil**
- **QR firmado con Ed25519 por evento**: el payload (130 caracteres, QR versión 8) lleva `event_id` + `ticket_id` + firma, así que la puerta puede validar sin red; verificar una firma mide 0,113 ms, muy por debajo del presupuesto de 300 ms por escaneo.
- **Puerta offline con reconciliación**: manifiesto del evento en IndexedDB con actualización por deltas, cola de escaneos que se sincroniza al volver la señal, corrección del reloj del dispositivo contra el del servidor y resolución de duplicados entre dos guardias ("gana el escaneo más antiguo", el otro recibe el conflicto).
- **Mercado Pago Marketplace**: cada boliche vincula su cuenta por OAuth, los tokens se guardan cifrados con AES-256-GCM, la comisión de la plataforma va como `marketplace_fee` congelada en la orden, y el webhook valida la firma, re-consulta el pago en MP y es idempotente por índice único.
- **Multi-tenant en Postgres con RLS**: más de 100 migraciones de Supabase, `org_id` desnormalizado por trigger y cupos controlados en la base.

**Resultado**
- En producción en pases.teros.com.ar; compra real por Checkout Pro verificada contra lo que Mercado Pago informó como comisión cobrada. Primer boliche en puesta en marcha (octubre 2026).
- 90 archivos de test (Vitest).
- CI en GitHub Actions (typecheck, lint, tests y build en cada push y PR) más un workflow aparte para los tests de integración contra Supabase.
- Más de 250 commits desde septiembre de 2026.

**Stack:** Next.js 15 · React 19 · TypeScript · Supabase (Postgres + RLS) · Mercado Pago Marketplace · PWA / IndexedDB · Resend · Vercel

### EN

**Tagline:** QR tickets, offline door control and bar ordering for nightclubs.

**Problem.** Nightclubs sell tickets through scattered channels (promoter lists,
bank transfers, cash at the door), and the door staff has no reliable way to
tell whether a QR is valid, already used or from another night — especially
when the phone loses signal in a basement. Reconciliation is manual, and the
platform needs to take its fee without ever holding the club's money.

**What I built**
- Public event pages with price tiers, per-sector capacity, promoter codes and a digital pass with QR delivered by email.
- A door-staff PWA that scans QRs and returns a green / yellow / red verdict, including door sales, working fully offline.
- Bar module: public menu, orders and payment, plus a bar screen to redeem them.
- Owner dashboard (venues, events, tiers, staff, promoters, live activity, CSV exports) and a promoter dashboard with their own sales link.
- Platform admin panel (onboarding organizations, fees, incidents).

**Hard parts**
- **Per-event Ed25519-signed QR codes**: a 130-character payload (QR version 8) carrying event id, ticket id and signature, so the door can verify without a network; a signature check takes 0.113 ms against a 300 ms per-scan budget.
- **Offline door with reconciliation**: event manifest in IndexedDB with delta updates, a scan queue that syncs when the signal returns, device-clock correction against server time, and duplicate resolution across devices (earliest scan wins, the other device is told).
- **Mercado Pago Marketplace**: each venue links its account via OAuth, tokens are stored AES-256-GCM encrypted, the platform fee is sent as `marketplace_fee` and frozen on the order, and the webhook verifies the signature, re-fetches the payment from MP and is idempotent through a unique index.
- **Multi-tenant Postgres with RLS**: over 100 Supabase migrations, trigger-maintained `org_id` and capacity enforced in the database.

**Results**
- Live at pases.teros.com.ar; a real Checkout Pro purchase was verified end to end against the fee Mercado Pago reported. First club onboarding as of October 2026.
- 90 test files (Vitest).
- GitHub Actions CI (typecheck, lint, tests, build on every push and PR) plus a separate integration workflow against Supabase.
- 250+ commits since September 2026.

**Stack:** Next.js 15 · React 19 · TypeScript · Supabase (Postgres + RLS) · Mercado Pago Marketplace · PWA / IndexedDB · Resend · Vercel

---

## 2. Teros Reservas (tero-reservas)

- URL: https://reservas.teros.com.ar — responde `200 OK`, `Server: Vercel`,
  título "Teros | Pedidos y reservas por WhatsApp con IA 24/7".
- Repo: `Documents/Teros/tero-reservas` (`api/` Express + `dashboard/` Nuxt). En
  producción con usuarios reales (no pushear sin pedido).

### ES

**Tagline:** Un asistente con IA que toma reservas y pedidos por WhatsApp, las 24 horas.

**Problema.** Canchas, peluquerías, consultorios y locales gastronómicos
reciben reservas y pedidos por WhatsApp y alguien tiene que contestar a mano,
a cualquier hora, chequear disponibilidad, pedir la seña y perseguir el
comprobante de transferencia. Cuando el negocio no contesta, el cliente se va.

**Qué construí**
- Bot conversacional por WhatsApp (e Instagram) que consulta disponibilidad, propone, confirma y cancela reservas, y arma pedidos con carrito, combos, retiro o delivery.
- Panel del negocio (PWA con notificaciones push): calendario de reservas, recursos y horarios, menú, pedidos, contactos y analíticas.
- Cobros: señas y links de pago con Mercado Pago, y transferencias validadas leyendo el comprobante.
- SaaS multi-tenant con planes, módulos (Reservas / Pedidos), prueba gratuita y onboarding guiado para conectar el WhatsApp del negocio.
- Landing por rubro (gastronomía, canchas, peluquerías, estética, consultorios, tatuajes, fotógrafos).

**Lo difícil**
- **Agente con tool use (Claude API) que reserva sin doble reserva**: 28 herramientas (disponibilidad, `propose_booking` → confirmación → `create_booking`, carrito, pedidos, escalar a un humano). La propuesta se guarda como estado pendiente y se valida contra el día pedido; la garantía final la da Postgres con índices únicos parciales por recurso/fecha/hora (modo exclusivo) y por contacto (modo grupal).
- **Lectura de comprobantes con visión**: el bot recibe la foto de la transferencia, extrae monto, fecha, destino y pagador, y la empareja con el pedido o la seña pendiente.
- **Procesamiento asíncrono**: los webhooks de Meta solo encolan; un worker de BullMQ + Redis procesa los mensajes, con atajos deterministas ("fast paths") para confirmar o cancelar sin pasar por el modelo.
- **Multi-tenancy con RLS** en Supabase: cada tabla con `tenant_id`, 50 migraciones SQL; pagos por tenant con Mercado Pago y suscripciones por plan.

**Resultado**
- En producción con negocios usando el bot; dashboard en reservas.teros.com.ar.
- 36 archivos de test (Jest en la API, Vitest en el dashboard), más simulaciones de conversación (`npm run sim`).
- CI en GitHub Actions que corre los tests en cada push.
- Más de 700 commits desde marzo de 2026.

**Stack:** Node.js + Express · Claude API (tool use + visión) · WhatsApp Cloud API / Meta · BullMQ + Redis · Supabase (Postgres + RLS) · Nuxt 4 / Vue 3 (PWA) · Mercado Pago · Railway + Vercel

### EN

**Tagline:** An AI assistant that takes bookings and orders over WhatsApp, 24/7.

**Problem.** Sports courts, salons, clinics and restaurants get bookings and
orders over WhatsApp, and someone has to answer by hand at any hour, check
availability, ask for a deposit and chase the bank-transfer receipt. When the
business doesn't reply, the customer goes elsewhere.

**What I built**
- A WhatsApp (and Instagram) conversational bot that checks availability, proposes, confirms and cancels bookings, and takes food orders with a cart, combos, pickup or delivery.
- A business dashboard (PWA with push notifications): booking calendar, resources and schedules, menu, orders, contacts and analytics.
- Payments: deposits and payment links via Mercado Pago, plus bank transfers validated by reading the receipt.
- Multi-tenant SaaS with plans, modules (Bookings / Orders), free trial and guided onboarding to connect the business's WhatsApp number.
- Vertical landing pages (restaurants, courts, salons, aesthetics, clinics, tattoo studios, photographers).

**Hard parts**
- **Tool-using agent (Claude API) that books without double-booking**: 28 tools (availability, `propose_booking` → confirmation → `create_booking`, cart, orders, hand-off to a human). The proposal is stored as pending state and checked against the requested weekday; the final guarantee is Postgres partial unique indexes per resource/date/time (exclusive mode) and per contact (group mode).
- **Receipt reading with vision**: the bot takes a photo of a transfer, extracts amount, date, destination and payer, and matches it to the pending order or deposit.
- **Async processing**: Meta webhooks only enqueue; a BullMQ + Redis worker handles messages, with deterministic fast paths to confirm or cancel without a model call.
- **Multi-tenancy with RLS** on Supabase: `tenant_id` on every table, 50 SQL migrations; per-tenant Mercado Pago payments and plan subscriptions.

**Results**
- In production with businesses using the bot; dashboard at reservas.teros.com.ar.
- 36 test files (Jest for the API, Vitest for the dashboard), plus conversation simulations (`npm run sim`).
- GitHub Actions CI running the tests on every push.
- 700+ commits since March 2026.

**Stack:** Node.js + Express · Claude API (tool use + vision) · WhatsApp Cloud API / Meta · BullMQ + Redis · Supabase (Postgres + RLS) · Nuxt 4 / Vue 3 (PWA) · Mercado Pago · Railway + Vercel

---

## 3. Plugo (toma-app)

- URL: https://plugo.com.ar — responde `200 OK`, `Server: Vercel`, título
  "Plugo — Cobrá por cargar autos eléctricos en tu cochera". **Responde con el
  producto**, así que va con URL.
- Estado real: el panel del dueño y la Entrega A están en producción; hay un
  solo dueño y la prueba punta a punta con la caja (T1.11) sigue pendiente en
  el lugar de quien hace el hardware. Sugerencia de etiqueta: **"En producción
  — piloto"**.
- Repo: `Documents/Teros/toma-app` (privado, `Teros12/toma-app`), con `firmware/`.

### ES

**Tagline:** Convierte cualquier cargador de autos eléctricos en un punto de carga paga con un QR.

**Problema.** Hay cocheras, hoteles y estacionamientos con cargadores
(wallboxes) para autos eléctricos que no tienen forma de cobrar por la carga:
o la regalan o no la ofrecen. Cambiar el cargador por uno "inteligente" es caro,
y el dueño necesita cobrar sin estar presente.

**Qué construí**
- Página pública por cargador (`/c/[código]`): el conductor escanea el QR, elige un plan de minutos y paga con Mercado Pago; pantalla de sesión con el tiempo restante y opción de extender.
- Firmware para una caja ESP32 con relé que se instala entre la red y el wallbox existente y lo habilita por el tiempo pagado.
- Panel del dueño: cargadores, ventas, planes por toma, encendido manual (cobro en efectivo) y vinculación de su cuenta de Mercado Pago.
- Crons de expiración y reembolso automático cuando la caja no llega a habilitar la carga.

**Lo difícil**
- **Autenticación de cajas y cola de comandos**: la caja canjea un código de activación de un solo uso por un token de 32 bytes (en la base solo queda su SHA-256), con techo de intentos por IP; después hace poll cada 3 s, con un solo comando en vuelo por caja, reenvío con el mismo id y deduplicación del lado del firmware, y rate limit de 60 requests por minuto.
- **El tiempo lo cuenta la caja**: el backend solo arranca sesiones y el corte lo decide el timer local, así que una caída de internet no deja la corriente abierta. TLS con la raíz pinneada en el ESP32 y token persistido en NVS.
- **Pagos divididos con Mercado Pago**: Checkout Pro con split marketplace (el dueño cobra directo y la plataforma se lleva su porcentaje), tokens del dueño cifrados con AES-256-GCM, webhook con firma verificada y reembolsos automáticos.
- **Multi-tenant con RLS**: el panel lee con la sesión del dueño y es la base la que filtra, no el service role.

**Resultado**
- En producción en plugo.com.ar (landing, página por cargador y panel del dueño); piloto con el primer punto.
- Más de 100 archivos de test (Vitest + Testing Library).
- CI en GitHub Actions: typecheck, lint, tests y build en cada push a `main` y en cada PR.
- Más de 350 commits desde septiembre de 2026; 22 migraciones de base; revisión de seguridad escrita del firmware y los endpoints de dispositivos.

**Stack:** Next.js 15 · React 19 · TypeScript · Supabase (Postgres + RLS) · Mercado Pago (split marketplace) · ESP32 (C++ / Arduino) · Resend · Vercel

### EN

**Tagline:** Turns any EV charger into a paid charging point with a QR code.

**Problem.** Garages, hotels and parking lots have EV wallboxes but no way to
charge for the electricity: they either give it away or don't offer it.
Replacing the charger with a "smart" one is expensive, and the owner needs to
get paid without being there.

**What I built**
- A public page per charger: the driver scans a QR, picks a time plan and pays with Mercado Pago; a session screen shows remaining time and lets them extend.
- Firmware for an ESP32 relay box installed between the mains and the existing wallbox, enabling it for the paid time.
- Owner dashboard: chargers, sales, per-outlet plans, manual start (cash payments) and linking their own Mercado Pago account.
- Expiration and automatic refund jobs for when the box fails to start the charge.

**Hard parts**
- **Device auth and command queue**: the box redeems a one-time activation code for a 32-byte token (only its SHA-256 is stored), with per-IP attempt limits; it then polls every 3 s, with one in-flight command per box, retries using the same id, firmware-side deduplication and a 60 req/min rate limit.
- **The box keeps the time**: the backend only starts sessions and the local timer decides the cut-off, so an internet outage never leaves power on. Pinned root CA for TLS on the ESP32, token persisted in NVS.
- **Split payments with Mercado Pago**: Checkout Pro with marketplace split (the owner is paid directly, the platform keeps its fee), owner tokens AES-256-GCM encrypted, signature-verified webhook and automatic refunds.
- **Multi-tenant with RLS**: the dashboard reads with the owner's session and the database does the filtering, not the service role.

**Results**
- Live at plugo.com.ar (landing, per-charger page and owner dashboard); piloting with the first site.
- 100+ test files (Vitest + Testing Library).
- GitHub Actions CI: typecheck, lint, tests and build on every push to `main` and every PR.
- 350+ commits since September 2026; 22 database migrations; written security review of the firmware and device endpoints.

**Stack:** Next.js 15 · React 19 · TypeScript · Supabase (Postgres + RLS) · Mercado Pago (marketplace split) · ESP32 (C++ / Arduino) · Resend · Vercel

---

## 4. Resortes NV (ResortesV2)

- URL: https://resortesnv.com.ar — responde `200 OK`, `Server: Vercel`, título
  "Resortes NV — Resortes a gas para vehículos · Rosario, Argentina".
- Repo: `Documents/Teros/ResortesV2` (privado, `Teros12/Resortes2`). Sitio
  institucional para un cliente (fábrica de resortes a gas, Rosario, desde 1988).

### ES

**Tagline:** Sitio institucional y catálogo para un fabricante de resortes a gas.

**Problema.** Una fábrica con décadas en el mercado no tenía una web que
mostrara su catálogo ni que convirtiera visitas en consultas comerciales de
distribuidores y clientes.

**Qué construí**
- Sitio con inicio, catálogo de productos (15 productos con ficha por código), preguntas frecuentes y contacto.
- Formulario de contacto con variantes (pedido de catálogo, distribuidor) y suscripción, enviados por mail.
- API propia (Nitro) para productos y contacto, con datos en JSON reemplazables por base de datos.

**Lo difícil**
- Validación compartida cliente/servidor con los mismos schemas de zod y rate limit en los endpoints del formulario.
- SEO técnico: prerender de las rutas, sitemap y metadatos con `@nuxtjs/seo`, imágenes en AVIF/WebP con `@nuxt/image`.
- Build portable: el mismo código despliega en Vercel o en un servidor Node propio (preset de Nitro autodetectado, guía de systemd).

**Resultado**
- En producción en resortesnv.com.ar para un cliente real.
- 4 archivos de test (Vitest) sobre la API, los schemas y composables.
- 100 commits.

**Stack:** Nuxt 4 · Vue 3 · TypeScript · Tailwind CSS · zod + vee-validate · Resend · Vercel

### EN

**Tagline:** Corporate website and product catalog for a gas-spring manufacturer.

**Problem.** A manufacturer with decades in the market had no website showing
its catalog or turning visits into sales inquiries from distributors and
customers.

**What I built**
- Site with home, product catalog (15 products, each with its own page by code), FAQ and contact.
- Contact form with variants (catalog request, distributor) and newsletter signup, delivered by email.
- Its own API (Nitro) for products and contact, with JSON content that can be swapped for a database.

**Hard parts**
- Shared client/server validation with the same zod schemas, and rate limiting on form endpoints.
- Technical SEO: prerendered routes, sitemap and metadata via `@nuxtjs/seo`, AVIF/WebP images via `@nuxt/image`.
- Portable build: the same code deploys to Vercel or a self-hosted Node server (auto-detected Nitro preset, systemd guide).

**Results**
- Live at resortesnv.com.ar for a real client.
- 4 test files (Vitest) covering the API, schemas and composables.
- 100 commits.

**Stack:** Nuxt 4 · Vue 3 · TypeScript · Tailwind CSS · zod + vee-validate · Resend · Vercel

---

## Proyectos secundarios

| Proyecto | ES | EN | Stack |
|---|---|---|---|
| **Techos** (`Techos/`) | Marketplace que conecta a dueños de casas con techistas, con reputación documentada (fotos antes/después, calificación, monto) e historial de mantenimiento de cada propiedad. MVP con más de 100 archivos de test (unitarios + Playwright e2e) y CI. | Marketplace connecting homeowners with roofers, with documented reputation (before/after photos, ratings, quoted price) and a maintenance history per property. MVP with 100+ test files (unit + Playwright e2e) and CI. | Nuxt 4 · Prisma + PostgreSQL · Playwright · S3 |
| **Teros Pedidos** (`Teros-Pedidos/`) | Bot de pedidos de comida por WhatsApp, clonado de Reservas como prototipo y luego integrado como módulo Pedidos de Teros Reservas (migración `045_pedidos_schema.sql`). | WhatsApp food-ordering bot, prototyped as a fork of Reservas and later merged into Teros Reservas as its Orders module. | Express · Claude API · BullMQ + Redis · Nuxt / Supabase |
| **Avatar Companion** (`Avatar/`) | App de escritorio con un avatar Live2D animado que escucha por micrófono, responde con voz y conversa con personalidad usando un LLM, pensada como overlay para gamers. | Desktop app with an animated Live2D avatar that listens through the mic, answers by voice and chats in character via an LLM, designed as a gaming overlay. | Electron · PixiJS + Live2D · Claude API · Web Speech API |
| **Lead scraper** (`Scrapping/`) | Scrapers que generan listas de prospectos B2B (canchas, barberías, clínicas) desde Google Maps y OpenStreetMap, ordenados por un puntaje de rating × reseñas, para prospección comercial. | Scrapers that build B2B lead lists (courts, barbershops, clinics) from Google Maps and OpenStreetMap, ranked by a rating × reviews score, for sales outreach. | Python · Playwright · Overpass API (OSM) · YAML config |

Notas: `Avatar/` y `Scrapping/` no tienen repo propio, viven dentro del repo
de `C:\Users\gabby` (19 commits tocan `Documents/Teros/Avatar`; ninguno toca
`Scrapping`, está sin commitear). Techos tiene 71 commits de Alan, así que
**no** es un proyecto de único desarrollador; el diseño original estimaba un
equipo de 2-3 personas.

---

## Proyectos de datos

| Proyecto | ES | EN | Métrica verificada | Repo |
|---|---|---|---|---|
| **Predicción de precios de vuelos** | Modelo de regresión que estima el precio de pasajes aéreos a partir de aerolínea, ruta, escalas, duración y clase; comparé 6 modelos con GridSearchCV. | Regression model estimating airfare from airline, route, stops, duration and class; compared 6 models with GridSearchCV. | **Random Forest, R² 0,97 en test** (0,974492; MAE ≈ 2.230) sobre **más de 300.000 vuelos** (300.261 filas) | https://github.com/gabrielsosa32/Flight-price-prediction |
| **Detección de noticias falsas** | Clasificador de noticias falsas con una red LSTM sobre embeddings Word2Vec preentrenados (GoogleNews, 300 dimensiones). | Fake-news classifier using an LSTM over pretrained Word2Vec embeddings (GoogleNews, 300 dims). | **LSTM: accuracy 91% en test** (0,9173 sobre 2.093 noticias) | https://github.com/gabrielsosa32/tp-final-deep-learning |
| **Predicción de precios de viviendas** | Regresión del precio de viviendas con modelos lineales, árboles, Gradient Boosting y Stacking, con app en Streamlit. | House-price regression with linear models, trees, Gradient Boosting and Stacking, served through a Streamlit app. | **Stacking, R² 0,63 en test** (0,6395) sobre 545 viviendas | https://github.com/gabrielsosa32/house-price-prediction |
| **Enfermedad cardíaca con boosting** | Comparación de AdaBoost, Gradient Boosting y XGBoost, por defecto y con hiperparámetros ajustados, para predecir enfermedad cardíaca (datos UCI Cleveland, Hungría, Suiza). | AdaBoost vs Gradient Boosting vs XGBoost, default and tuned, to predict heart disease (UCI Cleveland, Hungary, Switzerland data). | **AdaBoost ajustado, AUC 0,89** (0,8907; accuracy 0,80) sobre 720 pacientes | https://github.com/gabrielsosa32/Boostingmodels |
| **Predicción de abandono (churn)** | Predicción de abandono de clientes de telecomunicaciones con árboles, SMOTE, bagging (incluido uno heterogéneo propio) y Random Forest, con app en Streamlit. | Telecom customer churn prediction with decision trees, SMOTE, bagging (including a custom heterogeneous one) and Random Forest, with a Streamlit app. | **Bagging + SMOTE, ROC AUC 0,86 en test** (0,8643 sobre 834 clientes) | https://github.com/gabrielsosa32/churn-prediction |

Advertencias:
- **Casas:** el R² es modesto (0,63). Si se muestra, presentarlo como dataset
  chico (545 filas) y comparación honesta de modelos. Ojo: el `best_model.pkl`
  que se guarda en la celda 18 es el mejor de la primera tanda (cell 16), no
  el Stacking; la app podría estar usando otro modelo que el de la métrica.
- **Vuelos:** el dataset es el público de vuelos de India (Kaggle,
  `business.xlsx` + `economy.xlsx`); los precios están en rupias.
- **Fake news:** el notebook tiene una segunda parte (popularidad de noticias,
  regresión); la métrica de arriba es solo la LSTM, como se pidió.

### Certificados (Academia Desafío Latam)

Archivos en `Data Science/Certificados Data Cience/`. Hay 7 PNG pero 5
certificados distintos: los tres de SQL son el mismo (mismo N° de certificado;
`Certificado sql.png` y la copia `(3)` son idénticos byte a byte, la `(2)` es
una reemisión con otra fecha).

| Módulo | Emisor | Horas | Fecha de emisión |
|---|---|---|---|
| SQL para el análisis de datos | Academia Desafío Latam | 70 | 19 jul 2024 (otra copia dice 8 oct 2024, ver nota) |
| Programación con Python para el análisis de datos | Academia Desafío Latam | 76 | 17 oct 2024 |
| Análisis estadístico con Python | Academia Desafío Latam | 76 | 18 dic 2024 |
| Visualización y comunicación de insights | Academia Desafío Latam | 46 | 29 ene 2025 |
| Machine Learning | Academia Desafío Latam | 86 | 23 abr 2025 |

Total: 354 horas. Nota SQL: una imagen dice "Julio 19, 2024" y otra
"Octubre 8, 2024", con el mismo número de certificado; usar una sola fila.
El CV además menciona "Data Analyst (Google / Coursera, 2023)" y "Desarrollo
Mobile (Comunidad IT, 2021)", sin imagen en la carpeta.

---

## Sobre mí (de `Documents/Portfolio/cv.html`, `cv-data.html` y `plantillas-mail.md`)

- **Nombre:** Gabriel Sosa. **Ubicación:** Funes, Santa Fe, Argentina.
- **Título actual a usar:** Desarrollador Full-Stack en Teros (único desarrollador). *No* usar "Co-fundador & CTO", que es lo que dice el CV viejo.
- **Contacto público:** gabbysosa32@gmail.com · github.com/gabrielsosa32 · linkedin.com/in/gabrielsosa32 · teros.com.ar. (El CV tiene teléfono; no se copia acá.)
- **Educación:**
  - Licenciatura en Ciencia de Datos — Universidad Nacional de Rosario (UNR), 2025 – actualidad.
  - Técnico Superior en Desarrollo de Software — Terciario Urquiza, 2020.
  - Cursos: Data Science (Desafío Latam, 2025), Data Analyst (Google / Coursera, 2023), Desarrollo Mobile (Comunidad IT, 2021).
- **Experiencia previa:**
  - Junior Data Analyst — THV Ingeniería (2025): diseño de una base relacional para el registro de proyectos, limpieza y normalización de datos históricos, dashboards en Tableau de costos y tiempos de entrega.
  - Data Analyst — Municipalidad de Funes, proyecto voluntario (2025): consolidó 12 reportes mensuales de turnos médicos (22 especialidades) en un dashboard de Power BI que mostró sectores sobrecargados y otros con baja actividad.
  - Teros (2026 – actualidad): los productos de arriba.
- **Idiomas:** español nativo, inglés intermedio.
- **Habilidades que lista el CV y no aparecen arriba:** PHP, MySQL, Firebase, Stripe, Docker, SQL Server, SSIS, R, Power BI.
- **Recomendación:** las plantillas mencionan una carta de recomendación de un desarrollador full-stack senior con quien trabajó (no hay nombre en el archivo).
- **Cifra vieja a no reutilizar:** el CV dice "210+ commits" para Teros; hoy Reservas sola tiene más de 700.

Borrador de párrafo (ES): *Soy desarrollador full-stack en Teros, donde soy el
único desarrollador de cuatro productos en producción: venta de entradas con
QR para boliches, un asistente con IA que toma reservas y pedidos por
WhatsApp, cobro de carga de autos eléctricos con una caja ESP32 y el sitio de
un fabricante industrial. Me ocupo de todo el ciclo: modelo de datos,
pagos con Mercado Pago, integración de IA, firmware, tests y despliegue.
Vengo del análisis de datos y estudio la Licenciatura en Ciencia de Datos en
la UNR.*

Draft (EN): *I'm a full-stack developer at Teros, where I'm the sole developer
behind four products in production: QR ticketing for nightclubs, an AI
assistant that takes bookings and orders over WhatsApp, paid EV charging
through an ESP32 box, and a manufacturer's website. I own the whole cycle:
data model, Mercado Pago payments, AI integration, firmware, tests and
deployment. I come from data analysis and I'm studying for a degree in Data
Science at UNR.*

---

## Páginas públicas para capturas (sin datos de clientes)

**Pases**
- `https://pases.teros.com.ar/` — landing. Tiene un formulario de pedido de demo: capturarlo vacío.
- `https://pases.teros.com.ar/legal/terminos` — no vale la pena.
- **Evitar** `https://pases.teros.com.ar/bosso-club` y `/bosso-club/fin-de-ano`: es un boliche real (aparece en el sitemap). Usarlo solo con permiso del cliente.
- La organización de prueba "Noches de Rosario" no tiene página pública (`/noches-de-rosario` da 404). Para mostrar la app del guardia, el pase `/t/...` o el panel, armar un evento de demo en esa organización y capturar desde ahí.

**Teros Reservas**
- `https://reservas.teros.com.ar/` — landing principal.
- `/como-funciona`, `/gastronomia`, `/canchas-deportivas`, `/peluquerias`, `/consultorios` — landings por rubro.
- El panel y las conversaciones del bot tienen datos de negocios y clientes reales: capturar solo desde una cuenta de prueba, o usar el simulador del bot (`testBotService`).

**Plugo**
- `https://plugo.com.ar/` — landing.
- `https://plugo.com.ar/c/PRUEBA` — página de cargador de demo ("Cochera Demo", dirección ficticia). Hoy muestra la caja "Sin conexión"; si se quiere el estado normal, capturarla con la caja de prueba encendida.
- `https://plugo.com.ar/panel/entrar` — pantalla de login del panel (vacía).
- El panel (`/panel`) muestra ventas del dueño real: no capturar.

**Resortes NV** (sitio público entero, sin datos personales)
- `https://resortesnv.com.ar/`
- `https://resortesnv.com.ar/productos`
- `https://resortesnv.com.ar/faq`
- `https://resortesnv.com.ar/contacto`

---

## Fuentes de cifras

Todos los comandos se corrieron el 2026-10-20 desde `C:\Users\gabby\Documents\Teros` (salvo indicación).

| Cifra | Valor exacto | Fuente |
|---|---|---|
| Pases: más de 250 commits | 256 | `git -C entradas-app rev-list --count HEAD` |
| Pases: 90 archivos de test | 90 | `find entradas-app -path '*/node_modules' -prune -o \( -name '*.test.ts' -o -name '*.spec.ts' -o -name '*.test.js' -o -name '*.test.tsx' \) -print \| wc -l` |
| Pases: más de 100 migraciones | 107 | `ls entradas-app/supabase/migrations \| wc -l` |
| Pases: CI | existe | `entradas-app/.github/workflows/ci.yml` (+ `integracion.yml`) |
| Pases: desde sep 2026 | primer commit 2026-09-09 | `git -C entradas-app log --reverse --format=%ci \| head -1` |
| Pases: QR de 130 caracteres, versión 8, 0,113 ms | — | `entradas-app/docs/plans/2026-09-09-entradas-design.md` §3.3 |
| Pases: AES-256-GCM / Ed25519 | — | `grep` en `entradas-app/src/lib/crypto/*.ts` |
| Pases: responde | 200, Vercel | `curl -sI -L https://pases.teros.com.ar` |
| Pases: commits de Alan | 35 + 2 | `git -C entradas-app shortlog -sne HEAD` |
| Reservas: más de 700 commits | 735 | `git -C tero-reservas rev-list --count HEAD` |
| Reservas: 36 archivos de test | 36 | mismo `find` sobre `tero-reservas` |
| Reservas: 50 migraciones | 50 | `ls tero-reservas/api/src/migrations \| wc -l` |
| Reservas: 28 herramientas del agente | 28 | `grep -rhoE "name: ['\"][a-z_]+['\"]" tero-reservas/api/src/services/ai/tools \| sort -u` |
| Reservas: índices únicos anti doble reserva | — | `tero-reservas/api/src/migrations/026_group_booking_mode.sql` |
| Reservas: lectura de comprobantes con visión | — | `tero-reservas/api/src/services/receiptReader.js` |
| Reservas: CI | existe | `tero-reservas/.github/workflows/ci.yml` (corre `npm test`) |
| Reservas: desde mar 2026 | 2026-03-19 | `git -C tero-reservas log --reverse --format=%ci \| head -1` |
| Reservas: responde | 200, Vercel | `curl -sI -L https://reservas.teros.com.ar` |
| Plugo: más de 350 commits | 371 | `git -C toma-app rev-list --count HEAD` |
| Plugo: más de 100 archivos de test | 109 (84 .ts + 25 .tsx) | mismo `find` sobre `toma-app` |
| Plugo: 22 migraciones | 22 | `ls toma-app/supabase/migrations \| wc -l` |
| Plugo: poll 3 s, 60 req/min, token 32 bytes + SHA-256, un comando en vuelo | — | `toma-app/docs/device-api.md`, `toma-app/docs/seguridad.md` |
| Plugo: AES-256-GCM | — | `toma-app/src/lib/crypto.ts` |
| Plugo: firmware ESP32 | 872 líneas | `toma-app/firmware/caja/caja.ino` (`grep -c ""`) |
| Plugo: autoría del firmware | solo Gabriel/Claude | `git -C toma-app log --format='%an' -- firmware \| sort \| uniq -c` |
| Plugo: CI | existe | `toma-app/.github/workflows/ci.yml` |
| Plugo: responde con el producto | 200, título "Plugo — Cobrá por cargar autos eléctricos…" | `curl -s -L https://plugo.com.ar \| grep -o '<title>…'` |
| Resortes: 100 commits | 100 | `git -C ResortesV2 rev-list --count HEAD` |
| Resortes: 4 archivos de test | 4 | `find ResortesV2/tests -type f` |
| Resortes: 15 productos | 15 | `node -e "console.log(require('./content/productos.json').length)"` en `ResortesV2` |
| Resortes: responde | 200, Vercel | `curl -sI -L https://resortesnv.com.ar` |
| Techos: más de 750 commits (71 de Alan) | 778 | `git -C Techos rev-list --count HEAD`, `git -C Techos shortlog -sne HEAD` |
| Techos: más de 100 archivos de test | 103 (70 Vitest + 33 Playwright) | `find Techos/tests -name '*.test.ts'`, `find Techos/e2e -name '*.spec.ts'` |
| Teros Pedidos: commits | 263 | `git -C Teros-Pedidos rev-list --count HEAD` |
| Avatar: commits | 19 | `git -C C:/Users/gabby log --oneline -- Documents/Teros/Avatar \| wc -l` |
| Vuelos: R² 0,97 Random Forest | 0,974492 | `Proyectos/Vuelos/PruebaFinal.ipynb`, celda 44 (salida) |
| Vuelos: más de 300.000 filas | 300.261 (índice 0–300260) | mismo notebook, celda 7 |
| Fake news: LSTM accuracy 91% | 0,9173 (2.093 en test) | `Machine learning/Redes neuronales/TPFinal/TPFinalSosaGabriel.ipynb`, celdas 19–20 |
| Casas: Stacking R² 0,63 | 0,6395571 | `Proyectos/Casas/Casas.ipynb`, celda 17 |
| Casas: 545 viviendas | 545 | mismo notebook, salida "[545 rows x 9 columns]" |
| Boosting: AUC 0,89 AdaBoost ajustado | 0,8907 | `Proyectos/Boosting/Adaboost,gradient,XGB.ipynb`, celda 27 |
| Boosting: 720 pacientes | 720 | mismo notebook, salida "[720 rows x 14 columns]" |
| Churn: ROC AUC 0,86 Bagging + SMOTE | 0,864360 (834 en test) | `Machine learning/Redes neuronales/TP1/TP1SosaGabriel.ipynb`, celda 17 |
| Certificados: 5 distintos, 354 horas | 70+76+76+46+86 | PNG leídos en `Certificados Data Cience/`; `md5sum *` para los duplicados |

Los notebooks se leyeron con un script que imprime las salidas guardadas
(`json.load` del `.ipynb`); no se re-ejecutó ninguno.
