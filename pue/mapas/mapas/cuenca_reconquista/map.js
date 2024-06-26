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
            center: new L.LatLng(-58.6608, -34.5790),
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
    // Texto
    let attr_text = '<a href="https://leafletjs.com/" title="Leaflet - a JavaScript library for interactive maps="_blank">Leaflet</a>'
    attr_text += ' + <a href="https://www.ign.gob.ar/AreaServicios/Argenmap/Introduccion" title="Introducción | Instituto Geográfico Nacional" target="_blank">Argenmap</a>'
    // Definir texto en elemento panel
    attr.innerHTML = attr_text

}

init();

