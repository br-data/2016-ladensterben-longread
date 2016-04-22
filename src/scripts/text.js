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
      'shopChgAbs': '-4',
      'shopChgPrc': '-45.6',
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

  function getDigitStr(dig) {
    var array = ["kein", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"];
    return array[dig] || dig;
  }

  function getWrittenPcg(pcg) {

    var result = '';
    pcg = Math.abs(pcg);

    if (pcg > 5 && pcg < 10) {
      result = 'leicht'
    } else if (pcg > 18 && pcg < 22) {
      result = 'etwa ein Fünftel ';
    } else if (pcg > 22.1 && pcg < 27) {
      result = 'etwa ein Viertel ';
    } else if (pcg > 29 && pcg < 33.3) {
      result = 'etwa ein Drittel ';
    } else if (pcg >= 33.3 && pcg < 45 ) {
      result = 'mehr als ein Drittel ';
    } else if (pcg > 45 && pcg < 50 ) {
      result = 'etwa die Hälfte ';
    } else if (pcg >= 50 && pcg < 57  ) {
      result = 'mehr als die Hälfte ';
    } else if (pcg >= 60 && pcg < 66.6  ) {
      result = 'etwa zwei Drittel ';
    } else if (pcg >= 66.6 ) {
      result = 'mehr als zwei Drittel ';
    } else {
      result = Math.round(pcg) + ' Prozent '
    }

    return result;
  }

  function getString(data) {

    var headline ='';
    var paragraph = '';
    var ort = '';
    var prefix = '';
    var menge = '';

    

    if (data.regbez === 'Oberpfalz') {
      prefix = 'der ';
    }

    // Landkreis oder Stadt?
    if (data.type === 'Landkreis') {

      paragraph += 'Im Landkreis ' + data.name + ' in ' + prefix + data.regbez + ' ';
      wo = 'im Landkreis ';
      headline += 'Landkreis ' + data.name + ': ';
    } else if (data.type === 'Stadt') {

      paragraph += 'In ' + data.name + ' ';
      wo = 'in der Stadt ';
      headline += data.name + ': '
    }

    // Rückgang oder Anstieg
    if (data.shopChgPrc < 0) {

      paragraph += 'ist der Einzelhandel in den vergangenen zehn Jahren um ' + getWrittenPcg(data.shopChgPrc) + ' zurückgegangen. Heute gibt es ' + wo + getDigitStr(-data.shopChgAbs) + ' Geschäfte weniger als noch im Jahr 2005. ';
      headline += 'Einzelhandel geht zurück';
      if (data.spaceChgPrc > 0) {
      paragraph += 'Gleichzeitig hat die durchschnittliche Verkaufsfläche der Geschäfte ' + wo + data.nameKrz + ' um ' + getWrittenPcg(data.spaceChgPrc) + 'zugenommen. Das deutet darauf hin, dass kleinere Läden verschwunden sind, während sich größere Märkte gehalten oder sogar neu eröffnet haben. ';     
      } else if (data.spaceChgPrc < 0) {
      paragraph += 'Gleichzeitig hat auch die durchschnittliche Verkaufsfläche der Geschäfte ' + wo + data.nameKrz + ' abgenommen. Das deutet darauf hin, dass größere Märkte geschlossen haben, während sich kleinere Läden gehalten haben.';
      }
    } else if (data.shopChgPrc > 0) {

      paragraph += 'ist der Einzelhandel in den vergangenen zehn Jahren um ' + getWrittenPcg(data.shopChgPrc) + ' gewachsen. ';
      headline += 'Einzelhandel wächst';
    }

    if (data.noshopCount > 0) {
      paragraph += ''
    }



    paragraph += 'Die Zahlen beruhen auf Erhebungen der Staatsregierung. ';

    if (data.dorfladen === 1) {

      paragraph += 'Es gibt einen Dorfladen ' + wo + ' ' + data.nameKrz ;
    } else if (data.dorfladen > 1) {

      paragraph += 'Es gibt ' + getDigitStr(data.dorfladen) + ' Dorfläden ' + wo + ' ' + data.nameKrz + '.';
    }

    return '<h3>' + headline + '</h3> <p>' + paragraph + '</p>';
  }

  // Export global functions
  return {
    init: init,
    render: render
  };
})();
