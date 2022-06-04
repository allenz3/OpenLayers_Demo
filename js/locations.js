import map from './view.js';
import { bluePoint, whitePoint } from './styles.js';
import { dataTypesAndLocations } from './data_types.js';

const locationsSet = new Set();
const selectedLocationsSet = new Set();

// fill set containing all locations
function initLocations(locationGeoJSON) {
    locationsSet.clear();
    selectedLocationsSet.clear();
    // after the location features 
    locationGeoJSON.getSource().on('featuresloadend', (evt) => {
        const locations = evt.target.getFeatures();
        locations.forEach(location => locationsSet.add(location));
        initFillLocationsList();
    });
}
// https://stackoverflow.com/questions/72496965/is-there-any-way-to-access-the-locations-for-a-vector-layer-in-openlayers/72498213

// fill sidebar with locations
function initFillLocationsList() {
    locationsSet.forEach((location) => {
        const locationString = location.get("name") + " (" + location.get("proj") + ")";
        const newElem = document.createElement("option");
        newElem.innerHTML = locationString;
        newElem.className = "location";
        document.querySelector(".locationsList").appendChild(newElem);
    });
}

// search filter by keyword based on user input
const deselectAll = document.querySelector(".deselect-all").addEventListener("click", () => {
    selectedLocationsSet.clear();
    fillSidebar(locationsSet, selectedLocationsSet);
    fillPoints(locationsSet, selectedLocationsSet);
});

// search filter by keyword based on user input
const search = document.querySelector(".search-filter").addEventListener("input", () => {
    const searchInput = document.querySelector(".search-filter").value;
    const locationsList = document.querySelector(".locationsList");
    locationsList.innerHTML = "";
    locationsSet.forEach((location) => {
        const locationString = location.get("name") + " (" + location.get("proj") + ")";
        if ((locationString.toLowerCase()).includes(searchInput.toLowerCase())) {
            const newElem = document.createElement("option");
            newElem.innerHTML = locationString;
            newElem.className = "location";  
            locationsList.appendChild(newElem);
        }
    });
});

// if location option is clicked
const locationsList = document.querySelector(".locationsList");
const selectedLocationsList = document.querySelector(".selectedLocationsList");
locationsList.addEventListener("click", locationOption => findLocation(locationOption));
selectedLocationsList.addEventListener("click", locationOption => findLocation(locationOption));

// if a location option is selected
function findLocation(locationOption) { // argument: option element from location list
    // prevents event listener from selecting the select element (entire list)
    if (locationOption.target.tagName === "OPTION" || locationOption.target.tagName === "LI") { // can also use e.target.className === "location"
        locationsSet.forEach((location) => {
            const locationString = location.get("name") + " (" + location.get("proj") + ")";
            if (locationString === locationOption.target.innerText) {
                if (!selectedLocationsSet.has(location)) {
                    selectedLocationsSet.add(location);
                } else {
                    selectedLocationsSet.delete(location);
                }
            }
        });
        fillSidebar(locationsSet, selectedLocationsSet);
        fillPoints(locationsSet, selectedLocationsSet);
    }
}

// location name pop-up
const overlayContainerElement = document.querySelector(".overlay-container");
const overlayLayer = new ol.Overlay({
    element: overlayContainerElement
});
map.addOverlay(overlayLayer);
const overlayFeatureName = document.getElementById("feature-name");

// when the pointer hovers over a location point, the location name appears
const pointMove = map.on("pointermove", function(e) {
    overlayLayer.setPosition(undefined);
    map.forEachFeatureAtPixel(e.pixel, function(feature) {
        overlayLayer.setPosition(e.coordinate);
        overlayLayer.setOffset([10, 10]);
        overlayFeatureName.innerHTML = feature.get("name");
    });
});
// https://openlayers.org/en/latest/apidoc/module-ol_MapBrowserEvent-MapBrowserEvent.html
// https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html

// if a point on the map is clicked
const pointClick = map.on("singleclick", point => {
    map.forEachFeatureAtPixel(point.pixel, point => {
        if (point.getGeometry().getType() === 'Point') {
            locationsSet.forEach((location) => {
                if (location.get("proj") === point.get("proj")) {
                    if (!selectedLocationsSet.has(location)) { // select point
                        selectedLocationsSet.add(location);
                    } else { // deselect point
                        selectedLocationsSet.delete(location);
                    }
                }
            });
        }
    });
    fillSidebar(locationsSet, selectedLocationsSet);
    fillPoints(locationsSet, selectedLocationsSet);
});

// if data type option is clicked
const dataTypeSelector = document.querySelector(".data-type");
dataTypeSelector.addEventListener("change", dataTypeSelected => findDataType(dataTypeSelected));
// https://stackoverflow.com/questions/47058077/how-can-i-add-an-event-listener-to-a-select-element

// if data type is selected
function findDataType(dataTypeSelected) { // argument: option element from location list
    selectedLocationsSet.clear();
    dataTypesAndLocations.get(dataTypeSelected.target.value).forEach((siteCode) => {
        locationsSet.forEach((location) => {
            if (siteCode === location.get("proj")) {
                selectedLocationsSet.add(location);
            }
        });
    });
    fillSidebar(locationsSet, selectedLocationsSet);
    fillPoints(locationsSet, selectedLocationsSet);
}
// https://stackoverflow.com/questions/17481098/how-to-get-the-selected-value-on-select-tag-using-javascript

// fills the selected locations list sidebar after a location option selection or a mouse click on a point
function fillSidebar(locationsSet, selectedLocationsSet) {
    const selectedLocationsList = document.querySelector(".selectedLocationsList");
    selectedLocationsList.innerHTML = "";
    selectedLocationsSet.forEach((location) => {
        if (selectedLocationsSet.has(location)) { // if location is selected put it in the sidebar
            const newElem = document.createElement("li");
            newElem.innerHTML = location.get("name") + " (" + location.get("proj") + ")";
            newElem.className = "selectedLocations"; 
            document.querySelector(".selectedLocationsList").appendChild(newElem);
        }
    });
    // console.log(locationsSet);
    // console.log(selectedLocationsSet);
}

// fills in the points on the map after a location option selection or a mouse click on a point
function fillPoints(locationsSet, selectedLocationsSet) {
    locationsSet.forEach((location) => {
        if (selectedLocationsSet.has(location)) { // color points blue if selected
            location.setStyle(bluePoint);
        } else { // color points white if not selected
            location.setStyle(whitePoint);
        }
    });
}

export { initLocations };

// https://youtu.be/RfMkdvN-23o
// https://code-boxx.com/add-html-code-in-javascript/#:~:text=WAYS%20TO%20ADD%20HTML%20CODE%201%20METHOD%201%29,TAKE%20EXTRA%20NOTE%20OF%20THE%20LOADING%20ORDER%21%20
// https://dev.to/ramonak/javascript-how-to-access-the-return-value-of-a-promise-object-1bck