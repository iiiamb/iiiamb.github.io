import * as L from 'leaflet';
import { entradasLeyenda } from 'modulos/simbologia.js';

export function crearReferencias(mapa) {
  const panelReferencias = L.control({ position: 'topright' });

  panelReferencias.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');

    div.style.backgroundColor = 'white';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';
    div.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';
    div.style.fontFamily = 'Arial, sans-serif';
    div.style.fontSize = '11px';
    div.style.lineHeight = '15px';
    div.style.color = '#333';

    div.innerHTML = '<h4 style="margin: 0 0 8px; font-size: 12px; font-weight: bold;">Referencias</h4>';

    entradasLeyenda().forEach(({ tipo, etiqueta, estilo }) => {
      if (tipo === 'poligono') {
        div.innerHTML += `
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <i style="width: 18px; height: 13px; float: left; margin-right: 8px; opacity: ${estilo.opacity}; background: ${estilo.fillColor}; border: ${estilo.weight}px solid ${estilo.color};"></i>
            <span>${etiqueta}</span>
          </div>`;
      } else if (tipo === 'linea') {
        div.innerHTML += `
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <svg width="18" height="12" style="margin-right: 8px; float: left;">
              <polyline points="0,8 6,4 12,6 18,2" style="fill:none; stroke:${estilo.color}; stroke-width:${estilo.weight}; stroke-opacity:${estilo.opacity}" />
            </svg>
            <span>${etiqueta}</span>
          </div>`;
      }
    });

    return div;
  };

  return panelReferencias;
}
