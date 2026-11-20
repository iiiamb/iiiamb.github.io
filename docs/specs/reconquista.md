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
| capa | archivo | fuente | fecha | geometría | atributos | se muestra |
|---|---|---|---|---|---|---|
| Sectores | `sectores.js` | Serman (ADA3) | COMPLETAR | 3 Polygon | `Tramo` | sí |
| Red hídrica | `red_hidrica.js` | Serman-Lu | COMPLETAR (¿260203?) | 174 MultiLineString | `fid`, `Name`, `Tipo` | sí |
| Cuenca | `cuenca_reconq-secr_ener.js` | Secretaría de Energía | COMPLETAR | 1 MultiPolygon | `cuenca`, `sistema`, `region_hid`, `id` | no |

Todas en CRS84 (lon/lat WGS84). La red hídrica trae una coordenada z igual a 0.

## Simbología
| elemento | relleno | borde |
|---|---|---|
| Cuenca Alta | `#b3e5fc` | `#607d8b`, 1 px |
| Cuenca Media | `#b2dfdb` | `#607d8b`, 1 px |
| Cuenca Baja | `#d1c4e9` | `#607d8b`, 1 px |
| Cursos de agua | — | `#005ce6`, 0.5 px |

Opacidad de relleno de los sectores: 0.6.

## Interacciones
- Actuales: zoom, desplazamiento, minimapa sincronizado, escala, referencias.
- Previstas: ver `docs/pendientes.md`.

## Decisiones
Registrar acá las decisiones de diseño con fecha.
