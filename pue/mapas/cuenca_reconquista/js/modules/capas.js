import * as L from 'leaflet';
import { sectoresGeojson } from "geojs/sectores.js";
import { redHidricaGeojson } from "geojs/red_hidrica.js";
import { embalseRoggeroGeojson } from "geojs/embalse_roggero.js";
import { unidadesHumedalGeojson } from "geojs/unidades_humedal.js";
import { estiloMapa, etiquetaClase } from "modulos/simbologia.js";

export function crearSectores () {
  const sectores = {
    "nombre": "sectores"
  }

  // Capa
  sectores.capa = L.geoJson(
    sectoresGeojson,
    {
      style: feature => estiloMapa('sectores', feature),
      // Sin eventos: el click pasa a las unidades de humedal que estén debajo.
      interactive: false
    }
  );

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

  // Capa
  unidadesHumedal.capa = L.geoJson(
    unidadesHumedalGeojson,
    {
      style: feature => estiloMapa('unidadesHumedal', feature)
    }
  );

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
