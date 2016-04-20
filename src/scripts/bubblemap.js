var bubblemap = (function() {

  var $counties, $bubbles, $map, mapContainer, mapWidth, scale, timeout;

  function init(data) {

    draw(data);
  }

  function draw(data) {

    mapContainer = document.getElementById('bubblemap-wrapper');

    mapWidth = mapContainer.offsetWidth;
    scale = mapWidth / 658 < 0.5 ? 0.5 : mapWidth / 658;

    $map = L.map('bubblemap', {
      attributionControl: false,
      scrollWheelZoom: false,
      tap: false,
      zoomControl: false,
      zoom: 8
    });

    if (scale > 0.5) {
      $map.dragging.disable();
      $map.touchZoom.disable();
      $map.doubleClickZoom.disable();
      $map.scrollWheelZoom.disable();
      $map.keyboard.disable();

      if ($map.tap) {
        $map.tap.disable();
      }
    }

    drawCounties(data);
    drawBubbles(function () {
      $counties.addTo($map);
      $bubbles.addTo($map);
      resize();
    });
  }

  function drawCounties(data) {

    $counties = L.geoJson(data, {
      style: {
        className: 'feature',
        fillColor: '#ffffc1',
        fillOpacity: '0.8',
        color: 'black',
        opacity: 0.3,
        weight: 0.5
      }
    });
  }

  function drawBubbles(callback) {
    utils.getJson('./data/geojson/tote.geojson', function (data) {
      $bubbles = L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
          return new L.CircleMarker(latlng, {
            radius: getRadius(feature.properties.zahl),
            fillOpacity: 1,
            fillColor: '#ca3351',
            color: 'white',
            opacity: 1,
            weight: 2
          });
        },
        onEachFeature: onEachFeature
      });

      callback();
    });
  }

  function resize() {
    $map.fitBounds($counties.getBounds(), {
      maxZoom: 10
    });
  }

  function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.ort) {
      layer.bindPopup(getContent(feature.properties), {
        closeButton: false,
        // autoPan: false,
        offset: L.point(0, -1 * getRadius(feature.properties.zahl))
      });
      layer.on('mouseover', function() {

        layer.setStyle({
          color: 'black'
        });
        layer.openPopup();
      });
      layer.on('mouseout', function() {
        layer.setStyle({
          color: 'white'
        });
        layer.closePopup();
      });
    }
  }

  function getContent(data) {
    return '<strong>' + data.ort + '</strong>: ' + data.zahl + (data.zahl === 1 ? ' Toter' : ' Tote');
  }

  function getRadius(area) {
    var minRadius = 2 * scale;
    var maxRadius = 12 * scale;
    var radius = Math.sqrt(area / Math.PI);

    return Math.floor(radius * maxRadius) + minRadius;
  }

  function disableEventsOnScoll() {
    clearTimeout(timeout);
    mapContainer.style.pointerEvents = 'none';
    timeout = setTimeout(function () {
      mapContainer.style.pointerEvents = 'all';
    }, 1000);
  }

  // Export global functions
  return {
    init: init,
    resize: resize,
    disable: disableEventsOnScoll
  };
})();
