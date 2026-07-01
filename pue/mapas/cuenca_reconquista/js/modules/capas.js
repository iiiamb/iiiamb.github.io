import * as L from 'leaflet';
import { cuenca_geojson } from "geojs/cuenca_reconq-secr_ener.js";
import { sectores_geojson } from "geojs/sectores.js";
import { redhidrica_geojson } from "geojs/red_hidrica.js";

export function crear_cuenca () {

  const cuenca = {
    "nombre": "cuenca"
  }

  cuenca.getColor = function (id) {
    return id = 1 ? ['#008080', '#808000'] :
           id = 2 ? ['#d4fcff', ''] :
           id = 3 ? ['#ecd4ff', ''] :
                    ['#ffe2d4', '']
  }

  cuenca.estilo = function (feature) {
    const color = cuenca.getColor(feature.properties.id);
    return {
        fillColor: color[0],
        weight: 2,
        opacity: 0.8,
        color: color[1],
        dashArray: '3',
        fillOpacity: 0.5
    };
  };

  // Capa
  cuenca.capa = L.geoJson(
    cuenca_geojson,
    {
      style: cuenca.estilo
    }
  );

  return cuenca;
};


export function crear_sectores () {
  const sectores = {
    "nombre": "sectores"
  }

  sectores.getColor = function (Tramo) {
    return Tramo == 'Cuenca Alta' ? ['#008080', '#808000'] :
           Tramo == 'Cuenca Media' ? ['#800040', '#808000'] :
           Tramo == 'Cuenca Baja' ? ['#804000', '#808000'] :
                    ['#ffe2d4', '']
  }

  sectores.estilo = function (feature) {
    const color = sectores.getColor(feature.properties.Tramo);
    return {
        weight: 1,
        opacity: 0.8,
        color: color[1],
        dashArray: '3',
        fillColor: color[0],
        fillOpacity: 0.5
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
        weight: 1,
        opacity: 1,
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
