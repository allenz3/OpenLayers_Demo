// input and save csv location data
async function getLocation() {
    const response = await fetch('../data/csv/CV_SacPAS_Proj_LatLon.csv');
    const data = await response.text();
    const locations = data.split('\n').slice(1);
    const locationsInfo = locations.map(location => {
        const col = location.split(',');
        // creates location list in page sidebar
        const newElem = document.createElement("option");
        newElem.innerHTML = col[1] + " (" + col[0] + ")";
        document.querySelector(".locationsList").appendChild(newElem);
        // returns array of location data
        return {proj: col[0], name: col[1], basin: col[2], lat: col[3], lon: col[4]};
    });
    return locationsInfo;
}

export { getLocation };
// https://youtu.be/RfMkdvN-23o
// https://code-boxx.com/add-html-code-in-javascript/#:~:text=WAYS%20TO%20ADD%20HTML%20CODE%201%20METHOD%201%29,TAKE%20EXTRA%20NOTE%20OF%20THE%20LOADING%20ORDER%21%20
// https://dev.to/ramonak/javascript-how-to-access-the-return-value-of-a-promise-object-1bck