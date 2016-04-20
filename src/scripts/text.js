var text = (function() {

  var templates, view;

  function init() {

    templates = document.getElementsByClassName('template');

    render();
  }

  function render(merge) {

    view = {
        "name": "Wunsiedel im Fichtelgebirge",
        "name_kurz": "Wunsiedel",
        "ks": false,
        "regbez": "Oberfranken",
        "landkreis_id": "09479",
        "opf": false,
        "fund_max_menge": "214",
        "fund_max_year": "2010",
        "fund_max_month": "Juni",
        "fund_max_ort": "Selb",
        "ort_max_funde": "295",
        "ort_max": "Schirnding",
        "trend": "weniger als",
        "menge": "6563",
        "gram_leq_one": false,
        "funde": "563",
        "funde_text": "563",
        "funde_one": false,
        "menge_2015": "956",
        "funde_2015": "96",
        "grenznah": true,
        "asiamarkt": "Aš",
        "methlab_count": "ein",
        "methlab_one": true,
        "last_lab": "Marktredwitz",
        "last_lab_month": "Mai",
        "last_lab_year": "2013",
        "kat_garmisch": false,
        "kat_0": false,
        "kat_1": false,
        "kat_2": false,
        "kat_3": false,
        "kat_4": true
    };

    for (var property in merge) {
      if (merge.hasOwnProperty(property)) {
        view[property] = merge[property];
      }
    }

    for (var i=0; i<templates.length; i++) {
      var template = templates[i].getElementsByTagName('script')[0];
      template = template.textContent || template.innerText;

      var container = templates[i].getElementsByTagName('div')[0];
      container.innerHTML = Mustache.render(template, view);
    }
  }

  // Export global functions
  return {
    init: init,
    render: render
  };
})();
