var video = (function () {

  // Get device width
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

  function init() {

    var player = videojs('intro-video');

    if (width > 560) {

      player.ready(function(){
        player.volume(0);
        player.play();
      });
    } else {

      player.dispose();
    }
  }

  return {

    init: init
  };
})();
