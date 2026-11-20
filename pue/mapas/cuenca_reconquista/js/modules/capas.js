import * as L from 'leaflet';
import { sectores_geojson } from "geojs/sectores.js";
import { redhidrica_geojson } from "geojs/red_hidrica.js";

export function crear_sectores () {
  const sectores = {
    "nombre": "sectores"
  }

sectores.getColor = function (Tramo) {
  return Tramo == 'Cuenca Alta'  ? ['#b3e5fc', '#607d8b'] :
         Tramo == 'Cuenca Media' ? ['#b2dfdb', '#607d8b'] :
         Tramo == 'Cuenca Baja'  ? ['#d1c4e9', '#607d8b'] :
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
    sectores_geojson,
    {
      style: sectores.estilo
    }
  );

  return sectores;
};


export function crear_redhidrica () {

  const redhidrica = {
    "nombre": "red_hidrica"
  }

  redhidrica.getColor = function () {
    return ['#005ce6']
  }

  redhidrica.estilo = function (feature) {
    const color = redhidrica.getColor();
    return {
        color: color[0],
        weight: 0.5,
        opacity: 0.9,
    };
  };

  // Capa
  redhidrica.capa = L.geoJson(
    redhidrica_geojson,
    {
      style: redhidrica.estilo
    }
  );

  return redhidrica;
};
