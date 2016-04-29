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

  function escapeHtml(string) {

    return string.replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  }

  return {
    getJson: getJson,
    escapeHtml: escapeHtml
  };
})();
