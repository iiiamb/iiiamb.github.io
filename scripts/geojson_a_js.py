"""Convierte una capa GeoJSON o GeoJSONL en un módulo JS para el mapa.

Salida, con el mismo formato que las capas de `js/geojs/`:

    export const <nombre>Geojson = {
      "type": "FeatureCollection",
      "name": "<nombre del archivo>",
      "crs": { ... CRS84 ... },
      "features": [
        { una feature por línea },
        ...
      ]
    };

Las coordenadas tienen que estar en lon/lat WGS84 (CRS84). El script lo
controla con el rango de las coordenadas y falla si alguna queda afuera; no
reproyecta. Las geometrías se copian sin validarlas ni simplificarlas.

Uso, desde cualquier directorio:
    python3 scripts/geojson_a_js.py ENTRADA [--salida ARCHIVO.js] [--variable NOMBRE]

Por defecto la salida va junto a la entrada con extensión .js, y la variable
es el nombre del archivo en camelCase seguido de "Geojson"
(unidades_humedal.geojsonl → unidadesHumedalGeojson).
"""
import argparse
import json
import re
import sys
from pathlib import Path

CRS84 = {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}}


def leer_features(ruta):
    """Devuelve (nombre, features) de un .geojson (FeatureCollection) o .geojsonl."""
    if ruta.suffix == ".geojsonl":
        features = []
        with ruta.open(encoding="utf-8") as f:
            for numero, linea in enumerate(f, start=1):
                if not linea.strip():
                    continue
                feature = json.loads(linea)
                if feature.get("type") != "Feature":
                    sys.exit(f"{ruta}:{numero}: se esperaba un Feature y se recibió {feature.get('type')!r}.")
                features.append(feature)
        return ruta.stem, features

    datos = json.loads(ruta.read_text(encoding="utf-8"))
    if datos.get("type") != "FeatureCollection":
        sys.exit(f"{ruta}: se esperaba un FeatureCollection y se recibió {datos.get('type')!r}.")
    if "crs" in datos and datos["crs"] != CRS84:
        sys.exit(f"{ruta}: el CRS es {datos['crs']}, se esperaba CRS84. Reproyectar antes de convertir.")
    return datos.get("name", ruta.stem), datos["features"]


def posiciones(coordenadas):
    """Recorre las posiciones [lon, lat, ...] de un arreglo de coordenadas anidado."""
    if coordenadas and isinstance(coordenadas[0], (int, float)):
        yield coordenadas
    else:
        for c in coordenadas:
            yield from posiciones(c)


def controlar_lon_lat(features, ruta):
    for i, feature in enumerate(features):
        if feature["geometry"] is None:
            continue
        for lon, lat, *_ in posiciones(feature["geometry"]["coordinates"]):
            if not (-180 <= lon <= 180 and -90 <= lat <= 90):
                sys.exit(
                    f"{ruta}: la feature {i} tiene la coordenada ({lon}, {lat}), "
                    "fuera de lon/lat. ¿Está en otro CRS?"
                )


def a_camel_case(nombre):
    partes = [p for p in re.split(r"[^0-9A-Za-z]+", nombre) if p]
    return partes[0].lower() + "".join(p.capitalize() for p in partes[1:])


def escribir_js(ruta, variable, nombre, features):
    lineas_features = ",\n".join(
        "    " + json.dumps(f, ensure_ascii=False) for f in features
    )
    contenido = (
        f"export const {variable} = {{\n"
        f'  "type": "FeatureCollection",\n'
        f'  "name": {json.dumps(nombre, ensure_ascii=False)},\n'
        f'  "crs": {json.dumps(CRS84)},\n'
        f'  "features": [\n'
        f"{lineas_features}\n"
        f"  ]\n"
        f"}};\n"
    )
    ruta.write_text(contenido, encoding="utf-8")


def main():
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("entrada", type=Path, help=".geojson o .geojsonl")
    p.add_argument("--salida", type=Path, help="módulo .js (por defecto, junto a la entrada)")
    p.add_argument("--variable", help="nombre de la constante exportada")
    args = p.parse_args()

    if args.entrada.suffix not in (".geojson", ".geojsonl"):
        sys.exit(f"{args.entrada}: se esperaba extensión .geojson o .geojsonl.")
    salida = args.salida or args.entrada.with_suffix(".js")
    variable = args.variable or a_camel_case(args.entrada.stem) + "Geojson"
    if not variable.isidentifier():
        sys.exit(f"{variable!r} no es un nombre válido de variable.")

    nombre, features = leer_features(args.entrada)
    controlar_lon_lat(features, args.entrada)
    escribir_js(salida, variable, nombre, features)

    tipos = sorted({f["geometry"]["type"] for f in features if f["geometry"]})
    print(
        f"{salida}: {variable}, {len(features)} features ({', '.join(tipos)}), "
        f"{salida.stat().st_size / 1e6:.1f} MB"
    )


if __name__ == "__main__":
    main()
