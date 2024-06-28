export function minimap (e, z, bounds) {
  const argenmap = new L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png',
    {
      minZoom: 1,
      maxZoom: 20
    }
  );

  const map = new L.map('map',
    {
      attributionControl: false,
      center: new L.LatLng(-34.5790, -58.6608),
      zoom: Z - 1,
      zoomControl: false,
      layers: [argenmap]
    }
  );
}
