// 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl, function(data) {
    console.log(data),
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

    var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer : pointToLayer
  });

  createMap(earthquakes);
}

// Set colors for circles and legend
function getColor(m) {
  if(m >= 5) {
      return "#FF4500"
  } else if (m >= 4 ) {
      return "#FF8600"
  } else if (m >= 3) {
      return "#FFA500" 
  } else if (m >= 2) {
      return "#FFD700" 
  } else if (m >= 1) {
      return "#FFFF00"       
  } else {
    return "#9ACD32"
  }
}

function pointToLayer(feature,latlng) {
    return new L.circle(latlng, {
        stroke: true,
        color: "black",
        weight: .5,
        fillOpacity: .7,
        fillColor: getColor(feature.properties.mag),
        radius:  feature.properties.mag * 45000
    })
}

function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, \
    <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, \
    <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

 
  var baseMaps = {
    "Light Map": streetmap,
    "Dark Map": darkmap
  };

  
  var overlayMaps = {
    Earthquakes: earthquakes
  };
// centered around Denver
  var myMap = L.map("map", {
    center: [39.73, -104.99],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

   L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

  //legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0,1,2,3,4,5],
    labels = [];
    
     
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i>' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + "   " + '<br>' : '+');
        }
        return div;
  };
    
  legend.addTo(myMap);
};  

