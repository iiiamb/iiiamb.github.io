import * as L from 'leaflet';
import { cuenca_geojson } from "geojs/cuenca_reconq-secr_ener.js";

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



