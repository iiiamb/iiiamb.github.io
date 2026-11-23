import * as L from 'leaflet';
import { sectoresGeojson } from "geojs/sectores.js";
import { redHidricaGeojson } from "geojs/red_hidrica.js";
import { embalseRoggeroGeojson } from "geojs/embalse_roggero.js";
import { unidadesHumedalGeojson } from "geojs/unidades_humedal.js";
import { estiloMapa } from "modulos/simbologia.js";

export function crearSectores () {
  const sectores = {
    "nombre": "sectores"
  }

  // Capa
  sectores.capa = L.geoJson(
    sectoresGeojson,
    {
      style: feature => estiloMapa('sectores', feature)
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
      style: feature => estiloMapa('redHidrica', feature)
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
      style: feature => estiloMapa('embalseRoggero', feature)
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

  return unidadesHumedal;
};
