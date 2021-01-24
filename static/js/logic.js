
// urls for geojson data
var urlQuakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var urlFaults = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// get the fault line data
async function getFaultlines() {
  let data = await d3.json(urlFaults)
  return data
}
const faultPromise = getFaultlines()

// get the earthquake data
d3.json(urlQuakes).then(function(data) {
  // send the features to the makeMap function
  makeMap(data.features);
  // console.log(data.features)
});



// create the map
function makeMap(features){

  // define function to run on each feature
  function onEachFeature(feature, layer) {
    if(feature.properties.mag){
      mag = feature.properties.mag.toPrecision(2)
    }
    else{
      mag = feature.properties.mag
    }
    layer.bindPopup("<h3>Magnitude: " + mag +
      "</h3><hr>" + "<p>" + feature.properties.place + "</p>" +
      "<p>" + new Date(feature.properties.time) + "</p>"
    );
  }

  // create dark map
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: token
  });

  // create light map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: token
  });

  // find the maximum magnitude to adjust the color scale
  var maxMag = Math.max.apply(Math, features.map(function(o) { return o.properties.mag; }))

  // create earthquake markers
  var quakes = L.geoJSON(features, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius:feature.properties.mag*5,
        // fillColor:d3.interpolateInferno(feature.properties.mag/6),
        fillColor:d3.interpolateCool(feature.properties.mag/6),
        weight:1,
        color:"white"
      });
    }
  })

  // create base layers
  var baseMaps = {
    Light: lightmap,
    Dark: darkmap
  };

  // Create map object and set default layers
  var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 4,
    layers: [darkmap, quakes]
  });


  // wait for promise with plate boundary data
  faultPromise.then(data=>{
    var faults = L.geoJson(data,{color:"white"});
    // create feature layers
    var featureLayers = {
      Earthquakes:quakes,
      "Plate Boundaries":faults
    }
    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, featureLayers).addTo(myMap);

  });

}
