import * as L from 'leaflet';

function init () {
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
            zoom: 11,
            zoomControl: true,
            layers: [argenmap]
        }
    );



    //=====
    // Créditos
    //=====

    // Elemento del panel
    const attr = new L.control.attribution(
        {prefix: ''}
    ).addTo(map
    ).getContainer();
    // Textos
    const attr_iiia = '<a href="https://iiia.conicet.gov.ar/" title="IIIA | Instituto de Investigación e Ingeniería Ambiental" target="_blank">IIIA</a>';
    const attr_osm = '<a href="https://www.openstreetmap.org" title="OpenStreetMap" target="_blank">OpenStreetMap</a>';
    const attr_argenmap = '<a href="https://www.ign.gob.ar/AreaServicios/Argenmap/Introduccion" title="Introducción | Instituto Geográfico Nacional" target="_blank">Argenmap</a>';
    const attr_leaflet = '<a href="https://leafletjs.com/" title="Leaflet - a JavaScript library for interactive maps" target="_blank">Leaflet</a>';
    const attr_text = [attr_iiia, attr_argenmap, attr_leaflet, attr_osm].join(' + ');
    // Definir texto en elemento panel
    attr.innerHTML = attr_text

}

init();

