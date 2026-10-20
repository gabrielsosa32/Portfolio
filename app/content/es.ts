import type { SiteContent } from './types'

export const es: SiteContent = {
  meta: {
    title: 'Gabriel Sosa — Desarrollador Full-Stack',
    description:
      'Desarrollador Full-Stack en Funes, Santa Fe. Construyo productos completos, de la idea a producción: pagos con Mercado Pago, bots con IA, QR y hardware.',
  },
  nav: { projects: 'Proyectos', data: 'Datos', about: 'Sobre mí', contact: 'Contacto', switchLang: 'Cambiar idioma a inglés' },
  hero: {
    role: 'Desarrollador Full-Stack',
    location: 'Funes, Santa Fe, Argentina',
    titleLead: 'Armo productos completos, de la',
    titleHighlight: 'idea a producción.',
    subtitle:
      'Soy el único desarrollador de cuatro productos en producción: entradas con QR, un asistente con IA por WhatsApp, cobro de carga de autos eléctricos y el sitio de un fabricante. Aprendo lo que haga falta para terminar el trabajo.',
    availability: 'Disponible · remoto o presencial',
    cta: { cv: 'Descargar CV', contact: 'Contacto' },
    cvHref: '/cv/gabriel-sosa-cv-es.pdf',
  },
  projects: {
    eyebrow: 'Proyectos',
    title: 'Productos reales, con usuarios y pagos reales',
    intro: 'Desarrollados en Teros. Hacé clic en cada uno para ver el problema, qué construí y lo más difícil.',
    more: 'Ver más',
    close: 'Cerrar',
    live: 'en producción',
    pilot: 'piloto',
    othersTitle: 'Otros proyectos',
    labels: {
      problem: 'El problema',
      built: 'Qué construí',
      hard: 'Lo difícil',
      result: 'Resultado',
      visit: 'Visitar sitio',
    },
    main: [
      {
        id: 'pases',
        name: 'Pases',
        status: 'live',
        url: 'https://pases.teros.com.ar',
        tagline: 'Entradas con QR, control de puerta sin señal y barra con pedidos para boliches.',
        stack: ['Next.js', 'TypeScript', 'Supabase', 'Mercado Pago', 'PWA', 'Vercel'],
        image: '/img/projects/pases.webp',
        imageAlt: 'Página de inicio de Pases con un pase QR y la pantalla de puerta en un celular',
        problem:
          'Los boliches venden entradas por canales sueltos (listas de RRPP, transferencias, efectivo) y en la puerta no tienen cómo saber si un QR es válido, ya se usó o es de otra noche, menos cuando el celular del guardia se queda sin señal. La plata se concilia a mano y la plataforma tiene que cobrar su comisión sin tocar el dinero del boliche.',
        built: [
          'Venta pública por evento con tandas de precio, cupos por sector, códigos de RRPP y pase digital con QR que llega por mail.',
          'App de puerta (PWA) que escanea QR y da veredicto verde / amarillo / rojo, con venta en puerta, funcionando sin conexión.',
          'Barra: carta pública, pedidos y cobro desde el celular, y pantalla de barra que canjea lo pedido.',
          'Paneles para el dueño, RRPP y administración de la plataforma, con movimientos en vivo y exportes CSV.',
        ],
        hard: [
          'QR firmado por evento con Ed25519: la puerta valida sin red y verificar una firma toma 0,113 ms.',
          'Puerta offline con reconciliación: manifiesto en IndexedDB, cola de escaneos que se sincroniza al volver la señal y resolución de duplicados entre guardias.',
          'Mercado Pago Marketplace: cada boliche vincula su cuenta por OAuth, tokens cifrados con AES-256-GCM, comisión congelada en la orden y webhook idempotente.',
          'Multi-tenant en Postgres con RLS y más de 100 migraciones.',
        ],
        result: [
          'En producción en pases.teros.com.ar, con el primer boliche en puesta en marcha.',
          'Compra real verificada de punta a punta contra la comisión informada por Mercado Pago.',
          '90 archivos de test y CI en GitHub Actions (typecheck, lint, tests y build en cada push).',
        ],
      },
      {
        id: 'reservas',
        name: 'Teros Reservas',
        status: 'live',
        url: 'https://reservas.teros.com.ar',
        tagline: 'Un asistente con IA que toma reservas y pedidos por WhatsApp, las 24 horas.',
        stack: ['Node.js', 'Claude API', 'WhatsApp API', 'Redis', 'Supabase', 'Nuxt', 'Mercado Pago'],
        image: '/img/projects/reservas.webp',
        imageAlt: 'Página de inicio de Teros: pedidos y reservas por WhatsApp con IA',
        problem:
          'Canchas, peluquerías, consultorios y restaurantes reciben reservas y pedidos por WhatsApp, y alguien tiene que contestar a mano a cualquier hora, chequear disponibilidad, pedir la seña y perseguir el comprobante. Cuando el negocio no contesta, el cliente se va.',
        built: [
          'Bot por WhatsApp e Instagram que consulta disponibilidad, propone, confirma y cancela reservas, y arma pedidos con carrito, combos, retiro o delivery.',
          'Panel del negocio (PWA con notificaciones push): calendario, recursos y horarios, menú, pedidos, contactos y analíticas.',
          'Cobros con señas y links de Mercado Pago, y transferencias validadas leyendo la foto del comprobante.',
          'SaaS multi-empresa con planes, módulos de Reservas y Pedidos, prueba gratuita y onboarding guiado.',
        ],
        hard: [
          'Agente de IA con 28 herramientas que reserva sin doble reserva: propone, espera confirmación y la garantía final la dan índices únicos parciales en Postgres.',
          'Lectura de comprobantes con visión: extrae monto, fecha y pagador de la foto y la empareja con el pedido o la seña.',
          'Procesamiento asíncrono: los webhooks de Meta solo encolan y un worker con BullMQ + Redis procesa los mensajes, con atajos que no pasan por el modelo.',
          'Multi-tenancy con RLS en Supabase y 50 migraciones SQL.',
        ],
        result: [
          'En producción, con negocios usando el bot todos los días.',
          '36 archivos de test más simulaciones de conversación, con CI en GitHub Actions.',
          'El módulo de Pedidos nació como un prototipo aparte y lo integré al producto.',
        ],
      },
      {
        id: 'plugo',
        name: 'Plugo',
        status: 'pilot',
        url: 'https://plugo.com.ar',
        tagline: 'Convierte cualquier cargador de autos eléctricos en un punto de carga paga con un QR.',
        stack: ['Next.js', 'TypeScript', 'Supabase', 'Mercado Pago', 'ESP32 (C++)', 'Vercel'],
        image: '/img/projects/plugo.webp',
        imageAlt: 'Página de inicio de Plugo con la pantalla de pago y el contador de carga',
        problem:
          'Cocheras, hoteles y estacionamientos tienen cargadores para autos eléctricos pero no tienen forma de cobrar la carga: o la regalan o no la ofrecen. Cambiar el cargador por uno "inteligente" es caro, y el dueño necesita cobrar sin estar presente.',
        built: [
          'Página por cargador: el conductor escanea el QR, elige minutos y paga con Mercado Pago; ve el tiempo restante y puede extenderlo.',
          'Firmware para una caja ESP32 con relé que se instala delante del cargador existente y lo habilita por el tiempo pagado.',
          'Panel del dueño: cargadores, ventas, planes, encendido manual y vinculación de su cuenta de Mercado Pago.',
          'Tareas programadas de vencimiento y reembolso automático si la caja no llega a habilitar la carga.',
        ],
        hard: [
          'Autenticación de cajas: código de activación de un solo uso que se canjea por un token (en la base solo queda su hash), cola de comandos con un comando en vuelo y deduplicación en el firmware.',
          'El tiempo lo cuenta la caja: si se cae internet, la corriente se corta igual. TLS con certificado raíz fijado en el ESP32.',
          'Pagos divididos con Mercado Pago: el dueño cobra directo y la plataforma se queda con su porcentaje, con reembolsos automáticos.',
        ],
        result: [
          'Landing, página por cargador y panel del dueño en producción; piloto con el primer punto de carga.',
          'Más de 100 archivos de test y CI en GitHub Actions.',
          'Revisión de seguridad escrita del firmware y de los endpoints de dispositivos.',
        ],
      },
      {
        id: 'resortes',
        name: 'Resortes NV',
        status: 'live',
        url: 'https://resortesnv.com.ar',
        tagline: 'Sitio institucional y catálogo para un fabricante de resortes a gas de Rosario.',
        stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind', 'zod', 'Resend'],
        image: '/img/projects/resortes.webp',
        imageAlt: 'Página de inicio de Resortes NV',
        problem:
          'Una fábrica con más de 30 años en el mercado no tenía una web que mostrara su catálogo ni que convirtiera visitas en consultas de distribuidores y clientes.',
        built: [
          'Sitio con inicio, catálogo de productos con ficha por código, preguntas frecuentes y contacto.',
          'Formularios de contacto, pedido de catálogo y distribuidores, enviados por mail.',
          'API propia para productos y contacto, con contenido en JSON listo para pasar a una base de datos.',
        ],
        hard: [
          'Validación compartida entre cliente y servidor con los mismos schemas de zod, y límite de envíos en los formularios.',
          'SEO técnico: rutas prerenderizadas, sitemap, metadatos e imágenes en AVIF/WebP.',
          'El mismo código se despliega en Vercel o en un servidor Node propio.',
        ],
        result: [
          'En producción en resortesnv.com.ar para un cliente real.',
          'Tests sobre la API, los schemas y los composables.',
        ],
      },
    ],
    others: [
      {
        name: 'Techos',
        description:
          'Marketplace que conecta dueños de casas con techistas, con reputación documentada (fotos antes/después) e historial de cada propiedad. MVP con tests unitarios y end-to-end.',
        stack: ['Nuxt 4', 'Prisma', 'PostgreSQL', 'Playwright'],
      },
      {
        name: 'Avatar Companion',
        description:
          'App de escritorio con un avatar Live2D que escucha por micrófono, responde con voz y conversa con personalidad usando un LLM.',
        stack: ['Electron', 'Live2D', 'Claude API', 'Web Speech'],
      },
      {
        name: 'Buscador de clientes',
        description:
          'Scrapers que arman listas de prospectos (canchas, barberías, clínicas) desde Google Maps y OpenStreetMap, ordenadas por un puntaje de rating y reseñas.',
        stack: ['Python', 'Playwright', 'OpenStreetMap'],
      },
    ],
  },
  data: {
    eyebrow: 'Datos',
    title: 'También trabajo con datos',
    intro:
      'Vengo del análisis de datos y estudio la Licenciatura en Ciencia de Datos en la UNR. Algunos proyectos de machine learning, con el código público:',
    viewCode: 'Ver código',
    toolsTitle: 'Herramientas',
    certificatesTitle: 'Certificaciones (Academia Desafío Latam, 354 horas)',
    projects: [
      {
        name: 'Precio de vuelos',
        metric: 'R² 0,97',
        description: 'Regresión sobre más de 300.000 vuelos (aerolínea, ruta, escalas, duración, clase). Comparé 6 modelos con GridSearchCV; ganó Random Forest.',
        repo: 'https://github.com/gabrielsosa32/Flight-price-prediction',
      },
      {
        name: 'Noticias falsas',
        metric: '91% de acierto',
        description: 'Clasificador con una red LSTM sobre embeddings Word2Vec preentrenados, evaluado sobre 2.093 noticias.',
        repo: 'https://github.com/gabrielsosa32/tp-final-deep-learning',
      },
      {
        name: 'Enfermedad cardíaca',
        metric: 'AUC 0,89',
        description: 'AdaBoost vs Gradient Boosting vs XGBoost, con y sin ajuste de hiperparámetros, sobre 720 pacientes. Con app en Streamlit.',
        repo: 'https://github.com/gabrielsosa32/Boostingmodels',
      },
      {
        name: 'Abandono de clientes',
        metric: 'AUC 0,86',
        description: 'Predicción de churn en telecomunicaciones con árboles, SMOTE, bagging y Random Forest. Con app en Streamlit.',
        repo: 'https://github.com/gabrielsosa32/churn-prediction',
      },
      {
        name: 'Precio de viviendas',
        metric: 'R² 0,63',
        description: 'Comparación honesta de 8 modelos de regresión sobre un dataset chico (545 casas); el mejor fue Stacking. Con app en Streamlit.',
        repo: 'https://github.com/gabrielsosa32/house-price-prediction',
      },
    ],
    tools: ['Python', 'pandas', 'scikit-learn', 'TensorFlow / Keras', 'SQL', 'Tableau', 'Power BI', 'Streamlit'],
    certificates: [
      'SQL para el análisis de datos',
      'Programación con Python para el análisis de datos',
      'Análisis estadístico con Python',
      'Visualización y comunicación de insights',
      'Machine Learning',
    ],
  },
  about: {
    eyebrow: 'Sobre mí',
    title: 'Me ocupo de todo el ciclo',
    paragraphs: [
      'Soy desarrollador full-stack en Teros. Ahí construí cuatro productos que hoy están en producción: me ocupo del modelo de datos, los pagos con Mercado Pago, la integración de IA, el firmware, los tests y el despliegue.',
      'Antes trabajé como analista de datos: diseñé una base relacional y dashboards en Tableau en THV Ingeniería, y en un proyecto voluntario para la Municipalidad de Funes consolidé reportes de turnos médicos en un tablero de Power BI. Soy Técnico Superior en Desarrollo de Software y estudio la Licenciatura en Ciencia de Datos en la UNR.',
      'Cuando un proyecto necesita algo que no sé, lo aprendo: así llegué a programar un ESP32, integrar un agente de IA con herramientas o montar pagos marketplace.',
    ],
    role: 'Único desarrollador: diseñé y programé todo, de la base de datos al despliegue. Las ideas de producto las definimos con mi socio.',
    howIWorkTitle: 'Cómo trabajo',
    howIWork: [
      'Tests y CI desde el primer día: cientos de archivos de test entre los productos.',
      'Documento antes de construir: diseño, plan y revisión de seguridad.',
      'Pagos reales en producción, con webhooks idempotentes y reembolsos.',
      'Uso IA (Claude Code) como herramienta de trabajo diaria, con criterio y revisión.',
    ],
    stackTitle: 'Stack',
    stack: [
      'TypeScript', 'JavaScript', 'Vue / Nuxt', 'React / Next.js', 'Node.js / Express',
      'PostgreSQL / Supabase', 'Redis', 'Python', 'Mercado Pago', 'Claude API', 'ESP32', 'Git / GitHub Actions',
    ],
  },
  contact: {
    title: '¿Hablamos?',
    subtitle: 'Estoy buscando trabajo como desarrollador, remoto o presencial. Escribime y coordinamos una charla.',
    email: 'gabbysosa32@gmail.com',
    github: 'https://github.com/gabrielsosa32',
    linkedin: 'https://www.linkedin.com/in/gabrielsosa32/',
    cv: 'Descargar CV',
    footer: '© 2026 Gabriel Sosa · Hecho con Nuxt',
  },
}
