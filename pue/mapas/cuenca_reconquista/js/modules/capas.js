import * as L from 'leaflet';
import { sectoresGeojson } from "geojs/sectores.js";
import { redHidricaGeojson } from "geojs/red_hidrica.js";

export function crearSectores () {
  const sectores = {
    "nombre": "sectores"
  }

sectores.getColor = function (tramo) {
  return tramo == 'Cuenca Alta'  ? ['#b3e5fc', '#607d8b'] :
         tramo == 'Cuenca Media' ? ['#b2dfdb', '#607d8b'] :
         tramo == 'Cuenca Baja'  ? ['#d1c4e9', '#607d8b'] :
                  ['#ffe2d4', '#607d8b'];
}

  sectores.estilo = function (feature) {
    const color = sectores.getColor(feature.properties.Tramo);
    return {
    weight: 1,
    opacity: 1,
    color: color[1],
    fillColor: color[0],
    fillOpacity: 0.6
    };
  };

  // Capa
  sectores.capa = L.geoJson(
    sectoresGeojson,
    {
      style: sectores.estilo
    }
  );

  return sectores;
};


export function crearRedHidrica () {

  const redHidrica = {
    "nombre": "red_hidrica"
  }

  redHidrica.getColor = function () {
    return ['#005ce6']
  }

  redHidrica.estilo = function (feature) {
    const color = redHidrica.getColor();
    return {
        color: color[0],
        weight: 0.5,
        opacity: 0.9,
    };
  };

  // Capa
  redHidrica.capa = L.geoJson(
    redHidricaGeojson,
    {
      style: redHidrica.estilo
    }
  );

  return redHidrica;
};
