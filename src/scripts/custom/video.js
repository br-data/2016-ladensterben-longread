var video = (function () {

  // Get device width
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

  function init() {

    if (width > 560) {

      videojs('intro-video', {}, function () {

        this.volume(0);
        this.play();
      });
    }
  }

  return {

    init: init
  };
})();
