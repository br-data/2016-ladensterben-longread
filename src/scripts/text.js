var text = (function() {

  var textContainer;

  function init() {

    textContainer = document.getElementById('text');

    render();
  }

  function render() {

    var data = {
      'name': 'Mühldorf am Inn',
      'nameKrz': 'Mühldorf',
      'type': 'Landkreis',
      'regbez': 'Oberbayern',
      'shopChgAbs': '9',
      'shopChgPrc': '10.61',
      'shops05': '65',
      'shops15': '62',
      'gemeindeMax': '',
      'nogroceryCount': '14',
      'noshopCount': '10',
      'popChange': '-0.57',
      'brand': 'Edeka Nord',
      'space05': '732',
      'space15': '770',
      'spaceChgAbs': '38',
      'spaceChgPrc': '5.19',
      'workers07': '219',
      'workers15': '247',
      'pop05': '110930',
      'pop14': '110296',
      'dorfladen': '5',
      'dl1': 'Salching',
      'dl2': 'Schweinbach',
      'dl3': 'Unterneupfarrkirchen',
      'lastShopDeltaPrc': '8.26',
      'lastShopDeltaAbs': '4'
    };

    textContainer.innerHTML = getString(data);
  }

  function getDigitStr(dig) {
    var array = ["kein", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"];
    return array[dig] || dig;
  }

  function getShortName(data) {
    return data.nameKrz || data.name;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function getRegbezAdj(data) {
    if (data == 'Oberbayern') {
      result = 'oberbayerisch';
    } else if (data == 'Oberpfalz') {
      result = 'oberpfälzisch';
    } else if (data == 'Oberfranken') {
      result = 'oberfränkisch';
    } else if (data == 'Unterfranken') {
      result = 'unterfränkisch';
    } else if (data == 'Mittelfranken') {
      result = 'mittelfränkisch';
    } else if (data == 'Schwaben') {
      result = 'schwäbisch';
    } else if (data == 'Niederbayern') {
      result = 'niederbayerisch';
    }
    return result;
  }

  function getWrittenPcg(pcg) {

    var result = '';
    pcg = Math.abs(pcg);

    if (pcg > 0.1 && pcg < 10) {
      result = 'leicht'
    } else if (pcg > 18 && pcg < 22) {
      result = 'etwa ein Fünftel';
    } else if (pcg > 22.1 && pcg < 27) {
      result = 'etwa ein Viertel';
    } else if (pcg > 29 && pcg < 33.3) {
      result = 'etwa ein Drittel';
    } else if (pcg >= 33.3 && pcg < 45 ) {
      result = 'mehr als ein Drittel';
    } else if (pcg > 45 && pcg < 50 ) {
      result = 'etwa die Hälfte';
    } else if (pcg >= 50 && pcg < 57  ) {
      result = 'mehr als die Hälfte';
    } else if (pcg >= 60 && pcg < 66.6  ) {
      result = 'etwa zwei Drittel';
    } else if (pcg >= 66.6 ) {
      result = 'mehr als zwei Drittel';
    } else {
      result = getDigitStr(Math.round(pcg)) + ' Prozent '
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
      prefix = ' der';
    }

    // Landkreis oder Stadt?
    if (data.type === 'Landkreis') {

      paragraph += 'Im ' + getRegbezAdj(data.regbez) + 'en <strong>Landkreis ' + data.name + '</strong>';
      wo = ' im Landkreis';
      was = 'der Landkreis';
      headline += 'Landkreis ' + data.name + ': ';
    } else if (data.type === 'Stadt') {

      paragraph += 'In <strong>' + data.name + '</strong>';
      wo = 'in der Stadt ';
      was = 'die Stadt';
      headline += data.name + ':'
    }

    // Rückgang oder Anstieg 2005-2015
    if (data.shopChgPrc == 0) {

      paragraph += ' ist der Einzelhandel in den vergangenen zehn Jahren gleich geblieben.';
      headline += ' Einzelhandel stabil';

    } else if (data.shopChgPrc < 0) {

      paragraph += ' ist der Einzelhandel in den vergangenen zehn Jahren' + (getWrittenPcg(data.shopChgPrc) === 'leicht' ? ' ' : ' um ') +  getWrittenPcg(data.shopChgPrc) + ' zurückgegangen. Heute gibt es ' + wo + ' ' + getDigitStr(-data.shopChgAbs) + ' Geschäfte weniger als noch im Jahr 2005.';
      headline += ((data.shopChgPrc < -15) ? 'Deutlich w' : 'W') + 'eniger Geschäfte';

    }

    if (data.shopChgPrc > 0) {

      paragraph += ' ist der Einzelhandel in den vergangenen zehn Jahren' + (getWrittenPcg(data.shopChgPrc) === 'leicht' ? ' ' : ' um ') + getWrittenPcg(data.shopChgPrc) +  ' gewachsen. Heute gibt es ' + wo + ' ' + getDigitStr(data.shopChgAbs) + ' Geschäft' + ((data.shopChgAbs == 1) ? ' ' : 'e ') + 'mehr als noch im Jahr 2005.';
      headline += ' Einzelhandel wächst' + ((data.shopChgPrc > 15) ? ' deutlich' : '');
    }

    if (data.shopChgPrc > 0 && data.lastShopDeltaPrc >= 5 || data.shopChgPrc < 0 && data.lastShopDeltaPrc <= 5) {

      paragraph += ' Allein im Vergleich zur letzten Erhebung 2014 sind ' + getDigitStr(Math.abs(data.lastShopDeltaAbs)) + ' Läden ' + ((data.lastShopDeltaAbs > 0) ? 'hinzugekommen.' : 'weggefallen.')
    }

    // Rückgang oder Anstieg der Ladenfläche
    if (data.shopChgPrc < 0 && data.spaceChgPrc > 0) {
      paragraph += ' Gleichzeitig hat die durchschnittliche Verkaufsfläche der Geschäfte hier ' + (getWrittenPcg(data.spaceChgPrc) === 'leicht' ? ' ' : 'um ') + getWrittenPcg(data.spaceChgPrc) + ' zugenommen. Das deutet darauf hin, dass kleinere Läden verschwunden sind, während sich größere Märkte gehalten oder sogar neu eröffnet haben.';     
      } else if (data.shopChgPrc < 0 && data.spaceChgPrc < 0) {
        paragraph += ' Gleichzeitig hat auch die durchschnittliche Verkaufsfläche der Geschäfte abgenommen. Das deutet darauf hin, dass größere Märkte geschlossen haben, während sich kleinere Läden gehalten haben.';
      }

    if (data.type === 'Stadt' && data.popChange > 0) {
      paragraph += ' Wie die meisten kreisfreien Städte in Bayern wächst auch ' + data.name + ".";
    }

    if (data.nogroceryCount > 1) {
      paragraph += ' In ' + getDigitStr(data.nogroceryCount) + ' Orten ' + wo + ' gibt es' + ((data.shopChgPrc > 15) ? ' dennoch ' : '') + ' kein Lebensmittelgeschäft';
      if (data.noshopCount > 1) {
        paragraph += '. ' + ((data.nogroceryCount === data.noshopCount) ? 'Die Orte ' : capitalizeFirstLetter(getDigitStr(data.noshopCount)) + ' davon ') + 'gelten';
      } else if (data.noshopCount == 1) {
        paragraph += ', einer davon gilt';
      }
      if (data.noshopCount > 0) {
        paragraph += ' sogar als unversorgt, das heißt es ist nicht einmal ein Bäcker oder Metzger im Ort';
      }
      paragraph += '.';
    }

    if (data.nogroceryCount == 1) {
      paragraph += ' In einem Ort ' + wo + ' gibt es kein Lebensmittelgeschäft' + ((data.noshopCount == 1) ? ', der Ort gilt als unversorgt, das heißt es ist nicht einmal ein Bäcker oder Metzger im Ort' : '') + '.';
    }

    paragraph += ' Die Zahlen beruhen auf Erhebungen der Staatsregierung.';

    if (data.dorfladen == 1) {

      paragraph += ' Es gibt einen Dorfladen ' + wo + ', in ' + data.dl1 + '.';
    } else if (data.dorfladen == 2) {

      paragraph += ' Es gibt zwei Dorfläden ' + wo + ' ' + getShortName(data) + ': In ' + data.dl1 + ' und ' + data.dl2 +'.';
    } else if (data.dorfladen == 3) {

      paragraph += ' Es gibt drei Dorfläden ' + wo + ' ' + getShortName(data) + ': In ' + data.dl1 + ', ' + data.dl2 + ' und ' + data.dl3 +'.';
    } else if (data.dorfladen > 3) {

      paragraph += ' Es gibt ' + getDigitStr(data.dorfladen) + ' Dorfläden ' + wo + ' ' + getShortName(data) + '. Der Landkreis nimmt damit in Bayern eine Vorreiterrolle ein.';
    }

    return '<h3>' + headline + '</h3> <p>' + paragraph + '</p>';
  }

  // Export global functions
  return {
    init: init,
    render: render
  };
})();
