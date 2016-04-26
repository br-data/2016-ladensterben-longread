var map = (function() {

  var data, mapContainer, $map, $counties, timeout;
  var numCategories = 8;
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

    var scale = constructScale();

    utils.getJson('./data/json/landkreise.json', function(landkreise){
      data = landkreise;
      $counties = L.geoJson(counties, {
        onEachFeature: onEachFeature,
        style: function(feature) {

          var landkreis = data.filter(function (element) {
            return element.landkreis_id === feature.properties.sch;
          })[0];

          return {
            fillColor: getColor(getCategory(landkreis.shopDeltaPrc, scale)),
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
          return '0' + element.sch === e.target.feature.properties.RS;
        })[0];

        if (landkreis.type === 'Landkreis') {
          name = 'Landkreis ';
        }

        if (landkreis.name_kurz) {
          name = name + landkreis.name_kurz;
        } else {
          name = name + landkreis.name;
        }

        if (!landkreis.shopDeltaPrc) {
          res = '<strong>' + name + ':</strong> Kein Fund';
        } else if (landkreis.shopDeltaPrc === '1') {
          res = '<strong>' + name + ':</strong> 1 Fund';
        } else {
          res = '<strong>' + name + ':</strong> ' + landkreis.shopDeltaPrc + ' Funde';
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
      return '0' + element.sch === e.target.feature.properties.RS;
    })[0]);
  }

  function getColor(cat) {

    return [
      '#ffffcc',
      '#ffeda0',
      '#fed976',
      '#feb24c',
      '#fd8d3c',
      '#fc4e2a',
      '#e31a1c',
      '#b10026'
    ][cat];
  }


  function getCategory(d, scale) {
    for (var i = 0; i<=numCategories; i++) {
      if (d<=scale[i+1]) {
        // console.log(i-1);
        return i;
      }
    }
  }

  function constructScale() {

    // var min = Math.min.apply(null, arr);
    // var max = Math.max.apply(null, arr);
    // var dist = Math.abs(max-min)/(numCategories);

    // var res = [];

    // for(var i = 0; i<=numCategories; i++) {
    //   res[i] = min + i*dist;
    // }

    // length(res) === numCategories + 1
    // return res;

    return [-100,-75,-50,-25,0,25,50,75,100];
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
