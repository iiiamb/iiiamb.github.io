"""Servidor local sin caché para revisar el sitio antes de commitear.

Igual que `python3 -m http.server`, pero cada respuesta lleva
`Cache-Control: no-store`.

Uso, desde cualquier directorio:
    python3 scripts/servidor.py [puerto]
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


class SinCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main():
    puerto = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = partial(SinCache, directory=str(RAIZ))
    with ThreadingHTTPServer(("", puerto), handler) as servidor:
        print(f"Sirviendo {RAIZ} en http://localhost:{puerto}/ (sin caché)")
        try:
            servidor.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
