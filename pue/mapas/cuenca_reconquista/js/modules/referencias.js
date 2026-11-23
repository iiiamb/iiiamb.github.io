import * as L from 'leaflet';
import { entradasLeyenda } from 'modulos/simbologia.js';

// mostrar: por cada capa de la leyenda (nombre en SIMBOLOGIA), una función
// (valor, visible) que muestra u oculta la clase con ese valor.
export function crearReferencias(mostrar) {
  const panelReferencias = L.control({ position: 'topright' });

  panelReferencias.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    // Que tildar una casilla no haga click ni zoom en el mapa.
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    div.innerHTML = '<h4>Referencias</h4>';

    entradasLeyenda().forEach(({ tipo, nombreCapa, valor, etiqueta, estilo }) => {
      if (tipo === 'seccion') {
        div.innerHTML += `<h5 class="ref_seccion">${etiqueta}</h5>`;
        return;
      }

      let muestra;
      if (tipo === 'poligono') {
        muestra = `<i class="ref_muestra" style="opacity: ${estilo.opacity}; background: ${estilo.fillColor}; border: ${estilo.weight}px solid ${estilo.color};"></i>`;
      } else if (tipo === 'linea') {
        muestra = `
          <svg class="ref_muestra" width="18" height="12">
            <polyline points="0,8 6,4 12,6 18,2" style="stroke:${estilo.color}; stroke-width:${estilo.weight}; stroke-opacity:${estilo.opacity}" />
          </svg>`;
      }
      // Sin data-valor cuando la capa tiene una sola clase.
      const atributoValor = valor === undefined ? '' : `data-valor="${valor}"`;
      div.innerHTML += `
        <label class="ref_item">
          <input type="checkbox" checked data-capa="${nombreCapa}" ${atributoValor}>
          ${muestra}
          <span>${etiqueta}</span>
        </label>`;
    });

    // Después de armar todo el HTML: cada innerHTML += recrea los elementos y
    // perdería los eventos agregados antes.
    div.querySelectorAll('input[data-capa]').forEach(casilla => {
      const mostrarCapa = mostrar[casilla.dataset.capa];
      if (mostrarCapa === undefined) {
        throw new Error(`crearReferencias: falta la función para mostrar la capa '${casilla.dataset.capa}'.`);
      }
      casilla.addEventListener('change', () => mostrarCapa(casilla.dataset.valor, casilla.checked));
    });

    return div;
  };

  return panelReferencias;
}
