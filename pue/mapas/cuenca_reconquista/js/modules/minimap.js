import * as L from 'leaflet';

export function minimap (id, z) {

  // Capa argenmap gris
  const argenmap_gris = new L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png',
    {
      minZoom: 0,
      maxZoom: 15 // Las capas que van al minimapa tienen zoom maximo
    }
  );

  const map = new L.map(id,
    {
      attributionControl: false,
      center: new L.LatLng(-34.5790, -58.6608),
      zoom: z,
      zoomControl: false,
      layers: [argenmap_gris]
    }
  );
  // Deshabilitar eventos sobre el mapa
  map.boxZoom.disable();
  map.doubleClickZoom.disable();
  map.dragging.disable();
  map.keyboard.disable();
  map.scrollWheelZoom.disable();
  map.tapHold.disable();
  map.touchZoom.disable();

  return map;
}
