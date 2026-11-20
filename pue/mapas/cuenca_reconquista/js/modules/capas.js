import * as L from 'leaflet';
import { sectoresGeojson } from "geojs/sectores.js";
import { redHidricaGeojson } from "geojs/red_hidrica.js";
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
