// Simbología de las capas del mapa y del panel de referencias.
//
// Cada capa tiene:
//   tipo:    'poligono' o 'linea' (cómo se dibuja la muestra en la leyenda).
//   campo:   propiedad del GeoJSON que define la clase (sin campo, una sola clase).
//   mapa:    estilo común a todas las clases, con opciones de Leaflet
//            (color, weight, opacity, fillColor, fillOpacity).
//   leyenda: lo que cambia en la muestra de la leyenda respecto del mapa.
//            En la leyenda, opacity es la opacidad de toda la muestra.
//   clases:  en el orden de la leyenda; valor (del campo), etiqueta y estilo propio.
//
// Estilo en el mapa:     { ...mapa, ...clase.estilo }
// Estilo en la leyenda:  { ...mapa, ...clase.estilo, ...leyenda }

export const SIMBOLOGIA = {
  sectores: {
    tipo: 'poligono',
    campo: 'Tramo',
    mapa: { color: '#607d8b', weight: 1, opacity: 1, fillOpacity: 0.6 },
    leyenda: { opacity: 0.7 },
    clases: [
      { valor: 'Cuenca Alta',  etiqueta: 'Cuenca Alta',  estilo: { fillColor: '#b3e5fc' } },
      { valor: 'Cuenca Media', etiqueta: 'Cuenca Media', estilo: { fillColor: '#b2dfdb' } },
      { valor: 'Cuenca Baja',  etiqueta: 'Cuenca Baja',  estilo: { fillColor: '#d1c4e9' } },
    ],
  },
  redHidrica: {
    tipo: 'linea',
    mapa: { color: '#005ce6', weight: 0.5, opacity: 0.9 },
    leyenda: { opacity: 1 },
    clases: [
      { etiqueta: 'Cursos de agua' },
    ],
  },
};

function buscarClase(capa, feature) {
  if (!capa.campo) return capa.clases[0];
  return capa.clases.find(clase => clase.valor === feature.properties[capa.campo]);
}

// Estilo de una feature en el mapa (función style de L.geoJson).
export function estiloMapa(nombreCapa, feature) {
  const capa = SIMBOLOGIA[nombreCapa];
  return { ...capa.mapa, ...buscarClase(capa, feature)?.estilo };
}

// Entradas del panel de referencias, en orden de capas y de clases.
export function entradasLeyenda() {
  return Object.values(SIMBOLOGIA).flatMap(capa =>
    capa.clases.map(clase => ({
      tipo: capa.tipo,
      etiqueta: clase.etiqueta,
      // Los estilos de la leyenda sobreescriben a los del mapa.
      estilo: { ...capa.mapa, ...clase.estilo, ...capa.leyenda },
    }))
  );
}
