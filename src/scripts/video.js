var video = (function () {

  // Get device width
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

  function init() {

    videojs('intro-video', {}, function () {

      this.volume(0);

      if (width > 560) {

        this.play();
      }
    });
  }

  return {

    init: init
  };
})();
