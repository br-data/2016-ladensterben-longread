var video = (function () {

  // Get device width
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

  function init() {

    if (width > 560) {

      var player = videojs('intro-video');

      player.volume(0);
      player.play();
    }
  }

  return {

    init: init
  };
})();
