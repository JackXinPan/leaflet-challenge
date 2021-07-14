// Store our API endpoint as url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(url).then(function(data) {
    console.log(data.features.map(value => value.properties.mag))

  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        //features.properties.place is location name in GEOJSON. 
      layer.bindPopup("<h3>" + feature.properties.place + "<hr>Magnitude Level: " + feature.properties.mag +
        //".time" is the date that needs to be parsed
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}
    // setting attributes for the pointToLayer function, changing default geoJSon markers
var geojsonMarkerOptions = {
    radius: 4,
    fillColor: "#87F619",
    color: "black",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // this part creates the markers
    var earthquakes = L.geoJSON(data, {
      onEachFeature: onEachFeature,// Run the onEachFeature function once for each piece of data in the array (popup)
      pointToLayer: function (feature, latlng) { // create circles for markers
        return L.circleMarker(latlng, geojsonMarkerOptions);
        },
    style: function(feature) {
        switch (true) { // switch statement to change radius and color of circle depending on magnitude
            case feature.properties.mag > 5: return {radius: 16, fillColor: "#990000"};
            case feature.properties.mag > 4: return {radius: 12, fillColor: "#F85533"};
            case feature.properties.mag > 3: return {radius: 10, fillColor: "#F4840C"};
            case feature.properties.mag > 2: return {radius: 8, fillColor: "#E2CA87"};
            case feature.properties.mag > 1: return {radius: 6, fillColor: "#D0F0B0"};
        }
    }
    });
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);

});


//Create map function
function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

     // Set up the legend
    var legend = L.control({ position: "bottomright" }); //where to put legend
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var grades = [0, 1, 2, 3, 4, 5];
      var colors = ["#87F619", "#D0F0B0", "#E2CA87", "#F4840C","#F85533", "#990000"];
      grades.forEach(function(grade, i) {     //loop to label the legend
        div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grade + (grades[i + 1] ? "-" + grades[i + 1] + "<br>" : "+");
    });
    
    return div;

    };

    // Adding legend to the map
    legend.addTo(myMap);


 }

