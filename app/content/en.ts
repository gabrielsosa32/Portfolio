import type { SiteContent } from './types'

export const en: SiteContent = {
  meta: {
    title: 'Gabriel Sosa — Full-Stack Developer',
    description:
      'Full-Stack Developer based in Argentina. I build complete products, from idea to production: payments, AI bots, QR flows and ESP32 firmware.',
  },
  nav: { projects: 'Projects', data: 'Data', about: 'About', contact: 'Contact', switchLang: 'Switch language to Spanish' },
  hero: {
    role: 'Full-Stack Developer',
    location: 'Funes, Santa Fe, Argentina',
    titleLead: 'I build complete products, from',
    titleHighlight: 'idea to production.',
    subtitle:
      "I'm the lead developer behind four real products: QR ticketing, an AI assistant on WhatsApp, paid EV charging and a manufacturer's website. I learn whatever it takes to get the job done.",
    availability: 'Available · remote or on-site',
    cta: { cv: 'Download CV', contact: 'Contact' },
    cvHref: '/cv/gabriel-sosa-cv-en.pdf',
  },
  projects: {
    eyebrow: 'Projects',
    title: 'Real products, in production',
    intro: 'Built at Teros. Click any of them to see the problem, what I built and the hardest parts.',
    more: 'Read more',
    close: 'Close',
    live: 'in production',
    pilot: 'pilot',
    othersTitle: 'Other projects',
    labels: {
      problem: 'The problem',
      built: 'What I built',
      hard: 'Hard parts',
      result: 'Results',
      visit: 'Visit site',
    },
    main: [
      {
        id: 'pases',
        name: 'Pases',
        status: 'live',
        url: 'https://pases.teros.com.ar',
        tagline: 'QR tickets, offline door control and bar ordering for nightclubs.',
        stack: ['Next.js', 'TypeScript', 'Supabase', 'Mercado Pago', 'PWA', 'Vercel'],
        image: '/img/projects/pases.webp',
        imageAlt: 'Pases home page showing a QR pass and the door screen on a phone',
        problem:
          "Nightclubs sell tickets through scattered channels (promoter lists, bank transfers, cash), and door staff have no reliable way to tell whether a QR is valid, already used or from another night, especially when the phone loses signal. Reconciliation is manual, and the platform has to take its fee without ever holding the club's money.",
        built: [
          'Public event pages with price tiers, per-sector capacity, promoter codes and a digital QR pass delivered by email.',
          'A door app (PWA) that scans QRs and returns a green / yellow / red verdict, with door sales, working fully offline.',
          'Bar module: public menu, ordering and payment from the phone, plus a bar screen to redeem orders.',
          'Dashboards for owners, promoters and platform admins, with live activity and CSV exports.',
        ],
        hard: [
          'Per-event Ed25519-signed QR codes: the door verifies without a network, and a signature check takes 0.113 ms.',
          'Offline door with reconciliation: manifest in IndexedDB, a scan queue that syncs when the signal returns, and duplicate resolution across devices.',
          'Mercado Pago Marketplace: each club links its account via OAuth, tokens encrypted with AES-256-GCM, fee frozen on the order and an idempotent webhook.',
          'Multi-tenant Postgres with RLS and over 100 migrations.',
        ],
        result: [
          'Live at pases.teros.com.ar, with the first club onboarding.',
          'A real purchase verified end to end against the fee Mercado Pago reported.',
          '90 test files and GitHub Actions CI (typecheck, lint, tests and build on every push).',
        ],
      },
      {
        id: 'reservas',
        name: 'Teros Reservas',
        status: 'live',
        url: 'https://reservas.teros.com.ar',
        tagline: 'An AI assistant that takes bookings and orders over WhatsApp, 24/7.',
        stack: ['Node.js', 'Claude API', 'WhatsApp API', 'Redis', 'Supabase', 'Nuxt', 'Mercado Pago'],
        image: '/img/projects/reservas.webp',
        imageAlt: 'Teros home page: orders and bookings over WhatsApp with AI',
        problem:
          "Sports courts, salons, clinics and restaurants get bookings and orders over WhatsApp, and someone has to answer by hand at any hour, check availability, ask for a deposit and chase the transfer receipt. When the business doesn't reply, the customer goes elsewhere.",
        built: [
          'A WhatsApp and Instagram bot that checks availability, proposes, confirms and cancels bookings, and takes orders with a cart, combos, pickup or delivery.',
          'A business dashboard (PWA with push notifications): calendar, resources and schedules, menu, orders, contacts and analytics.',
          'Payments with Mercado Pago deposits and links, plus bank transfers validated by reading a photo of the receipt.',
          'Multi-tenant SaaS with plans, Bookings and Orders modules, free trial and guided onboarding.',
        ],
        hard: [
          'An AI agent with 28 tools that never double-books: it proposes, waits for confirmation, and Postgres partial unique indexes give the final guarantee.',
          'Receipt reading with vision: it extracts amount, date and payer from the photo and matches it to the order or deposit.',
          'Async processing: Meta webhooks only enqueue, and a BullMQ + Redis worker handles messages, with fast paths that skip the model.',
          'Multi-tenancy with RLS on Supabase and 50 SQL migrations.',
        ],
        result: [
          'In production, with businesses using the bot.',
          '36 test files plus conversation simulations, with GitHub Actions CI.',
          'The Orders module started as a separate prototype and I merged it into the product.',
        ],
      },
      {
        id: 'plugo',
        name: 'Plugo',
        status: 'pilot',
        url: 'https://plugo.com.ar',
        tagline: 'Turns any EV charger into a paid charging point with a QR code.',
        stack: ['Next.js', 'TypeScript', 'Supabase', 'Mercado Pago', 'ESP32 (C++)', 'Vercel'],
        image: '/img/projects/plugo.webp',
        imageAlt: 'Plugo home page showing the payment screen and the charging timer',
        problem:
          "Garages, hotels and parking lots have EV chargers but no way to charge for the electricity: they either give it away or don't offer it. Replacing the charger with a \"smart\" one is expensive, and the owner needs to get paid without being there.",
        built: [
          'A page per charger: the driver scans the QR, picks a time plan and pays with Mercado Pago, then sees the remaining time and can extend it.',
          'Firmware for an ESP32 relay box installed in front of the existing charger, enabling it for the paid time.',
          'Owner dashboard: chargers, sales, plans, manual start and linking their own Mercado Pago account.',
          'Scheduled jobs for expiration and automatic refunds when the box fails to start the charge.',
        ],
        hard: [
          'Device auth: a one-time activation code redeemed for a token (only its hash is stored), a command queue with one in-flight command and firmware-side deduplication.',
          'The box keeps the time: if the internet drops, power is still cut on schedule. TLS with a pinned root certificate on the ESP32.',
          'Split payments with Mercado Pago: the owner is paid directly and the platform keeps its fee, with automatic refunds.',
        ],
        result: [
          'Landing, per-charger page and owner dashboard in production; piloting with the first charging point.',
          '100+ test files and GitHub Actions CI.',
          'A written security review of the firmware and device endpoints.',
        ],
      },
      {
        id: 'resortes',
        name: 'Resortes NV',
        status: 'live',
        url: 'https://resortesnv.com.ar',
        tagline: 'Corporate website and catalog for a gas-spring manufacturer in Rosario.',
        stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind', 'zod', 'Resend'],
        image: '/img/projects/resortes.webp',
        imageAlt: 'Resortes NV home page',
        problem:
          'A manufacturer with more than 30 years in the market had no website showing its catalog or turning visits into inquiries from distributors and customers.',
        built: [
          'A site with home, product catalog with a page per product code, FAQ and contact.',
          'Contact, catalog-request and distributor forms delivered by email.',
          'Its own API for products and contact, with JSON content ready to move to a database.',
        ],
        hard: [
          'Shared client/server validation with the same zod schemas, plus rate limiting on the forms.',
          'Technical SEO: prerendered routes, sitemap, metadata and AVIF/WebP images.',
          'The same code deploys to Vercel or to a self-hosted Node server.',
        ],
        result: [
          'Live at resortesnv.com.ar for a real client.',
          'Tests covering the API, schemas and composables.',
        ],
      },
    ],
    others: [
      {
        name: 'Techos',
        description:
          'A marketplace connecting homeowners with roofers, with documented reputation (before/after photos) and a history per property. MVP with unit and end-to-end tests.',
        stack: ['Nuxt 4', 'Prisma', 'PostgreSQL', 'Playwright'],
      },
      {
        name: 'Avatar Companion',
        description:
          'A desktop app with a Live2D avatar that listens through the mic, answers by voice and chats in character using an LLM.',
        stack: ['Electron', 'Live2D', 'Claude API', 'Web Speech'],
      },
      {
        name: 'Lead finder',
        description:
          'Scrapers that build prospect lists (sports courts, barbershops, clinics) from Google Maps and OpenStreetMap, ranked by a rating and reviews score.',
        stack: ['Python', 'Playwright', 'OpenStreetMap'],
      },
    ],
  },
  data: {
    eyebrow: 'Data',
    title: 'I also work with data',
    intro:
      "I come from data analysis and I'm studying for a degree in Data Science at UNR. A few machine learning projects, with public code:",
    viewCode: 'View code',
    toolsTitle: 'Tools',
    certificatesTitle: 'Certifications (Academia Desafío Latam, 354 hours)',
    projects: [
      {
        name: 'Flight prices',
        metric: 'R² 0.97',
        description: 'Regression on 300,000+ flights (airline, route, stops, duration, class). I compared 6 models with GridSearchCV; Random Forest won.',
        repo: 'https://github.com/gabrielsosa32/Flight-price-prediction',
      },
      {
        name: 'Fake news',
        metric: '91% accuracy',
        description: 'A classifier using an LSTM over pretrained Word2Vec embeddings, evaluated on 2,093 articles.',
        repo: 'https://github.com/gabrielsosa32/tp-final-deep-learning',
      },
      {
        name: 'Heart disease',
        metric: 'AUC 0.89',
        description: 'AdaBoost vs Gradient Boosting vs XGBoost, default and tuned, on 720 patients. Includes a Streamlit app.',
        repo: 'https://github.com/gabrielsosa32/Boostingmodels',
      },
      {
        name: 'Customer churn',
        metric: 'AUC 0.86',
        description: 'Telecom churn prediction with decision trees, SMOTE, bagging and Random Forest. Includes a Streamlit app.',
        repo: 'https://github.com/gabrielsosa32/churn-prediction',
      },
      {
        name: 'House prices',
        metric: 'R² 0.63',
        description: 'An honest comparison of 8 regression models on a small dataset (545 houses); Stacking came out on top. Includes a Streamlit app.',
        repo: 'https://github.com/gabrielsosa32/house-price-prediction',
      },
    ],
    tools: ['Python', 'pandas', 'scikit-learn', 'TensorFlow / Keras', 'SQL', 'Tableau', 'Power BI', 'Streamlit'],
    certificates: [
      'SQL for Data Analysis',
      'Python Programming for Data Analysis',
      'Statistical Analysis with Python',
      'Data Visualization and Communicating Insights',
      'Machine Learning',
    ],
  },
  about: {
    eyebrow: 'About',
    title: 'I own the whole cycle',
    paragraphs: [
      "I'm a full-stack developer at Teros, where I built four products: three are in production and one is piloting. I handle the data model, Mercado Pago payments, AI integration, firmware, tests and deployment.",
      'Before that I worked as a data analyst: I designed a relational database and Tableau dashboards at THV Ingeniería, and in a volunteer project for the Municipality of Funes I consolidated medical appointment reports into a Power BI dashboard. I hold a higher technical degree in Software Development and I am studying Data Science at UNR.',
      "When a project needs something I don't know yet, I learn it. That's how I ended up programming an ESP32, wiring an AI agent with tools and setting up marketplace payments.",
    ],
    role: 'Lead developer: I designed and built the products end to end, from the database to deployment. My business partner and I define the product together.',
    howIWorkTitle: 'How I work',
    howIWork: [
      'Tests and CI from day one: hundreds of test files across the products.',
      'Written design before building: design doc, plan and security review.',
      'Real payments in production, with idempotent webhooks and refunds.',
      'I use AI (Claude Code) as an everyday tool, with judgment and review.',
    ],
    stackTitle: 'Stack',
    stack: [
      'TypeScript', 'JavaScript', 'Vue / Nuxt', 'React / Next.js', 'Node.js / Express',
      'PostgreSQL / Supabase', 'Redis', 'Python', 'Mercado Pago', 'Claude API', 'ESP32', 'Git / GitHub Actions',
    ],
  },
  contact: {
    title: "Let's talk",
    subtitle: "I'm looking for a developer role, remote or on-site. Drop me a line and let's set up a call.",
    email: 'gabbysosa32@gmail.com',
    github: 'https://github.com/gabrielsosa32',
    linkedin: 'https://www.linkedin.com/in/gabrielsosa32/',
    cv: 'Download CV',
    footer: '© 2026 Gabriel Sosa · Built with Nuxt',
  },
}
