var utils = (function () {

  function getJson(path, callback) {

    var httpRequest = new XMLHttpRequest();

    httpRequest.overrideMimeType('application/json');

    httpRequest.onreadystatechange = function() {

      if (httpRequest.readyState === 4) {

        if (httpRequest.status === 200) {

          if (callback) callback(JSON.parse(httpRequest.responseText));
        }
      }
    };

    httpRequest.open('GET', path);
    httpRequest.send();
  }

  return {
    getJson: getJson
  };
})();
