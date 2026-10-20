# De dónde sale cada cifra del portfolio

Para poder defender cualquier número en una entrevista. Relevado el 2026-10-20; el detalle completo
(comandos exactos y advertencias) está en [research-notes.md](research-notes.md).

| Lo que dice la página | Valor exacto | De dónde sale |
|---|---|---|
| Pases: verificar una firma toma 0,113 ms | 0,113 ms | `entradas-app/docs/plans/2026-09-09-entradas-design.md` §3.3 |
| Pases: más de 100 migraciones | 107 | `ls entradas-app/supabase/migrations` |
| Pases: 90 archivos de test | 90 | `find` de `*.test.ts(x)` / `*.spec.ts` sin `node_modules` |
| Reservas: agente con 28 herramientas | 28 | nombres únicos en `tero-reservas/api/src/services/ai/tools` |
| Reservas: 50 migraciones SQL | 50 | `ls tero-reservas/api/src/migrations` |
| Reservas: 36 archivos de test | 36 | mismo `find` |
| Plugo: más de 100 archivos de test | 109 | mismo `find` |
| Techos: más de 100 archivos de test (70 unitarios + 33 Playwright) | 103 | `find Techos/tests -name '*.test.ts'`, `find Techos/e2e -name '*.spec.ts'` |
| Techos: 24 modelos de datos | 24 | `grep -c '^model ' Techos/prisma/schema.prisma` |
| Techos: MVP en staging | — | `Techos/docs/deploy.md` (Railway staging); techos.ar no responde |
| Cientos de archivos de test entre los productos | 342 (90+36+103+109+4) | suma de lo anterior + Resortes |
| Vuelos: R² 0,97, más de 300.000 vuelos, 6 modelos | 0,9745 · 300.261 filas | `Proyectos/Vuelos/PruebaFinal.ipynb` celdas 7 y 44 |
| Noticias falsas: 91% de acierto, 2.093 noticias | 0,9173 | `TPFinal/TPFinalSosaGabriel.ipynb` celdas 19–20 |
| Enfermedad cardíaca: AUC 0,89, 720 pacientes | 0,8907 | `Proyectos/Boosting/Adaboost,gradient,XGB.ipynb` celda 27 |
| Abandono: AUC 0,86 | 0,8644 (834 en test) | `Redes neuronales/TP1/TP1SosaGabriel.ipynb` celda 17 |
| Viviendas: R² 0,63, 545 casas, 8 modelos | 0,6396 | `Proyectos/Casas/Casas.ipynb` celda 17 |
| Certificaciones: 5, 354 horas | 70+76+76+46+86 | PNG en `Certificados Data Cience/` (SQL aparece 3 veces, es el mismo) |

Cosas a tener en cuenta en una entrevista:
- Los repos de Pases, Reservas y Techos tienen commits de Alan (37, 23 y 71; en Techos son del rediseño visual, 71 de 778). La página no da cantidades de commits por eso.
- Techos: el diseño original estimaba un equipo de 2-3 personas; lo construiste vos (707 de 778 commits).
- En Plugo el firmware es tuyo; la placa y la instalación eléctrica las hace un tercero. La página dice "firmware", no "hardware".
- Vuelos usa el dataset público de vuelos de India (Kaggle); los precios están en rupias.
- En Viviendas, el `best_model.pkl` que se guarda no es el Stacking de la métrica: si alguien abre la app, puede estar usando otro modelo.
