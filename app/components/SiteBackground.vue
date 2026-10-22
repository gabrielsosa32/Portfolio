<template>
  <!-- Fondo de toda la página: grilla tenue + red de puntos. Queda fijo detrás del contenido. -->
  <div class="bg" aria-hidden="true">
    <NetworkBackground />
  </div>
</template>

<style scoped>
.bg {
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background-color: var(--bg);
  background-image:
    linear-gradient(rgba(var(--net-rgb), .05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--net-rgb), .05) 1px, transparent 1px);
  background-size: 32px 32px;
}
/* La grilla se desvanece hacia los bordes con una capa de degradado (más barata que una máscara). */
.bg::after {
  content: ''; position: absolute; inset: 0; z-index: 1;
  background: radial-gradient(ellipse at 50% 30%, transparent 40%, rgb(12 10 9 / .5) 100%);
}
</style>
