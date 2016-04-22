var text = (function() {

  var textContainer;

  function init() {

    textContainer = document.getElementById('text');

    render();
  }

  function render() {

    var data = {
      'name': 'Wunsiedel im Fichtelgebirge',
      'nameKrz': 'Wunsiedel',
      'type': 'Landkreis',
      'regbez': 'Oberfranken',
      'shopChgAbs': '-24',
      'shopChgPrc': '-25.35',
      'shops05': '100',
      'shops15': '76',
      'gemeindeMax': 'Unterneukirchen',
      'nogroceryCount': '5',
      'noshopCount': '4',
      'popChange': '-11.35',
      'brand': 'Edeka Nord',
      'space05': '470',
      'space15': '580',
      'spaceChgAbs': '110',
      'spaceChgPrc': '20.44',
      'workers07': '321',
      'workers15': '421',
      'pop05': '344543',
      'pop14': '333543',
      'dorfladen': '2',
      'dl1': 'Salching',
      'dl2': 'Schweinbach',
      'dl3': 'Unterneupfarrkirchen'
    };

    textContainer.innerHTML = getString(data);
  }

  function getString(data) {

    var str = '';

    // Landkreis oder Stadt?
    if (data.type === 'Landkreis') {

      str += 'In ihrem Landkreis ' + data.name + ' ';
    } else if (data.type === 'Stadt') {

      str += 'In ihrer Stadt ' + data.name + ' ';
    }

    // Rückgang oder Anstieg
    if (data.shopChgPrc < 0) {

      str += 'ist der Einzelhandel um ' + data.shopChgPrc + ' % zurückgegangen. ';
    } else if (data.shopChgPrc > 0) {

      str += 'ist der Einzelhandel um ' + data.shopChgPrc + ' % gewachsen. ';
    }

    str += 'Die Zahlen beruhen auf Ergebungen der Staatsregierung.';

    if (data.dorfladen === 1) {

      str += 'Es gibt einen Dorflanden in ' + data.nameKrz;
    } else if (data.dorfladen > 1) {

      str += 'Es gibt ' + data.dorfladen + ' Dorflanden in ' + data.nameKrz;
    }

    return '<p>' + str + '</p>';
  }

  // Export global functions
  return {
    init: init,
    render: render
  };
})();
