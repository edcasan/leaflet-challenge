// Create a map object
var myMap = L.map("map", {
  center: [37.09024, -95.712891],
  zoom: 4
});

// Adding tile layer
var maplayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// GeoJSON URL 
var earthqURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// LayerGroups
var earthq = new L.LayerGroup().addTo(myMap);;

// GeoJSON Data
d3.json(earthqURL, function (earthqData) {
  // Function to set marker size
  function markerSize(magnitude) {
      if (magnitude === 0) {
          return 0.1;
      }
      else 
          return magnitude * 2;
  }
  // Function to set style 
  function markerstyle(feature) {
      return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: setcolor(feature.properties.mag),
          color: "#000000",
          radius: markerSize(feature.properties.mag),
          stroke: true,
          weight: 0.5
      };
  }
  // Function to Determine Color 
  function setcolor(magnitude) {
      switch (true) {
          case magnitude > 5:
              return "#f80606";
          case magnitude > 4:
              return "#ff7c01";
          case magnitude > 3:
              return "#eeff05";
          case magnitude > 2:
              return "#adff2f";
          case magnitude > 1:
              return "#08fa28";
          default:
              return "#ffffff";
      }
  }
  // GeoJSON Layer 
  L.geoJSON(earthqData, {
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
      },

      style: markerstyle,
      // Function For Each feature of the features Array
      // Popup describing the Place & Time of the Earthquake
      onEachFeature: function (feature, layer) {
          layer.bindPopup("<h4>Location: " + feature.properties.place +
              "<h4>Date & Time: " + new Date(feature.properties.time)  +
              "<h4>Magnitude: " + feature.properties.mag);
      }
      // Add earthquakeData 
  }).addTo(earthq);

  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {

      let div = L.DomUtil.create('div', 'info legend'),
          magnitude = [0, 1, 2, 3, 4, 5],
          labels = [];

      for (let i = 0; i < magnitude.length; i++) {
          
          div.innerHTML +=
              '<i style="background:' + setcolor(magnitude[i] + 1) + '"></i> ' +
              magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
      }

      return div;
  };
  
  legend.addTo(myMap);
});
