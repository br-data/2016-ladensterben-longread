var map = (function() {

  var $map, $mapContainer, $topoLayer, $currentLayer,
    districtGeo, districtData, scale, width, center, dimmed, timeout;

  var defaultDistrict = validateHash(location.hash) || '09475';

  var highlight = {
    color: 'black',
    weight: 2,
    fillOpacity: 0.8,
    opacity: 1
  };

  var standard = {
    color: 'black',
    weight: 0.5,
    fillOpacity: 0.8,
    opacity: 1
  };

  var lowlight = {
    color: 'black',
    weight: 0.5,
    fillOpacity: 0.4,
    opacity: 1
  };

  function init() {

    extendLeaflet();
    draw();
  }

  function draw() {

    $mapContainer = document.getElementById('map-wrapper');

    getGeometry(getData);
  }

  function getGeometry(callback) {

    utils.getJson('./data/landkreise.topo.json', function (geometry) {

      $map = L.map('map', {

        scrollWheelZoom: false,
        zoomControl: false,
        zoom: 7
      });

      L.control.zoom({

        position:'bottomright'
      }).addTo($map);

      L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {

        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      }).addTo($map);

      $map.on('click', handleMapClick);
      $map.on('dblclick', handleMapClick);

      districtGeo = geometry;

      callback();
    });
  }

  function getData() {

    utils.getJson('./data/landkreise.json', function (data) {

      districtData = data;
      scale = constructScale(districtData, 6);

      $topoLayer = new L.TopoJSON();
      $topoLayer.addData(districtGeo);
      $topoLayer.addTo($map);

      text.init(districtData, scale);
      text.render(defaultDistrict);

      resizeMap();
      getColors();
    });
  }

  function getColors() {

    $topoLayer.eachLayer(function (layer) {

      var currentDistrict = districtData.filter(function (district) {

        return district.id === layer.feature.id;
      })[0];

      layer.setStyle({

        fillColor: getColor(getCategory(currentDistrict.shopCountDeltaPrc, scale))
      });

      layer.setStyle(lowlight);

      if (!L.Browser.touch) {

        layer.on('mouseover', handleMouseenter);
        layer.on('mouseout', handleMouseout);
      }

      layer.on('click', handleClick);
      layer.on('dblclick', resizeMap);
    });

    $topoLayer.eachLayer(function (layer) {

      if (layer.feature.id === defaultDistrict) {

        highlightLayer(layer);
      }
    });

    getLegend();
  }

  function getLegend() {

    var legend = L.control({position: 'topright'});

    legend.onAdd = function () {

      var wrapper = L.DomUtil.create('div', 'legend');
      var title = L.DomUtil.create('div', 'title', wrapper);
      var innerlegend = L.DomUtil.create('div', 'inner', wrapper);

      title.textContent = 'Supermärkte: Zu-/Abnahme seit 2005';

      var grades = [-27.92, -18.7, -9.48, -0.26, 8.96];

      for (var i = 0; i < grades.length; i++) {

        innerlegend.innerHTML +=
          '<div class="class" style="background: ' + getColor(i) + ';"></div>' +
          '<div class="tick">' +
            '<div class="label">' + Math.round(grades[i]) +'%</div>' +
          '</div>';
      }

      innerlegend.innerHTML += '<div class="class" style="background: ' + getColor(grades.length) + ';"></div>';

      return wrapper;
    };

    legend.addTo($map);
  }

  function getContent(layer) {

    var result;
    var name = '';

    var currentDistrict = districtData.filter(function (district) {

      return district.id === layer.feature.id;
    })[0];

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
  }

  function getPopup(layer) {

    return L.popup({ closeButton: false })
      .setLatLng([layer.getBounds().getNorth(), layer.getBounds().getCenter().lng])
      .setContent(getContent(layer))
      .openOn($map);
  }

  function handleMouseenter(e) {

    var layer = e.target;

    layer.setStyle(highlight);

    if (!L.Browser.ie && !L.Browser.opera) {

      layer.bringToFront();
    }

    getPopup(layer);
  }

  function handleMouseout(e) {

    var layer = e.target;

    if (layer !== $currentLayer && !dimmed) {

      layer.setStyle(standard);
    } else if (layer !== $currentLayer && dimmed) {

      layer.setStyle(lowlight);
    }

    $map.closePopup();
  }

  function handleClick(e) {

    var layer = e.target;

    if (layer === $currentLayer && dimmed) {

      $map.closePopup();
      dimLayers();
    } else {

      //zoomToFeature(e);
      $map.closePopup();
      getPopup(layer);
      highlightLayer(layer);
      scrollToMap();
    }

    location.hash = layer.feature.id;
    text.render(layer.feature.id, scale);
  }

  function handleMapClick() {

    resizeMap();
    dimLayers();
  }

  function highlightLayer(layer) {

    if ($currentLayer) $currentLayer.setStyle(lowlight);
    $currentLayer = layer;

    $topoLayer.eachLayer(function (layer) {

      layer.setStyle(lowlight);
    });

    layer.setStyle(lowlight);
    layer.setStyle(highlight);

    dimmed = true;
  }

  function dimLayers() {

    $topoLayer.eachLayer(function (layer) {

      layer.setStyle(standard);
    });

    dimmed = false;
  }

  function resizeMap() {

    center = $topoLayer.getBounds();
    width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    if (width < 560) {

      center._northEast.lat = center._northEast.lat * 1.01;
      center._southWest.lat = center._southWest.lat * 1.01;
    }

    $map.fitBounds(center, {

      maxZoom: 10
    });
  }

  // function zoomToFeature(e) {

  //   $map.fitBounds(e.target.getBounds(), {

  //     maxZoom: 9
  //   });
  // }

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

    var offsetTop = $mapContainer.offsetTop - 60;
    var currentPosition = document.documentElement.scrollTop || document.body.scrollTop;

    if (currentPosition < offsetTop) {

      scroll.to(document.body, offsetTop, 500);
    }
  }

  function validateHash(str) {

    str = str ? str.match(/#(\w+)/)[1] : false;

    return /\d{5}/.test(str) ? str : false;
  }

  function disableEventsOnScoll() {

    clearTimeout(timeout);
    $mapContainer.style.pointerEvents = 'none';

    timeout = setTimeout(function () {

      $mapContainer.style.pointerEvents = 'all';
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
    resize: resizeMap,
    highlight: highlightLayer,
    disable: disableEventsOnScoll
  };
})();
