# Pendientes

## Errores
- [x] `pue/index.html`: dos documentos HTML concatenados; `</a>` sobrante en el `<h2>`.
- [x] Páginas índice: `<il>` → `<li>`; `lang="en"` → `lang="es"`.
- [x] `capas.js`, `crear_cuenca`: `getColor` usa `=` en lugar de `===`. Se eliminó la función.
- [ ] `minimap.js`: la variable `argenmap_gris` usa la URL de Argenmap color. Decidir qué base va y alinear el nombre.
- [ ] Créditos: revisar si corresponde OpenStreetMap; agregar las fuentes de los datos (Serman, ADA).

## Código
- [ ] Renombrar a camelCase (commit aparte, sin cambios de comportamiento).
- [ ] Una sola definición de simbología para capas y referencias.
- [ ] Pasar los estilos inline de `referencias.js` a `map.css`.
- [ ] Menores: `L.tileLayer` sin `new`, unir imports de `capas.js`, quitar el parámetro sin uso de `crear_referencias`.

## Funcionalidad
- [ ] Tooltip o popup con `Name` y `Tipo` en la red hídrica.
- [ ] Control de capas.
- [x] Decidir si se muestra el límite de cuenca de la Secretaría de Energía. No se muestra.

## Datos
- [ ] Red hídrica: quitar la coordenada z (siempre 0) y reducir decimales.
- [ ] Completar la procedencia de cada capa en `docs/specs/reconquista.md`.

## Publicación
- [x] Después del push, verificar que `iiiamb.github.io/CLAUDE.html` y `/docs/pendientes.html` den 404.
