export type Lang = 'es' | 'en'
export type ProjectStatus = 'live' | 'pilot' | 'in-progress'
export type ProjectId = 'pases' | 'reservas' | 'techos' | 'plugo' | 'resortes'

export interface Project {
  id: ProjectId
  name: string
  status: ProjectStatus
  url?: string
  /** Una línea: el problema que resuelve. */
  tagline: string
  stack: string[]
  image: string
  imageAlt: string
  problem: string
  built: string[]
  hard: string[]
  result: string[]
}

export interface MiniProject {
  name: string
  description: string
  stack: string[]
}

export interface DataProject {
  name: string
  metric?: string
  description: string
  repo?: string
}

export interface BotDemo {
  /** Nombre del negocio de ejemplo que aparece arriba del chat. */
  business: string
  status: string
  label: string
  caption: string
  messages: { from: 'user' | 'bot'; text: string }[]
}

export interface ExperienceItem {
  role: string
  org: string
  period: string
  points: string[]
}

export interface Testimonial {
  eyebrow: string
  quote: string
  name: string
  role: string
  relation: string
  /** Aclaración debajo (traducción, carta completa a pedido). */
  note: string
}

export interface SiteContent {
  meta: { title: string; description: string }
  nav: { projects: string; experience: string; data: string; about: string; contact: string; switchLang: string }
  hero: {
    role: string
    location: string
    titleLead: string
    titleHighlight: string
    subtitle: string
    availability: string
    cta: { cv: string; contact: string }
    cvHref: string
  }
  projects: {
    eyebrow: string
    title: string
    intro: string
    more: string
    close: string
    live: string
    pilot: string
    inProgress: string
    othersTitle: string
    labels: { problem: string; built: string; hard: string; result: string; visit: string }
    main: Project[]
    others: MiniProject[]
    botDemo: BotDemo
  }
  experience: {
    eyebrow: string
    title: string
    items: ExperienceItem[]
  }
  testimonial: Testimonial
  data: {
    eyebrow: string
    title: string
    intro: string
    viewCode: string
    toolsTitle: string
    certificatesTitle: string
    projects: DataProject[]
    tools: string[]
    certificates: string[]
  }
  about: {
    eyebrow: string
    title: string
    paragraphs: string[]
    role: string
    howIWorkTitle: string
    howIWork: string[]
    stackTitle: string
    stack: string[]
  }
  contact: {
    title: string
    subtitle: string
    email: string
    github: string
    linkedin: string
    cv: string
    footer: string
  }
}
