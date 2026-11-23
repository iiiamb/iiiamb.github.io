import * as L from 'leaflet';
import { sectoresGeojson } from "geojs/sectores.js";
import { redHidricaGeojson } from "geojs/red_hidrica.js";
import { embalseRoggeroGeojson } from "geojs/embalse_roggero.js";
import { unidadesHumedalGeojson } from "geojs/unidades_humedal.js";
import { SIMBOLOGIA, estiloMapa, etiquetaClase } from "modulos/simbologia.js";

// Orden de dibujo, de abajo hacia arriba. Cada capa va en su propio panel de
// Leaflet, así el orden se mantiene aunque se oculte y se vuelva a mostrar una
// capa desde las referencias (sin paneles, la que se vuelve a agregar queda arriba).
const PANELES = ['sectores', 'unidadesHumedal', 'embalseRoggero', 'redHidrica'];

export function crearPaneles(map) {
  // 400 es el panel de capas vectoriales por defecto; 600, el de marcadores (etiquetas).
  PANELES.forEach((nombre, i) => {
    map.createPane(nombre).style.zIndex = 401 + i;
  });
}

// Una capa L.geoJson por cada clase de la simbología, agrupadas en `capa`.
// mostrarClase(valor, visible) agrega o quita del mapa la capa de una clase.
function capaPorClases(geojson, nombreCapa, opciones) {
  const { campo, clases } = SIMBOLOGIA[nombreCapa];

  const valores = new Set(clases.map(clase => clase.valor));
  const sinClase = geojson.features.filter(f => !valores.has(f.properties[campo]));
  if (sinClase.length > 0) {
    console.error(
      `${nombreCapa}: ${sinClase.length} features con ${campo} fuera de las clases de simbologia.js; no se dibujan.`,
      [...new Set(sinClase.map(f => f.properties[campo]))]
    );
  }

  // Orden de dibujo entre clases: el de aparición en los datos (como en QGIS,
  // que dibuja en el orden de las features), no el de la leyenda. Las clases
  // sin features van al final.
  const valoresEnDatos = [...new Set(geojson.features.map(f => f.properties[campo]))];
  const ordenDibujo = [
    ...valoresEnDatos.filter(valor => valores.has(valor)),
    ...[...valores].filter(valor => !valoresEnDatos.includes(valor)),
  ];

  // Las subcapas se crean en el orden de dibujo: el featureGroup las agrega al
  // mapa en el orden en que se crearon, no en el del arreglo que recibe.
  const capasPorValor = new Map(ordenDibujo.map(valor => [
    valor,
    L.geoJson(geojson, {
      ...opciones,
      pane: nombreCapa,
      filter: feature => feature.properties[campo] === valor,
      style: feature => estiloMapa(nombreCapa, feature),
    }),
  ]));
  const capa = L.featureGroup([...capasPorValor.values()]);

  function mostrarClase(valor, visible) {
    const capaClase = capasPorValor.get(valor);
    if (visible) {
      // Se agrega arriba de todo: las clases que van encima se vuelven a subir.
      capa.addLayer(capaClase);
      ordenDibujo.slice(ordenDibujo.indexOf(valor) + 1)
        .map(v => capasPorValor.get(v))
        .filter(capaEncima => capa.hasLayer(capaEncima))
        .forEach(capaEncima => capaEncima.bringToFront());
    } else {
      capa.removeLayer(capaClase);
    }
  }

  return { capa, mostrarClase };
}

export function crearSectores () {
  const sectores = {
    "nombre": "sectores"
  }

  // Capa, con una subcapa por tramo para ocultarlos por separado.
  const { capa, mostrarClase } = capaPorClases(
    sectoresGeojson,
    'sectores',
    {
      // Sin eventos: el click pasa a las unidades de humedal que estén debajo.
      interactive: false
    }
  );
  sectores.capa = capa;
  sectores.mostrarClase = mostrarClase;

  return sectores;
};


export function crearRedHidrica () {

  const redHidrica = {
    "nombre": "red_hidrica"
  }

  // Capa
  redHidrica.capa = L.geoJson(
    redHidricaGeojson,
    {
      style: feature => estiloMapa('redHidrica', feature),
      pane: 'redHidrica',
      // Sin eventos: el click pasa a las unidades de humedal que estén debajo.
      interactive: false
    }
  );

  return redHidrica;
};


export function crearEmbalseRoggero () {

  const embalseRoggero = {
    "nombre": "embalse_roggero"
  }

  // Capa
  embalseRoggero.capa = L.geoJson(
    embalseRoggeroGeojson,
    {
      style: feature => estiloMapa('embalseRoggero', feature),
      pane: 'embalseRoggero',
      // Sin eventos: el click pasa a las unidades de humedal que estén debajo.
      interactive: false
    }
  );

  return embalseRoggero;
};


export function crearUnidadesHumedal () {

  const unidadesHumedal = {
    "nombre": "unidades_humedal"
  }

  // Capa, con una subcapa por clase de humedal para ocultarlas por separado.
  const { capa, mostrarClase } = capaPorClases(unidadesHumedalGeojson, 'unidadesHumedal', {});
  unidadesHumedal.capa = capa;
  unidadesHumedal.mostrarClase = mostrarClase;

  // Popup en el punto del click, con la unidad más alta bajo el puntero.
  // bindPopup detiene la propagación del click hacia el mapa.
  unidadesHumedal.capa.bindPopup(capa => popupUnidadHumedal(capa.feature));

  return unidadesHumedal;
};


const URL_DATOS_UNIDADES_HUMEDAL = 'https://ri.conicet.gov.ar/items/eddf35a8-5018-4943-92a2-b197dba0eebd';
const URL_INFORME_UNIDADES_HUMEDAL = 'https://zenodo.org/records/23666516';

function popupUnidadHumedal(feature) {
  const div = L.DomUtil.create('div', 'popup_humedal');
  div.innerHTML = `
    <strong><span></span></strong><br>
    <a href="${URL_DATOS_UNIDADES_HUMEDAL}" target="_blank" rel="noopener">Datos</a> -
    <a href="${URL_INFORME_UNIDADES_HUMEDAL}" target="_blank" rel="noopener">Informe</a>`;
  // textContent: el nombre viene de los datos, no se interpreta como HTML.
  div.querySelector('span').textContent = etiquetaClase('unidadesHumedal', feature);
  return div;
}
