import * as L from 'leaflet';

export function minimap (id, z) {
  const argenmap = new L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png',
    {
      minZoom: 1,
      maxZoom: 20
    }
  );

  const map = new L.map(id,
    {
      attributionControl: false,
      center: new L.LatLng(-34.5790, -58.6608),
      zoom: z,
      zoomControl: false,
      layers: [argenmap]
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
