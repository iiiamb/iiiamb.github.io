import * as L from 'leaflet';

export function crear_referencias(mapa) {
  const panel_referencias = L.control({ position: 'topright' });

  panel_referencias.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');

    div.style.backgroundColor = 'white';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';
    div.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';
    div.style.fontFamily = 'Arial, sans-serif';
    div.style.fontSize = '11px';
    div.style.lineHeight = '15px';
    div.style.color = '#333';

    const referencias = [
      { tipo: 'poligono', color: '#b3e5fc', borde: '#607d8b', texto: 'Cuenca Alta' },
      { tipo: 'poligono', color: '#b2dfdb', borde: '#607d8b', texto: 'Cuenca Media' },
      { tipo: 'poligono', color: '#d1c4e9', borde: '#607d8b', texto: 'Cuenca Baja' },
      { tipo: 'linea', color: '#005ce6', texto: 'Cursos de agua' }
    ];

    div.innerHTML = '<h4 style="margin: 0 0 8px; font-size: 12px; font-weight: bold;">Referencias</h4>';

    referencias.forEach(item => {
      if (item.tipo === 'poligono') {
        div.innerHTML += `
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <i style="width: 18px; height: 13px; float: left; margin-right: 8px; opacity: 0.7; background: ${item.color}; border: 1px solid ${item.borde};"></i>
            <span>${item.texto}</span>
          </div>`;
      } else if (item.tipo === 'linea') {
        div.innerHTML += `
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <svg width="18" height="12" style="margin-right: 8px; float: left;">
              <polyline points="0,8 6,4 12,6 18,2" style="fill:none; stroke:${item.color}; stroke-width:0.5" />
            </svg>
            <span>${item.texto}</span>
          </div>`;
      }
    });

    return div;
  };

  return panel_referencias;
}
