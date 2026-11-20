# iiiamb.github.io

Sitio estático del IIIA (CONICET-UNSAM) en GitHub Pages. El contenido principal es el mapa de la cuenca del Río Reconquista del PUE, en `pue/mapas/cuenca_reconquista/`. Se modifica poco.

- Pendientes: `docs/pendientes.md`. Al cerrar un punto, tildarlo en el mismo commit.
- Especificaciones: `docs/specs/`, un archivo por mapa. Las decisiones de diseño se registran ahí.
- `CLAUDE.md` y `docs/` están excluidos de la publicación en `_config.yml`.

## Convenciones
- JavaScript: camelCase para variables y funciones, MAYÚSCULAS para constantes, nombres en castellano. El código todavía usa snake_case; el renombre está en pendientes.
- Las propiedades de los GeoJSON se dejan como vienen de los datos.
- Sin build ni dependencias locales: Leaflet por CDN e `importmap`.

## Verificación local
Desde la raíz del repo:

```bash
python3 -m http.server 8000
```

y abrir http://localhost:8000/pue/mapas/cuenca_reconquista/
