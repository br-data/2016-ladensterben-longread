document.addEventListener('DOMContentLoaded', init);

function init() {

  navigation.init();
  marginals.init();
  video.init();
  modal.init();
  map.init();

  arrow();
  waypoint();
  shortcuts();
  resize();

  // Disable map events on mobile scroll
  window.addEventListener('touchmove', function () {

    map.disable();
  });
}

function arrow() {

  var $arrow = document.getElementById('arrow');
  var $header = document.getElementById('header');

  $arrow.addEventListener('click', scrollTo);

  function scrollTo() {

    var offsetTop = $header.offsetHeight - 60;
    scroll.to(offsetTop, 750);
  }
}

function waypoint() {

  var $waypoint = document.getElementById('waypoint');
  var $target = document.getElementById('waypoint-target');

  $waypoint.addEventListener('click', scrollTo);

  function scrollTo() {

    var offsetTop = $target.offsetTop - 80;
    scroll.to(offsetTop, 750);
  }
}

function shortcuts() {

  var $shortcut, i;
  var $shortcuts = document.getElementsByClassName('shortcut');

  for (i = 0; i < $shortcuts.length; i++) {

    $shortcut = $shortcuts[i];
    $shortcut.addEventListener('click', selectLayer);
  }

  function selectLayer(e) {

    var id = e.target.getAttribute('href').replace('#','');

    map.forceSelectLayer(id);
  }
}

function resize() {

  var timeout;

  window.onresize = function () {

    clearTimeout(timeout);
    timeout = setTimeout(function () {

      map.resize();
      marginals.reorder();
    }, 200);
  };
}
