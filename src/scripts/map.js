var map = (function() {

  var data, scale, mapContainer, $map, $counties, timeout;
  var popup = L.popup({closeButton: false});

  function init(counties) {

    draw(counties);
  }

  function draw(counties) {

    mapContainer = document.getElementById('map-wrapper');

    var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    $map = L.map('map', {
      scrollWheelZoom: false,
      zoomControl: false,
      zoom: 7
    });

    L.control.zoom({
      position:'bottomright'
    }).addTo($map);

    $map.addLayer(layer);

    utils.getJson('./data/landkreise.json', function (landkreise) {

      data = landkreise;
      scale = constructScale(data, 6);

      console.log(scale);

      $counties = L.geoJson(counties, {
        onEachFeature: onEachFeature,
        style: function(feature) {

          var landkreis = data.filter(function (element) {
            return element.id === feature.properties.RS;
          })[0];

          return {
            fillColor: getColor(getCategory(landkreis.shopCountDeltaPrc, scale)),
            weight: 0.5,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.7
          };
        }
      }).addTo($map);

      resize();
    });
  }

  function resize() {
    $map.fitBounds($counties.getBounds(), {
      maxZoom: 10
    });
  }

  function onEachFeature(feature, layer) {

    if (feature.properties && feature.properties.GEN) {
      layer.on('mouseover', highlightFeature);
      layer.on('mouseout', resetHighlight);
      layer.on('click', clicked);
    }

  }

  function highlightFeature(e) {
    var layer = e.target;

    popup
      .setLatLng([e.target.getBounds().getNorth(),e.target.getBounds().getWest()+(e.target.getBounds().getEast()-e.target.getBounds().getWest())/2])
      .setContent(function () {

        var res;
        var name ='';
        var landkreis = data.filter(function (element) {
          return element.id === e.target.feature.properties.RS;
        })[0];

        if (landkreis.type === 'Landkreis') {
          name = 'Landkreis ';
        }

        if (landkreis.admDistrictShort) {
          name = name + landkreis.admDistrictShort;
        } else {
          name = name + landkreis.admDistrict;
        }

        if (landkreis.shopCountDeltaPrc === 0) {
          res = '<strong>' + name + ':</strong> Keine Veränderung';
        } else {
          res = '<strong>' + name + ':</strong> ' + Math.round(landkreis.shopCountDeltaPrc * 10) / 10 + '%';
        }

        return res;
      }());

    popup.openOn($map);

    layer.setStyle({
      weight: 1.5,
      color: '#666',
      dashArray: ''
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
  }

  function resetHighlight(e) {
    $counties.resetStyle(e.target);
    $map.closePopup();
  }

  function zoomToFeature(e) {
    $map.fitBounds(e.target.getBounds(), {
      maxZoom: 9
    });
  }

  function clicked(e) {
    zoomToFeature(e);
    scrollToMap();

    text.render(data.filter(function (element) {
      return element.id === e.target.feature.properties.RS;
    })[0], scale);
  }

  function getColor(cat) {

    return [
      '#d81d09',
      '#f9842d',
      '#ffc166',
      '#f7eec1',
      '#dfedf7',
      '#a7c9ea'
    ][cat];
  }

  function getCategory(d, scale) {

    for (var i = 0; i <= scale.length; i++) {

      if (d <= scale[i+1]) {

        return i;
      }
    }
  }

  function constructScale(data, categories) {

    var result = [];

    var min = Math.min.apply(Math, data.map(function (obj) { return obj.shopCountDeltaPrc; }));
    var max = Math.max.apply(Math, data.map(function (obj) { return obj.shopCountDeltaPrc; }));
    var range = Math.abs(min) + Math.abs(max);
    var dist = range / categories;

    for (var i = 0; i <= categories; i++) {

      result[i] = min + i * dist;
    }

    return result;
  }

  function scrollToMap() {
    var offsetTop = mapContainer.offsetTop - 60;
    scroll.to(document.body, offsetTop, 500);
  }

  function disableEventsOnScoll() {
    clearTimeout(timeout);
    mapContainer.style.pointerEvents = 'none';
    timeout = setTimeout(function () {
      mapContainer.style.pointerEvents = 'all';
    }, 700);
  }

  // Export global functions
  return {
    init: init,
    resize: resize,
    disable: disableEventsOnScoll
  };
})();
