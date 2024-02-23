// Create the map object with options.
console.log("Before creating map");
let map = L.map("map-id", {
    center: [0, 0],
    zoom: 2,
});
console.log("After creating map", map);

// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add the streetmap layer to the map.
streetmap.addTo(map);

// Perform an API call to get the Earthquake information 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson")
    .then(response => {
        createMarkers(response, map);
    });

function createMap(earthquakes, map) {
    // Create an overlayMaps object to hold the earthquake layer.
    let overlayMaps = {
        "Earthquake": earthquakes
    };

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers({}, overlayMaps, {
        collapsed: false
    }).addTo(map);
}

function createMarkers(response, map) {
    // Pull the "stations" property from response.data.
    let eq_features = response.features;

    // Initialize an array to hold earthquake markers.
    let eq_markers = [];

    // Loop through the stations array.
    for (let index = 0; index < eq_features.length; index++) {
        let eq = eq_features[index];

        // For each station, create a marker, and bind a popup with the station's name.
        let marker = L.marker([eq.geometry.coordinates[1], eq.geometry.coordinates[0]]);
        eq_markers.push(marker);
    }

    let eqLayer = L.layerGroup(eq_markers);
    eqLayer.addTo(map);

    console.log("Type of eqLayer:", typeof eqLayer); // Log the type of eqLayer
    console.log("eqLayer:", eqLayer); // Log eqLayer to inspect its properties
    console.log("Number of markers in eqLayer:", eqLayer.getLayers().length);

    //map.fitBounds(eqLayer.getBounds()); 
    // if (eqLayer && typeof eqLayer.getBounds === 'function') {
    //     map.fitBounds(eqLayer.getBounds());
    // } else {
    //     console.error("eqLayer is not a valid Leaflet layer or does not have getBounds method.");
    // }

    //let bounds = eqLayer.getBounds();

    // Check if the bounds are valid before fitting the map
    //if (bounds.isValid()) {
        // Fit the map bounds to include all earthquake markers.
        //map.fitBounds(bounds);
    //} else {
        //console.error("Invalid bounds for earthquake markers.");
    //}


    createMap(eqLayer, map);
}
