window.onload = init

function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: ol.proj.transform([-120.740135, 47.751076], 'EPSG:4326', 'EPSG:3857'),
            zoom: 7
            //maxZoom: 6,
            //minZoom: 2,
            //rotation: 0.5
            //https://stackoverflow.com/questions/27820784/openlayers-3-center-map
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'js-map',
        keyboardEventTarget: document
    });

    const popupContainerElement = document.getElementById('popup-coordinates');
    const popup = new ol.Overlay({
        element: popupContainerElement,
        positioning: 'center-left'
    });

    map.addOverlay(popup);

    map.on('click', function(e) {
        const clickedCoordinate = e.coordinate;
        popup.setPosition(undefined);
        popup.setPosition(clickedCoordinate);
        popupContainerElement.innerHTML = clickedCoordinate;
    });

    const dragRotateInteraction = new ol.interaction.DragRotate({
        condition: ol.events.condition.altKeyOnly
    });

    map.addInteraction(dragRotateInteraction);

    const drawInteraction = new ol.interaction.Draw({
        type: 'Polygon',
        freehand: true
    });

    map.addInteraction(drawInteraction);

    drawInteraction.on('drawend', function(e) {
        let parser = new ol.format.GeoJSON();
        let drawnFeatures = parser.writeFeaturesObject([e.feature]);
        console.log(drawnFeatures.features[0].geometry.coordinates);
    });
}

getLocation();

async function getLocation() {
    const response = await fetch('./locations/CV_SacPAS_Proj_LatLon.csv');
    const data = await response.text();
    //console.log(data);

    const locations = data.split('\n').slice(1);
    locations.forEach(location => {
        const col = location.split(',');
        const proj = col[0];
        const name = col[1];
        const basin = col[2]; 
        const lat = col[3];
        const lon = col[4];
        console.log(proj, name, basin, lat, lon);
    });
}
//https://youtu.be/RfMkdvN-23o