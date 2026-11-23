import * as L from 'leaflet';
import { entradasLeyenda } from 'modulos/simbologia.js';

export function crearReferencias() {
  const panelReferencias = L.control({ position: 'topright' });

  panelReferencias.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');

    div.innerHTML = '<h4>Referencias</h4>';

    entradasLeyenda().forEach(({ tipo, etiqueta, estilo }) => {
      if (tipo === 'seccion') {
        div.innerHTML += `<h5 class="ref_seccion">${etiqueta}</h5>`;
      } else if (tipo === 'poligono') {
        div.innerHTML += `
          <div class="ref_item">
            <i class="ref_muestra" style="opacity: ${estilo.opacity}; background: ${estilo.fillColor}; border: ${estilo.weight}px solid ${estilo.color};"></i>
            <span>${etiqueta}</span>
          </div>`;
      } else if (tipo === 'linea') {
        div.innerHTML += `
          <div class="ref_item">
            <svg class="ref_muestra" width="18" height="12">
              <polyline points="0,8 6,4 12,6 18,2" style="stroke:${estilo.color}; stroke-width:${estilo.weight}; stroke-opacity:${estilo.opacity}" />
            </svg>
            <span>${etiqueta}</span>
          </div>`;
      }
    });

    return div;
  };

  return panelReferencias;
}
