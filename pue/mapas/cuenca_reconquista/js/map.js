import * as L from 'leaflet';
import { minimap } from "minimap";
import { cuenca_geojson } from "cuenca_reconq-secr_ener";

function init () {

  // Capa argenmap
  const argenmap = new L.tileLayer(
    'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png',
    {
      minZoom: 5, // Las capas que van al mapa principal tienen zoom minimo
      maxZoom: 20
    }
  );

  // Mapa principal
  const map = new L.map(
    'map',
    {
      attributionControl: false,
      center: new L.LatLng(-34.5790, -58.6608),
      zoom: 11,
      zoomControl: true,
      layers: [argenmap]
    }
  );

  // Scalebar
  const scalebar = L.control.scale(
    {
      position: 'bottomleft',
      imperial: false
    }
  );
  scalebar.addTo(map);


  //=====
  // Créditos
  //=====

  // Crear el control
  const attr_ctrl = new L.control.attribution(
    {
      prefix: null,
      position: 'bottomright',
    }
  );

  // Agregarlo al mapa
  attr_ctrl.addTo(map);

  // Construir hiperlink anchors
  const iiia_attr = '<a href="https://iiia.conicet.gov.ar/" title="IIIA | Instituto de Investigación e Ingeniería Ambiental" target="_blank">IIIA</a>';
  const osm_attr = '<a href="https://www.openstreetmap.org" title="OpenStreetMap" target="_blank">OpenStreetMap</a>';
  const argenmap_attr = '<a href="https://www.ign.gob.ar/AreaServicios/Argenmap/Introduccion" title="Introducción | Instituto Geográfico Nacional" target="_blank">Argenmap</a>';
  const leaflet_attr = '<a href="https://leafletjs.com/" title="Leaflet - a JavaScript library for interactive maps" target="_blank">Leaflet</a>';
  // Construir el contenido html
  const attr_contents = [iiia_attr, argenmap_attr, leaflet_attr, osm_attr].join(' + ');
  // Asignar contenido al elemento del control
  attr_ctrl.getContainer().innerHTML = attr_contents;


  //=====
  // Control minimapa
  //=====

  const mm_ctrl = L.control({position: 'bottomright'});

  // onAdd(): Crear y devolver el elemento DOM del panel
  mm_ctrl.onAdd = function (map) {
    // crear un elemento div de clase panel_minimapa
    const panel = L.DomUtil.create('div', 'mm_panel');
    // deshabilitar propagación de eventos para este elemento
    L.DomEvent.disableScrollPropagation(panel);
    L.DomEvent.disableClickPropagation(panel);
    // crear el contenedor para el minimapa
    const container = L.DomUtil.create('div', 'mm_container', panel);
    container.id = "minimap";

    return panel;
  };
  // Agregar al mapa principal
  mm_ctrl.addTo(map);

  // Crear el minimap dentro del elemento div con id minimap del control
  const mm = minimap('minimap', map.getZoom() - 5);

  // Crear la capa recuadro dentro del minimapa
  const recuadro = L.rectangle(
    map.getBounds(),
    {
      color: "#ff7800",
      weight: 1,
      interactive:false
    }
  );
  recuadro.addTo(mm);

  //  Dragend (actualizar el minimapa en base a los nuevos bounds del mapa)
  map.on('zoomend moveend', function (event) {
    mm.setView(map.getBounds().getCenter(), map.getZoom() - 5 );
    recuadro.setBounds(map.getBounds());
  });

  L.geoJson(cuenca_geojson).addTo(map);
};

init();

