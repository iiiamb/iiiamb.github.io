// Simbología de las capas del mapa y del panel de referencias.
//
// Cada capa tiene:
//   tipo:    'poligono' o 'linea' (cómo se dibuja la muestra en la leyenda).
//   enLeyenda: true si la capa aparece en el panel de referencias.
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
    enLeyenda: true,
    campo: 'Tramo',
    mapa: { color: '#607d8b', weight: 1, opacity: 1, fillOpacity: 0.6 },
    leyenda: { opacity: 0.7 },
    clases: [
      { valor: 'Cuenca Alta',  etiqueta: 'Cuenca Alta',  estilo: { fillColor: '#b3e5fc' } },
      { valor: 'Cuenca Media', etiqueta: 'Cuenca Media', estilo: { fillColor: '#b2dfdb' } },
      { valor: 'Cuenca Baja',  etiqueta: 'Cuenca Baja',  estilo: { fillColor: '#d1c4e9' } },
    ],
  },
  // Estilo de unidades_humedal.qml (QGIS): borde de 0.26 mm ≈ 1 px, relleno opaco.
  unidadesHumedal: {
    tipo: 'poligono',
    enLeyenda: false,
    campo: 'UH_nombre',
    mapa: { weight: 1, opacity: 1, fillOpacity: 1 },
    leyenda: { },
    clases: [
      { valor: 'Banado',                              etiqueta: 'Bañado',                              estilo: { color: '#fff299', fillColor: '#fff299' } },
      { valor: 'Canada',                              etiqueta: 'Cañada',                              estilo: { color: '#a0e188', fillColor: '#a0e188' } },
      { valor: 'Canal activo',                        etiqueta: 'Canal activo',                        estilo: { color: '#232323', fillColor: '#000000' } },
      { valor: 'Cubeta',                              etiqueta: 'Cubeta',                              estilo: { color: '#010adc', fillColor: '#010adc' } },
      { valor: 'Humedal artifical y aguas profundas', etiqueta: 'Humedal artifical y aguas profundas', estilo: { color: '#49b1ff', fillColor: '#49b1ff' } },
      { valor: 'Planicie de inundacion',              etiqueta: 'Planicie de inundación',              estilo: { color: '#b690fd', fillColor: '#c889fa' } },
    ],
  },
  embalseRoggero: {
    tipo: 'poligono',
    enLeyenda: false,
    mapa: { color: '#005ce6', weight: 0.5, opacity: 0.9, fillColor: '#005ce6', fillOpacity: 0.2 },
    leyenda: { },
    clases: [
      { etiqueta: 'Embalse Dique Roggero' },
    ],
  },
  redHidrica: {
    tipo: 'linea',
    enLeyenda: true,
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
// Solo las capas con enLeyenda: true.
export function entradasLeyenda() {
  return Object.values(SIMBOLOGIA)
    .filter(capa => capa.enLeyenda)
    .flatMap(capa =>
      capa.clases.map(clase => ({
        tipo: capa.tipo,
        etiqueta: clase.etiqueta,
        // Los estilos de la leyenda sobreescriben a los del mapa.
        estilo: { ...capa.mapa, ...clase.estilo, ...capa.leyenda },
      }))
    );
}
