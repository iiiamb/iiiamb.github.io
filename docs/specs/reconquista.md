# Mapa de la cuenca del Río Reconquista

Ubicación: `pue/mapas/cuenca_reconquista/`

## Propósito
Mapa base de presentación del Proyecto de Unidad Ejecutora. Se ve en https://iiia.conicet.gov.ar/pue/.

## Restricciones
- Sitio estático en GitHub Pages, publicado desde `main` (Jekyll por defecto, sin build propio).
- Leaflet 1.9.4 como módulo ES desde unpkg, resuelto con `importmap`.
- Datos como módulos JS (`export const`) en `js/geojs/`.
- Acceso: la página del IIIA (no admite mapas web ni iframes) muestra una captura del mapa que enlaza a la GitHub Page. Cuando cambia el aspecto del mapa hay que actualizar la captura en esa página.

## Mapa base
- Principal: Argenmap gris (IGN), zoom 5 a 20.
- Minimapa: Argenmap (IGN), zoom máximo 15, zoom del principal menos 5, recuadro de la vista actual.

## Capas
| capa | archivo | geometría | atributos | se muestra |
|---|---|---|---|---|
| Sectores | `sectores.js` | 3 Polygon | `Tramo` | sí |
| Red hídrica | `red_hidrica.js` | 174 MultiLineString | `fid`, `Name`, `Tipo` | sí |
| Embalse Dique Roggero | `embalse_roggero.js` | 1 Polygon con 2 islas | tags de OSM y `@id`, `@version`, `@timestamp` | sí |

Todas en CRS84 (lon/lat WGS84). La red hídrica trae una coordenada z igual a 0.

## Simbología
Definida en un solo lugar, `js/modules/simbologia.js`, que usan las capas y el panel de referencias. La leyenda parte del estilo del mapa y puede ajustarlo: en el mapa los polígonos son semitransparentes para dejar ver el mapa base, en la leyenda (fondo blanco) se usa otra opacidad para que los colores se parezcan a los que se ven en el mapa.

## Interacciones
- Actuales: zoom, desplazamiento, minimapa sincronizado, escala, referencias, etiquetas de cursos de agua desde zoom 10.
- Previstas: ver `docs/pendientes.md`.

## Decisiones
Registrar acá las decisiones de diseño con fecha.

- 2026-11-20: simbología unificada en `simbologia.js`; el estilo de la leyenda se define como ajustes sobre el del mapa (`leyenda`), no como una copia.
- 2026-11-20: embalse del Dique Roggero desde OSM. Se usa el espejo de agua (relación 1859580), no la presa (relación 3812049, el muro). Se dibuja entre sectores y red hídrica para que los cursos queden encima.
- 2026-11-20: etiquetas con el nombre de los arroyos Arias, La Choza y El Durazno y del Río de la Reconquista, en `etiquetas.js`. Cada una se ubica por `fid` y fracción del largo de la línea; el texto es `Name`. Una sola inclinación por etiqueta, la de la cuerda entre los extremos de la etiqueta sobre la línea, recalculada con cada zoom. Itálica serif de 11 px en el azul de la red hídrica, con halo blanco. Se ocultan por debajo del zoom 10. El Arias se etiqueta una sola vez, sobre la feature larga (fid 102); la otra feature con ese nombre (fid 118, 4 km, aislada al norte) no se etiqueta.
