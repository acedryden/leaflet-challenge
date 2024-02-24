// Create the map object with options.
console.log("Before creating map");
let map = L.map("map-id", {
    center: [15.985819568377556, 121.51704935379145],
    zoom: 4,
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
    for (let index = 0; index <eq_features.length; index++) {
        let eq = eq_features[index];
        
        // For each station, create a marker, and bind a popup with the station's name.
        let marker = L.circle([eq.geometry.coordinates[1], eq.geometry.coordinates[0]], 
            {radius: getRadiusBasedOnValue(eq.properties.mag), 
            fillColor: getColorBasedOnValue(eq.geometry.coordinates[2]), 
            color: getColorBasedOnValue(eq.geometry.coordinates[2]), 
            fillOpacity:0.8, 
             
        });

        marker.bindTooltip(`
            <strong>Magnitude:</strong> ${eq.properties.mag} <br>
            <strong>Location:</strong> ${eq.properties.place} <br>
            <strong>Coordinates:</strong> ${eq.geometry.coordinates[1]}, ${eq.geometry.coordinates[0]} <br>
            <strong>Depth:</strong> ${eq.geometry.coordinates[2]}`); 
        
        eq_markers.push(marker);
    }

               
    function getColorBasedOnValue(value) {
        if (value < 30) {
            return 'green';
        } else if (value < 50) {
            return 'yellow';
        } else if (value < 70) { 
            return 'orange';  
        } else {
            return 'red';
        }
    }

    function getRadiusBasedOnValue(value) {
        if (value < 3.0) {
            return 1 * 1000; 
        } else if (value < 5.0) {
            return 20 * 1000; 
        } else if (value < 7.0) {
            return 50 * 1000; 
        } else {
            return 100 * 1000; 
        }
    }
// Define legend content
let legendContent = '<div class="legend"> \
    <div class="legend-item"><span style="background-color: green;"></span> Depth: -10-10</div> \
    <div class="legend-item"><span style="background-color: yellow;"></span> Depth: 10-50</div> \
    <div class="legend-item"><span style="background-color: orange;"></span> Depth: 50-70</div> \
    <div class="legend-item"><span style="background-color: red;"></span> Depth: 70+</div> \
</div>';

// Create a control and add it to the map
let legendControl = L.control({ position: 'bottomright' });

legendControl.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = legendContent;
    return div;
};

legendControl.addTo(map);
// need tooltip with m agnitude, location and depth 
  

    let eqLayer = L.layerGroup(eq_markers);
    eqLayer.addTo(map);

    console.log("Type of eqLayer:", typeof eqLayer); // Log the type of eqLayer
    console.log("eqLayer:", eqLayer); // Log eqLayer to inspect its properties
    console.log("Number of markers in eqLayer:", eqLayer.getLayers().length);

    createMap(eqLayer, map);
}
