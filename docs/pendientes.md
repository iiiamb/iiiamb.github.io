# Pendientes

## Errores
- [x] `pue/index.html`: dos documentos HTML concatenados; `</a>` sobrante en el `<h2>`.
- [x] Páginas índice: `<il>` → `<li>`; `lang="en"` → `lang="es"`.
- [x] `capas.js`, `crear_cuenca`: `getColor` usa `=` en lugar de `===`. Se eliminó la función.
- [x] `minimap.js`: la variable `argenmap_gris` usa la URL de Argenmap color. Decidir qué base va y alinear el nombre.

## Código
- [x] Renombrar a camelCase (commit aparte, sin cambios de comportamiento).
- [x] Una sola definición de simbología para capas y referencias.
- [x] Pasar los estilos inline de `referencias.js` a `map.css`.
- [x] Menores: `L.tileLayer` sin `new`, unir imports de `capas.js`, quitar el parámetro sin uso de `crear_referencias`.

## Funcionalidad
- [x] Tooltip o popup en las unidades de humedal.
- [x] Control de capas.

## Publicación
- [x] Después del push, verificar que `iiiamb.github.io/CLAUDE.html` y `/docs/pendientes.html` den 404.
