document.addEventListener('DOMContentLoaded', init);

function init() {

  navigation.init();
  marginals.init();

  text.init();

  utils.getJson('./data/geojson/vg2500_krs_bayern.geojson', function (data) {

    bubblemap.init(data);
    map.init(data);
  });

  waypoint();
  resize();

  // Disable map events on mobile scroll
  window.addEventListener('touchmove', function () {

    map.disable();
    bubblemap.disable();
  });
}

function resize() {

  var timeout;

  window.onresize = function () {

    clearTimeout(timeout);
    timeout = setTimeout(function () {

      map.resize();
      bubblemap.resize();
      marginals.reorder();
    }, 200);
  };
}

function waypoint() {

  var waypoint = document.getElementById('waypoint');
  var target = document.getElementById('waypoint-target');

  waypoint.addEventListener('click', scrollTo);

  function scrollTo() {
    var offsetTop = target.offsetTop - 80;
    scroll.to(document.body, offsetTop, 750);
  }
}
