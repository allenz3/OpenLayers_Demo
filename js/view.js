import controls from './controls.js';

const map = new ol.Map({
    view: new ol.View({
        // center: [-13392860.93604214, 6011494.743803331],
        // center: ol.proj.transform([-120.740135, 47.751076], 'EPSG:4326', 'EPSG:3857'),
        center: ol.proj.transform([-120.740135, 38.751076], 'EPSG:4326', 'EPSG:3857'),
        zoom: 7,
        maxZoom: 16,
        minZoom: 6
        // extent: [-14500000,3500000,-12000000,5500000]
        // rotation: 0.5
        // https://stackoverflow.com/quiestions/27820784/openlayers-3-center-map
    }),
    target: 'js-map',
    keyboardEventTarget: document,
    controls: controls
});

export default map;