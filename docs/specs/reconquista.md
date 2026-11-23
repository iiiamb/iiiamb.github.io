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
| Unidades de humedal | `unidades_humedal.js` | 3929 MultiPolygon, algunos inválidos | `UH_nombre`, `Tipo_UH_id`, `UH_id`, `Area_ha`, `Perim_km`, `UPH_cod`, `UPH_nombre`, `SUPH_id` | sí |

Todas en CRS84 (lon/lat WGS84). La red hídrica trae una coordenada z igual a 0.

Para convertir una capa nueva (`.geojson` o `.geojsonl`, en CRS84) al formato de `js/geojs/`: `python3 scripts/geojson_a_js.py ENTRADA [--salida ARCHIVO.js] [--variable NOMBRE]`.

## Simbología
Definida en un solo lugar, `js/modules/simbologia.js`, que usan las capas y el panel de referencias. La leyenda parte del estilo del mapa y puede ajustarlo: en el mapa los polígonos son semitransparentes para dejar ver el mapa base, en la leyenda (fondo blanco) se usa otra opacidad para que los colores se parezcan a los que se ven en el mapa.

## Interacciones
- Actuales: zoom, desplazamiento, minimapa sincronizado, escala, referencias, etiquetas de cursos de agua desde zoom 10.
- Previstas: ver `docs/pendientes.md`.

## Captura en PNG
`python3 scripts/exportar_mapa.py [--commit REF] [--salida ARCHIVO]` extrae el commit con `git archive`, lo sirve en localhost y lo captura con Chromium headless. Por defecto escribe `capturas/cuenca_reconquista_<sha>.png` (excluido de Jekyll y de git).

- Viewport 920 × 624 px CSS, escala 2: 1840 × 1248 px, marcado a 300 dpi (156 × 106 mm, entra en el ancho de texto de una A4).
- La escala gráfica está a 54 px del borde izquierdo, a la derecha de los botones de zoom: se pueden recortar hasta 100 px de la izquierda de la captura para sacar los botones sin cortar la escala.
- No depende solo del commit: Leaflet (fijado en 1.9.4) y las teselas del IGN se descargan al capturar. Dos corridas seguidas difieren en unos pocos píxeles del minimapa (diferencia máxima 2/255).

## Decisiones
Registrar acá las decisiones de diseño con fecha.

- 2026-11-20: simbología unificada en `simbologia.js`; el estilo de la leyenda se define como ajustes sobre el del mapa (`leyenda`), no como una copia.
- 2026-11-20: embalse del Dique Roggero desde OSM. Se usa el espejo de agua (relación 1859580), no la presa (relación 3812049, el muro). Se dibuja entre sectores y red hídrica para que los cursos queden encima.
- 2026-11-20: etiquetas con el nombre de los arroyos Arias, La Choza y El Durazno y del Río de la Reconquista, en `etiquetas.js`. Cada una se ubica por `fid` y fracción del largo de la línea; el texto es `Name`. Una sola inclinación por etiqueta, la de la cuerda entre los extremos de la etiqueta sobre la línea, recalculada con cada zoom. Itálica serif de 11 px en el azul de la red hídrica, con halo blanco. Se ocultan por debajo del zoom 10. El Arias se etiqueta una sola vez, sobre la feature larga (fid 102); la otra feature con ese nombre (fid 118, 4 km, aislada al norte) no se etiqueta.
- 2026-11-20: captura reproducible por commit con `scripts/exportar_mapa.py`. Zoom 10 fijo; viewport 882 × 624, el más chico en proporción √2 apaisada en el que la cuenca queda a 8 px o más de los controles (referencias, minimapa, zoom, escala, créditos) y a 10 px o más del borde. Escala 2: texto y vectores nítidos, teselas del mapa base ampliadas.
- 2026-11-20: escala gráfica corrida a la derecha de los botones de zoom (`margin-left: 54px` en `map.css`), también en el mapa web, para poder recortar los botones de la captura.
- 2026-11-20: centro del mapa corrido al sureste 55 × 15 px en zoom 10 respecto del centro de la cuenca (`DESPLAZAMIENTO_CENTRO` en `map.js`), también en el mapa web: con el minimapa abajo a la derecha, la cuenca centrada se veía descentrada. El viewport de la captura pasa a 920 × 624 (ya no en proporción √2), elegidos a ojo entre variantes de desplazamiento y viewport. El minimapa arranca centrado en el mismo punto que el mapa principal.
- 2026-11-23: unidades de humedal con el estilo de `unidades_humedal.qml` (categorías por `UH_nombre`, relleno opaco, borde de 0.26 mm ≈ 1 px). Se dibujan sobre los sectores y debajo del embalse y la red hídrica. En las referencias van después de Cursos de agua, bajo el título "Unidades de Humedal", con las seis clases de `UH_nombre` (propiedad `seccion` en `simbologia.js`). El orden de las capas en `SIMBOLOGIA` es el de la leyenda; el de dibujo lo da `map.js`.
