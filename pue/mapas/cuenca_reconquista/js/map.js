import * as L from 'leaflet';
import { crearSectores, crearEmbalseRoggero, crearRedHidrica } from 'modulos/capas.js';
import { crearReferencias } from 'modulos/referencias.js'
import { crearEtiquetasCursos } from 'modulos/etiquetas.js';
import { minimap } from "modulos/minimap.js";

function init () {

  const URL_ARGENMAP_GRIS = 'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png'
  // Capa argenmap gris
  const argenmapGris = L.tileLayer(
    URL_ARGENMAP_GRIS,
    {
      minZoom: 5, // Las capas que van al mapa principal tienen zoom minimo
      maxZoom: 20
    }
  );

  // Cuenca (sectores)
  const cuenca = crearSectores();
  const centroideBbox = cuenca.capa.getBounds().getCenter();

  // Centro del mapa: el de la cuenca corrido al sureste (px en ZOOM_INICIAL),
  // para que la cuenca quede arriba a la izquierda, lejos del minimapa.
  const ZOOM_INICIAL = 10;
  const DESPLAZAMIENTO_CENTRO = L.point(55, 15);
  const centroMapa = L.CRS.EPSG3857.pointToLatLng(
    L.CRS.EPSG3857.latLngToPoint(centroideBbox, ZOOM_INICIAL).add(DESPLAZAMIENTO_CENTRO),
    ZOOM_INICIAL
  );

  // Mapa principal
  const map = L.map(
    'map',
    {
      attributionControl: false,
      center: centroMapa,
      zoom: ZOOM_INICIAL,
      zoomControl: true,
      layers: [argenmapGris]
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
  const attrCtrl = L.control.attribution(
    {
      prefix: null,
      position: 'bottomright',
    }
  );

  // Agregarlo al mapa
  attrCtrl.addTo(map);

  // Construir hiperlink anchors
  const iiiaAttr = '<a href="https://iiia.conicet.gov.ar/" title="IIIA | Instituto de Investigación e Ingeniería Ambiental" target="_blank">IIIA</a>';
  const osmAttr = '<a href="https://www.openstreetmap.org" title="OpenStreetMap" target="_blank">OpenStreetMap</a>';
  const argenmapAttr = '<a href="https://www.ign.gob.ar/AreaServicios/Argenmap/Introduccion" title="Introducción | Instituto Geográfico Nacional" target="_blank">Argenmap</a>';
  const leafletAttr = '<a href="https://leafletjs.com/" title="Leaflet - a JavaScript library for interactive maps" target="_blank">Leaflet</a>';
  // Construir el contenido html
  const attrContents = [iiiaAttr, argenmapAttr, leafletAttr, osmAttr].join(' + ');
  // Asignar contenido al elemento del control
  attrCtrl.getContainer().innerHTML = attrContents;


  //=====
  // Control minimapa
  //=====

  const mmCtrl = L.control({position: 'bottomright'});

  // onAdd(): Crear y devolver el elemento DOM del panel
  mmCtrl.onAdd = function (map) {
    // crear un elemento div de clase mm_panel
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
  mmCtrl.addTo(map);

  // Crear el minimap dentro del elemento div con id minimap del control
  const mm = minimap(
    'minimap',
    centroMapa,
    map.getZoom() - 5
  );

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

  // Agregar capa de sectores al mapa principal
  cuenca.capa.addTo(map);

  // Agregar embalse del Dique Roggero (debajo de la red hídrica).
  const embalseRoggero = crearEmbalseRoggero();
  embalseRoggero.capa.addTo(map);

  // Agregar red hídrica.
  const redHidrica = crearRedHidrica();
  redHidrica.capa.addTo(map);

  // Agregar etiquetas de cursos de agua (se muestran según el zoom).
  crearEtiquetasCursos(map);

  // Agregar referencias.
  const referencias = crearReferencias();
  referencias.addTo(map);
};

init();
