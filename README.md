# Portfolio — Gabriel Sosa

Sitio personal publicado en **https://gabrielsosa32.github.io/Portfolio/**. Es una sola página en Nuxt 4, generada como sitio estático, en español con botón para pasar a inglés.

## Correrlo

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # tests (Vitest)
pnpm generate   # sitio estático en .output/public
```

## Dónde se cambia cada cosa

| Qué | Dónde |
|---|---|
| Todos los textos (español) | `app/content/es.ts` |
| Todos los textos (inglés) | `app/content/en.ts` |
| Foto | guardarla en `public/img/photo.webp` y poner `'/img/photo.webp'` en `photo` dentro de `app/components/HeroSection.vue` |
| Capturas de proyectos | `public/img/projects/*.webp` (1280×800) |
| CV | editar `docs/cv/cv-es.html` / `cv-en.html` y regenerar los PDF en `public/cv/` |
| Colores y estilos base | `app/assets/css/main.css` |

Los tests de `tests/content.test.ts` verifican que el español y el inglés estén alineados y que no se cuelen cosas que no deben ir (títulos viejos, repos privados, etc.). De dónde sale cada cifra: `docs/fuentes-de-cifras.md`.

## Publicación

Cada push a `main` corre los tests, genera el sitio y lo publica en GitHub Pages (`.github/workflows/deploy.yml`).
