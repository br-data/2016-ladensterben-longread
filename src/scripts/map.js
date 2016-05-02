var map = (function() {

  var $map, $topoLayer, mapContainer, popup, data, scale, timeout;

  function init() {

    extendLeaflet();
    draw();
  }

  function draw() {

    mapContainer = document.getElementById('map-wrapper');

    getGeometry(getData);
  }

  function getGeometry(callback) {

    utils.getJson('./data/landkreise.topo.json', function (districtGeo) {

      var $tileLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {

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

      $map.addLayer($tileLayer);
      callback(districtGeo);
    });
  }

  function getData(districtGeo) {

    popup = L.popup({ closeButton: false });

    utils.getJson('./data/landkreise.json', function (districtData) {

      data = districtData;
      scale = constructScale(data, 6);

      $topoLayer = new L.TopoJSON();

      $topoLayer.addData(districtGeo);
      $topoLayer.addTo($map);

      getColors($topoLayer);

      text.init(data);

      resize();
    });
  }

  function getColors($topoLayer) {

    $topoLayer.eachLayer(function (layer) {

      var currentDistrict = data.filter(function (element) {

        return element.id === layer.feature.id;
      })[0];

      layer.setStyle({

        fillColor: getColor(getCategory(currentDistrict.shopCountDeltaPrc, scale)),
        weight: 0.5,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7
      });

      layer.on('mouseover', highlightFeature);
      layer.on('mouseout', resetHighlight);
      layer.on('click', clicked);
    });
  }

  function resize() {

    $map.fitBounds($topoLayer.getBounds(), {

      maxZoom: 10
    });
  }

  function highlightFeature(e) {

    var layer = e.target;

    popup
      .setLatLng([layer.getBounds().getNorth(), layer.getBounds().getWest() + (layer.getBounds().getEast() - layer.getBounds().getWest()) / 2])
      .setContent(function () {

        var result;
        var name = '';
        var currentDistrict = data.filter(function (element) {

          return element.id === e.target.feature.id;
        })[0];

        if (currentDistrict.type === 'currentDistrict') {

          name = 'currentDistrict ';
        }

        if (currentDistrict.admDistrictShort) {

          name = name + currentDistrict.admDistrictShort;
        } else {

          name = name + currentDistrict.admDistrict;
        }

        if (currentDistrict.shopCountDeltaPrc === 0) {

          result = '<strong>' + name + ':</strong> Keine Veränderung';
        } else {

          result = '<strong>' + name + ':</strong> ' + Math.round(currentDistrict.shopCountDeltaPrc * 10) / 10 + '%';
        }

        return result;
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

    $topoLayer.resetStyle(e.target);
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

    text.render(e.target.feature.id, scale);
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

  function extendLeaflet() {

    L.TopoJSON = L.GeoJSON.extend({

      addData: function(jsonData) {

        if (jsonData.type === 'Topology') {

          for (var key in jsonData.objects) {

            var geojson = topojson.feature(jsonData, jsonData.objects[key]);
            L.GeoJSON.prototype.addData.call(this, geojson);
          }
        }
        else {

          L.GeoJSON.prototype.addData.call(this, jsonData);
        }
      }
    });
  }

  // Export global functions
  return {

    init: init,
    resize: resize,
    disable: disableEventsOnScoll
  };
})();
