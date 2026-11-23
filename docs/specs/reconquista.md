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
- Actuales: zoom, desplazamiento, minimapa sincronizado, escala, referencias, etiquetas de cursos de agua desde zoom 10, popup al hacer click en una unidad de humedal, casillas en las referencias para ocultar capas.
- Previstas: ver `docs/pendientes.md`.

## Captura en PNG
`python3 scripts/exportar_mapa.py [--commit REF] [--salida ARCHIVO]` extrae el commit con `git archive`, lo sirve en localhost y lo captura con Chromium headless. Por defecto escribe `capturas/cuenca_reconquista_<sha>.png` (excluido de Jekyll y de git).

- Viewport 1000 × 625 px CSS (16:10), escala 2: 2000 × 1250 px, marcado a 300 dpi (169 × 106 mm).
- Abre el mapa con `?captura`: `map.js` agrega la clase `captura` a `<html>` y `map.css` oculta las casillas de las referencias.
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
- 2026-11-23: popup al hacer click en una unidad de humedal: título "Unidades de Humedal", la clase (etiqueta de la leyenda, con tildes, en lugar del valor crudo de `UH_nombre`) y enlaces a los datos (RI CONICET) y al informe (Zenodo). Si hay unidades superpuestas, solo la de arriba. Las demás capas tienen `interactive: false`: no reciben el click y lo dejan pasar a las unidades que estén debajo. El click sobre una unidad no llega al mapa.
- 2026-11-23: casillas en las referencias para mostrar u ocultar: cada tramo de los sectores, cada clase de unidad de humedal y, con una sola casilla, "Cursos de agua" (red hídrica, embalse Roggero y etiquetas). Sectores y unidades de humedal se arman con una subcapa `L.geoJson` por clase (`capaPorClases` en `capas.js`). Cada capa va en su propio panel de Leaflet (`crearPaneles`) para que al volver a mostrarla no quede arriba de las demás. Entre clases de una misma capa, el orden de dibujo es el de aparición en los datos (como en QGIS), no el de la leyenda, y se restablece al volver a mostrar una clase; en las unidades de humedal, Cubeta queda arriba. Si los datos alternaran clases, ese orden intercalado se perdería.
- 2026-11-23: viewport de la captura de 920 × 624 a 1000 × 625 (16:10), sin cambiar el centro del mapa. Con las casillas y la sección de unidades de humedal, las referencias se superponían con la cuenca. Medido en el navegador: el ancho mínimo para dejar 8 px entre referencias y cuenca es 959 px; 3:2 (936) no alcanza. Con 1000 × 625, la cuenca queda a 29 px de las referencias, 114 px o más de los demás controles y 49 px o más del borde.
- 2026-11-23: la captura oculta las casillas de las referencias (`?captura` en la URL). Sin casillas, las referencias miden 223 px de ancho (242 con casillas) y quedan a 48 px de la cuenca con el viewport de 1000 × 625.
