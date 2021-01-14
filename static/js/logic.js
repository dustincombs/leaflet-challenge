// url for geojson data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// get the geojson data
d3.json(url, function(data) {
  // send the features to the makeMap function
  makeMap(data.features);
});

// create the map
function makeMap(features){
  var myMap = L.map("map").setView([45.52, -122.67], 4);

  // Add a tile layer (the background map image) to our map
  // Use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: token
  }).addTo(myMap);

  // add the markers to the map
  L.geoJSON(features, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius:feature.properties.mag*5
      });
    }
  }).addTo(myMap)
}
