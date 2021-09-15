let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

d3.json(queryUrl).then(function (data) {
    console.log(data);
    let earthquakeData = data.features;
    createLayer(earthquakeData);

    let coords = [];
    for (quake = 0; quake < earthquakeData.length; quake ++) {
        coords.push([earthquakeData[quake].geometry.coordinates[1], 
            earthquakeData[quake].geometry.coordinates[0]]);
    }
    console.log(coords);

    // Create a function that makes a popup for each earthquake event
    function createLayer(earthquakeData) {
        function onEachEvent(event, layer) {
            layer.bindPopup(`<h4>${event.properties.place}</h4><hr><p>${new Date(event.properties.time)}</p>`);
        }
        // Call function inside new 'earthquakes' layer
        let earthquakes = L.geoJSON(earthquakeData, 
            {onEachEvent: onEachEvent}
        );
        
        // Send layer to new 'createMap' function
        createMap(earthquakes);
    }

    function createMap(earthquakes) {

        let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
            foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    
        let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });
    
        let baseMaps = {
            'Street View': street,
            'Topographic View': topo
        };
    
        let overlayMaps = {
            Earthquakes: earthquakes
        };

      // Create our map, giving it the streetmap and earthquakes layers to display on load.
      var myMap = L.map("map", {
        center: coords[0],
        zoom: 5,
        layers: [street, earthquakes]
      });
    
       // Create a layer control.
      // Pass it our baseMaps and overlayMaps.
      // Add the layer control to the map.
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    
    };
});



