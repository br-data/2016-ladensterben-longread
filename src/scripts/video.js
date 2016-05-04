var video = (function () {

  function init() {

    videojs('intro-video', {}, function () {

      this.volume(0);
      this.play();
    });
  }

  return {

    init: init
  };
})();
