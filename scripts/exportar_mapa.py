"""Exporta a PNG el mapa de la cuenca del Río Reconquista tal como está en un commit.

Pasos:
1. Extrae el árbol del commit con `git archive` a un directorio temporal
   (solo archivos versionados; los cambios sin commitear no entran).
2. Lo sirve por HTTP en un puerto libre de localhost.
3. Abre el mapa con Chromium headless con un viewport fijo y lo captura.
4. Escribe en el PNG la resolución (chunk pHYs) para que se imprima a DPI.

El tamaño en píxeles es VIEWPORT × ESCALA. El viewport (px CSS) define qué
área se ve, porque el mapa se centra en la cuenca con zoom fijo; la escala
multiplica la densidad de píxeles sin cambiar el encuadre (texto y vectores
nítidos, teselas del mapa base ampliadas).

Lo que no depende del commit: las teselas de Argenmap (IGN) y Leaflet se
descargan en el momento. Leaflet está fijado en 1.9.4; las teselas pueden
cambiar si el IGN actualiza el mapa base.

Uso, desde cualquier directorio:
    python3 scripts/exportar_mapa.py [--commit REF] [--salida ARCHIVO]
"""
import argparse
import shutil
import struct
import subprocess
import sys
import tempfile
import threading
import zlib
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
RUTA_MAPA = "pue/mapas/cuenca_reconquista/"
DIR_CAPTURAS = RAIZ / "capturas"

# Elegido a ojo, junto con DESPLAZAMIENTO_CENTRO de map.js, para que la cuenca
# (zoom 10) quede balanceada frente al minimapa.
# A 300 dpi: 1840 × 1248 px = 156 × 106 mm.
VIEWPORT = (920, 624)
ESCALA = 2
DPI = 300
# Tiempo virtual máximo para que carguen teselas y módulos (ms).
ESPERA_MS = 15000


def git(*args):
    return subprocess.run(
        ["git", "-C", str(RAIZ), *args],
        check=True, capture_output=True, text=True,
    ).stdout.strip()


def extraer_commit(ref, destino):
    """Vuelca el árbol de `ref` en `destino` con git archive | tar."""
    archivo = subprocess.run(
        ["git", "-C", str(RAIZ), "archive", "--format=tar", ref],
        check=True, capture_output=True,
    ).stdout
    subprocess.run(["tar", "-x", "-C", str(destino)], input=archivo, check=True)


class Silencioso(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def servir(directorio):
    """Arranca un servidor HTTP en un puerto libre; devuelve (servidor, puerto)."""
    handler = partial(Silencioso, directory=str(directorio))
    servidor = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=servidor.serve_forever, daemon=True).start()
    return servidor, servidor.server_address[1]


def capturar(url, salida, viewport, escala, espera_ms):
    navegador = shutil.which("chromium") or shutil.which("google-chrome")
    if navegador is None:
        sys.exit("No se encontró chromium ni google-chrome en el PATH.")
    with tempfile.TemporaryDirectory() as perfil:
        subprocess.run(
            [
                navegador,
                "--headless=new",
                "--disable-gpu",
                "--hide-scrollbars",
                f"--user-data-dir={perfil}",
                f"--window-size={viewport[0]},{viewport[1]}",
                f"--force-device-scale-factor={escala}",
                f"--virtual-time-budget={espera_ms}",
                f"--screenshot={salida}",
                url,
            ],
            check=True, capture_output=True,
        )


def fijar_dpi(ruta, dpi):
    """Reemplaza o inserta el chunk pHYs del PNG (píxeles por metro)."""
    datos = Path(ruta).read_bytes()
    firma, resto = datos[:8], datos[8:]
    chunks = []
    while resto:
        largo = struct.unpack(">I", resto[:4])[0]
        tipo = resto[4:8]
        chunks.append((tipo, resto[: 12 + largo]))
        resto = resto[12 + largo:]
    ppm = round(dpi / 0.0254)
    cuerpo = struct.pack(">IIB", ppm, ppm, 1)  # unidad 1 = metro
    phys = (
        struct.pack(">I", len(cuerpo)) + b"pHYs" + cuerpo
        + struct.pack(">I", zlib.crc32(b"pHYs" + cuerpo))
    )
    chunks = [c for c in chunks if c[0] != b"pHYs"]
    # pHYs va antes del primer IDAT; lo ponemos justo después de IHDR.
    chunks.insert(1, (b"pHYs", phys))
    Path(ruta).write_bytes(firma + b"".join(c for _, c in chunks))


def main():
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--commit", default="HEAD", help="commit, rama o tag (por defecto HEAD)")
    p.add_argument("--salida", type=Path, help="PNG de salida (por defecto capturas/cuenca_reconquista_<sha>.png)")
    args = p.parse_args()

    sha = git("rev-parse", "--short", f"{args.commit}^{{commit}}")
    if args.commit == "HEAD" and git("status", "--porcelain", "--", RUTA_MAPA):
        print(f"Aviso: hay cambios sin commitear en {RUTA_MAPA}; no entran en la captura.")
    salida = (args.salida or DIR_CAPTURAS / f"cuenca_reconquista_{sha}.png").resolve()
    salida.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        extraer_commit(sha, tmp)
        servidor, puerto = servir(tmp)
        try:
            capturar(f"http://127.0.0.1:{puerto}/{RUTA_MAPA}", salida, VIEWPORT, ESCALA, ESPERA_MS)
        finally:
            servidor.shutdown()

    fijar_dpi(salida, DPI)
    ancho, alto = VIEWPORT[0] * ESCALA, VIEWPORT[1] * ESCALA
    print(
        f"{salida.relative_to(RAIZ) if salida.is_relative_to(RAIZ) else salida}: "
        f"commit {sha}, {ancho} × {alto} px, {DPI} dpi = "
        f"{ancho / DPI * 25.4:.0f} × {alto / DPI * 25.4:.0f} mm"
    )


if __name__ == "__main__":
    main()
