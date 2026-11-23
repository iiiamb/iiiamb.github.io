import * as L from 'leaflet';
import { redHidricaGeojson } from 'geojs/red_hidrica.js';

// Etiquetas con el nombre de algunos cursos de agua.
//
// Cada etiqueta se ubica sobre una feature de la red hídrica:
//   fid:      fid de la feature (el texto es su propiedad Name, salvo que se indique texto).
//   posicion: fracción del largo de la línea donde va el centro de la etiqueta (0 a 1,
//             en el sentido en que está digitalizada).
//   lado:     'arriba' o 'abajo' de la línea (opcional, por defecto 'arriba').
//   texto:    texto de la etiqueta (opcional, por defecto Name).
// Si la feature tiene varias partes, se usa la más larga.
//
// La etiqueta tiene una sola inclinación: la de la cuerda entre los puntos de la línea
// que quedan a media etiqueta antes y después del centro. Se recalcula con cada zoom
// porque el largo de la etiqueta, medido sobre la línea, cambia con la escala.
const ETIQUETAS_CURSOS = [
  { fid: 102, posicion: 0.50 },              // Arroyo Arias
  { fid: 53,  posicion: 0.65 },              // Arroyo La Choza
  { fid: 54,  posicion: 0.40 },              // Arroyo El Durazno
  { fid: 55,  posicion: 0.50 },              // Río de la Reconquista
];

// Por debajo de este zoom las etiquetas no se muestran.
const ZOOM_MINIMO_ETIQUETAS = 10;

// Separación en píxeles entre la línea y el borde de la etiqueta.
const SEPARACION = 3;


// Parte más larga de la feature, como lista de [lat, lng].
function lineaDeFeature(feature) {
  const partes = feature.geometry.type === 'MultiLineString'
    ? feature.geometry.coordinates
    : [feature.geometry.coordinates];
  const largo = parte => parte.reduce(
    (total, c, i) => i === 0 ? 0 : total + Math.hypot(c[0] - parte[i - 1][0], c[1] - parte[i - 1][1]),
    0
  );
  const masLarga = partes.reduce((a, b) => largo(b) > largo(a) ? b : a);
  return masLarga.map(c => L.latLng(c[1], c[0]));
}

// Punto de la polilínea (en píxeles) a una distancia d del inicio, medida sobre la línea.
function puntoADistancia(puntos, acumulado, d) {
  const total = acumulado[acumulado.length - 1];
  d = Math.min(Math.max(d, 0), total);
  let i = 1;
  while (i < acumulado.length - 1 && acumulado[i] < d) i++;
  const tramo = acumulado[i] - acumulado[i - 1];
  const t = tramo > 0 ? (d - acumulado[i - 1]) / tramo : 0;
  return puntos[i - 1].add(puntos[i].subtract(puntos[i - 1]).multiplyBy(t));
}

// Centro (latLng) y ángulo (grados, sentido horario, entre -90 y 90) de la etiqueta
// para el zoom actual del mapa.
function ubicarEtiqueta(map, linea, posicion, anchoEtiqueta) {
  const zoom = map.getZoom();
  const puntos = linea.map(ll => map.project(ll, zoom));
  const acumulado = [0];
  for (let i = 1; i < puntos.length; i++) {
    acumulado.push(acumulado[i - 1] + puntos[i].distanceTo(puntos[i - 1]));
  }
  const dCentro = posicion * acumulado[acumulado.length - 1];
  const centro = puntoADistancia(puntos, acumulado, dCentro);
  const antes = puntoADistancia(puntos, acumulado, dCentro - anchoEtiqueta / 2);
  const despues = puntoADistancia(puntos, acumulado, dCentro + anchoEtiqueta / 2);

  let angulo = Math.atan2(despues.y - antes.y, despues.x - antes.x) * 180 / Math.PI;
  // Que el texto no quede cabeza abajo.
  if (angulo > 90) angulo -= 180;
  if (angulo <= -90) angulo += 180;

  return { centro: map.unproject(centro, zoom), angulo };
}

export function crearEtiquetasCursos(map) {
  const capa = L.layerGroup();

  const etiquetas = ETIQUETAS_CURSOS.map(({ fid, posicion, lado = 'arriba', texto }) => {
    const feature = redHidricaGeojson.features.find(f => f.properties.fid === fid);
    const span = L.DomUtil.create('span', 'etiqueta_curso_texto');
    span.textContent = texto ?? feature.properties.Name;
    const marcador = L.marker(
      [0, 0],
      {
        icon: L.divIcon({ className: 'etiqueta_curso', html: span, iconSize: [0, 0], iconAnchor: [0, 0] }),
        interactive: false,
        keyboard: false,
      }
    );
    marcador.addTo(capa);
    return { marcador, span, linea: lineaDeFeature(feature), posicion, lado };
  });

  function actualizar() {
    etiquetas.forEach(({ marcador, span, linea, posicion, lado }) => {
      const { centro, angulo } = ubicarEtiqueta(map, linea, posicion, span.offsetWidth);
      marcador.setLatLng(centro);
      // Con origen en el punto de la línea: centrar el texto a lo largo, separarlo
      // hacia arriba o hacia abajo, y girarlo.
      const desplazamiento = lado === 'abajo' ? `${SEPARACION}px` : `calc(-100% - ${SEPARACION}px)`;
      span.style.transform = `rotate(${angulo}deg) translate(-50%, ${desplazamiento})`;
    });
  }

  // Se puede ocultar desde las referencias, junto con los cursos de agua.
  let visible = true;

  function mostrarSegunZoom() {
    if (!visible || map.getZoom() < ZOOM_MINIMO_ETIQUETAS) {
      capa.remove();
    } else {
      // Primero se agrega, para que el texto esté en el DOM y se pueda medir su ancho.
      capa.addTo(map);
      actualizar();
    }
  }

  map.on('zoomend', mostrarSegunZoom);
  mostrarSegunZoom();

  function mostrar(nuevoVisible) {
    visible = nuevoVisible;
    mostrarSegunZoom();
  }

  return { mostrar };
}
