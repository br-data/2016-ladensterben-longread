var text = (function() {

  var textContainer;

  function init() {

    textContainer = document.getElementById('text');

    render();
  }

  function render(data) {

    data = data || {
      'govDistrict': 'Oberfranken',
      'name': 'Wunsiedel im Fichtelgebirge',
      'shortName': 'Wunsiedel',
      'type': 'Landkreis',
      'sch': 9479,
      'pop14': 73403,
      'pop05': 81631,
      'popDeltaPrc': -10.07950411,
      'shop05': 57,
      'shops14': 41,
      'shops15': 40,
      'lastShopDeltaAbs': -1,
      'lastShopDeltaPrc': -2.43902439,
      'space05': 689,
      'space15': 859,
      'workers07': 143,
      'workers15': 160,
      'shopDeltaAbs': -17,
      'shopDeltaPrc': -29.8245614,
      'spaceDeltaAbs': 170,
      'spaceDeltaPrc': 24.67343977,
      'noGrocery': 3,
      'noShop': 0,
      'ruralStoreCount': 3,
      'ruralStoreNames': 'Hofstädten, Kleinkahl, Wiesen',
      'biggestChain': 'Edeka',
      'biggestChainCount': 18,
      'chainDeltaAbs': 11,
      'chainDeltaPrc': 61.11111111,
      'chainDeltaFctr': 2.571428571
    };

    textContainer.innerHTML = getString(data);
  }

  function getString(data) {

    var headline = '', paragraph = '', was = '', wo = '', prefix = '';

    if (data.govDistrict === 'Oberpfalz') {

      prefix = ' der';
    }

    // Landkreis oder Stadt?
    if (data.type === 'Landkreis') {

      paragraph += 'Im ' + getgovDistrictAdj(data.govDistrict) + 'en <strong>Landkreis ' + data.name + '</strong>';
      wo = ' im Landkreis';
      was = 'der Landkreis';
      headline += 'Landkreis ' + data.name + ': ';
    } else if (data.type === 'Stadt') {

      paragraph += 'In <strong>' + data.name + '</strong>';
      wo = 'in der Stadt ';
      was = 'die Stadt';
      headline += data.name + ': ';
    }

    // Rückgang oder Anstieg 2005-2015
    if (data.shopDeltaPrc == 0) {

      paragraph += ' ist der Einzelhandel in den vergangenen zehn Jahren gleich geblieben.';
      headline += ' Einzelhandel stabil';

    } else if (data.shopDeltaPrc < 0) {

      paragraph += ' ist der Einzelhandel in den vergangenen zehn Jahren' + (getWrittenPcg(data.shopDeltaPrc) === 'leicht' ? ' ' : ' um ') +  getWrittenPcg(data.shopDeltaPrc) + ' zurückgegangen. Heute gibt es ' + wo + ' ' + getDigitStr(-data.shopDeltaAbs) + ' Geschäft' + ((data.shopDeltaAbs == -1) ? ' ' : 'e ') + 'weniger als noch im Jahr 2005.';
      headline += ((data.shopDeltaPrc < -15) ? 'Deutlich w' : 'W') + 'eniger Geschäfte';
    }

    if (data.shopDeltaPrc > 0) {

      paragraph += ' ist der Einzelhandel in den vergangenen zehn Jahren' + (getWrittenPcg(data.shopDeltaPrc) === 'leicht' ? ' ' : ' um ') + getWrittenPcg(data.shopDeltaPrc) +  ' gewachsen. Heute gibt es ' + wo + ' ' + getDigitStr(data.shopDeltaAbs) + ' Geschäft' + ((data.shopDeltaAbs == 1) ? ' ' : 'e ') + 'mehr als noch im Jahr 2005.';
      headline += ' Einzelhandel wächst' + ((data.shopDeltaPrc >= 10) ? ' deutlich' : '');
    }

    if (data.shopDeltaPrc > 0 && data.lastShopDeltaPrc >= 5 || data.shopDeltaPrc < 0 && data.lastShopDeltaPrc <= -5) {

      paragraph += ' Allein im Vergleich zur letzten Erhebung 2014 sind ' + getDigitStr(Math.abs(data.lastShopDeltaAbs)) + ' Läden ' + ((data.lastShopDeltaAbs > 0) ? 'hinzugekommen.' : 'weggefallen.');
    }

    // Rückgang oder Anstieg der Ladenfläche
    if (data.shopDeltaPrc < 0 && data.spaceDeltaPrc > 0) {

      paragraph += ' Gleichzeitig hat die durchschnittliche Verkaufsfläche der Geschäfte hier ' + (getWrittenPcg(data.spaceDeltaPrc) === 'leicht' ? ' ' : 'um ') + getWrittenPcg(data.spaceDeltaPrc) + ' zugenommen. Das deutet darauf hin, dass kleinere Läden verschwunden sind, während sich größere Märkte gehalten oder sogar neu eröffnet haben.';
    } else if (data.shopDeltaPrc < 0 && data.spaceDeltaPrc < 0) {

      paragraph += ' Gleichzeitig hat auch die durchschnittliche Verkaufsfläche der Geschäfte abgenommen. Das deutet darauf hin, dass größere Märkte geschlossen haben, während sich kleinere Läden gehalten haben.';
    }

    paragraph += ' Marktführer ' + wo + ((data.chainDeltaFctr === 1) ? ' sind ' : ' ist ') + ((data.chainDeltaFctr > 2) ? 'mit deutlichem Abstand ' : ' ') + data.biggestChain + ', mit ' + ((data.chainDeltaFctr === 1) ? 'jeweils ' : 'insgesamt ') + getDigitStr(data.biggestChainCount) + ' Filialen.';

    if (data.type === 'Stadt' && data.popDeltaPrc > 0) {

      paragraph += ' Wie die meisten kreisfreien Städte in Bayern wächst auch ' + data.name + '.';
    }

    if (data.noGrocery > 1) {

      paragraph += ' In ' + getDigitStr(data.noGrocery) + ' Orten ' + wo + ' gibt es' + ((data.shopDeltaPrc > 15) ? ' dennoch ' : '') + ' kein Lebensmittelgeschäft';

      if (data.noShop > 1) {

        paragraph += '. ' + ((data.noGrocery === data.noShop) ? 'Die Orte ' : capitalizeFirstLetter(getDigitStr(data.noShop)) + ' davon ') + 'gelten';
      } else if (data.noShop == 1) {

        paragraph += ', einer davon gilt';
      }

      if (data.noShop > 0) {

        paragraph += ' sogar als unversorgt, das heißt es ist nicht einmal ein Bäcker oder Metzger im Ort';
      }

      paragraph += '.';
    }

    if (data.noGrocery == 1) {

      paragraph += ' In einem Ort ' + wo + ' gibt es kein Lebensmittelgeschäft' + ((data.noShop == 1) ? ', der Ort gilt als unversorgt, das heißt es ist nicht einmal ein Bäcker oder Metzger im Ort' : '') + '.';
    }

    paragraph += ' Die Zahlen beruhen auf Erhebungen der Staatsregierung.';

    if (data.ruralStoreCount) {

      var stores = data.ruralStoreNames.split(', ');

      if (data.ruralStoreCount == 1) {

        paragraph += ' Es gibt einen Dorfladen ' + wo + ', in ' + stores[0] + '.';
      } else if (data.ruralStoreCount == 2) {

        paragraph += ' Es gibt zwei Dorfläden ' + wo + ' ' + getShortName(data) + ': In ' + stores[0] + ' und ' + stores[1] +'.';
      } else if (data.ruralStoreCount == 3) {

        paragraph += ' Es gibt drei Dorfläden ' + wo + ' ' + getShortName(data) + ': In ' + stores[0] + ', ' + stores[1] + ' und ' + stores[2] +'.';
      } else if (data.ruralStoreCount > 3) {

        paragraph += ' Es gibt ' + getDigitStr(data.ruralStoreCount) + ' Dorfläden ' + wo + ' ' + getShortName(data) + '. Der Landkreis nimmt damit in Bayern eine Vorreiterrolle ein.';
      }
    }

    return '<h3>' + headline + '</h3> <p>' + paragraph + '</p>';
  }

  function getDigitStr(dig) {

    var array = ['kein', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf'];

    return array[dig] || dig;
  }

  function getShortName(data) {

    return data.shortName || data.name;
  }

  function capitalizeFirstLetter(string) {

    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function getgovDistrictAdj(data) {

    var result;

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

      result = 'leicht';
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

      result = getDigitStr(Math.round(pcg)) + ' Prozent ';
    }

    return result;
  }

  // Export global functions
  return {
    init: init,
    render: render
  };
})();
