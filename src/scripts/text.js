var text = (function() {

  var textContainer;

  function init() {

    textContainer = document.getElementById('text');

    render();
  }

  function render(data) {

    data = data ||   {
      'govDistrict': 'Oberfranken',
      'admDistrict': 'Wunsiedel im Fichtelgebirge',
      'admDistrictShort': 'Wunsiedel',
      'districtType': 'Landkreis',
      'id': '09479',
      'pop2014': 73403,
      'pop2005': 81631,
      'shopCount2005': 57,
      'shopCount2015': 40,
      'salesArea2005': 689,
      'salesArea2015': 859,
      'employees2007': 143,
      'employees2015': 160,
      'popDeltaAbs': -8228,
      'popDeltaPrc': -10.08,
      'shopCountDeltaAbs': -17,
      'shopCountDeltaPrc': -29.82,
      'salesAreaDeltaAbs': 170,
      'salesAreaDeltaPrc': 24.67,
      'employeesDeltaAbs': 17,
      'employeesDeltaPrc': 11.89,
      'shopCount2014': 41,
      'lastShopCountDeltaAbs': -1,
      'lastShopCountDeltaPrc': -2,
      'noSupermarketCount': 3,
      'noStoreCount': 0,
      'ruralStoresNames': '',
      'ruralStoresCount': 0,
      'biggestChain': 'Edeka',
      'biggestChainCount': 18,
      'biggestChainDeltaAbs': 11,
      'biggestChainDeltaPrc': 61.11,
      'biggestChainDeltaFctr': 2.57
    };

    textContainer.innerHTML = getString(data);
  }

  function getString(data) {

    var headline = '', paragraph = '', was = '', wo = '', prefix = '';

    if (data.govDistrict === 'Oberpfalz') {

      prefix = ' der';
    }

    // Landkreis oder Stadt?
    if (data.districtType === 'Landkreis') {

      paragraph += 'Im ' + getgovDistrictAdj(data.govDistrict) + 'en <strong>Landkreis ' + data.admDistrict + '</strong>';
      wo = ' im Landkreis';
      was = 'der Landkreis';
      headline += 'Landkreis ' + data.admDistrict + ': ';
    } else if (data.districtType === 'Stadt') {

      paragraph += 'In <strong>' + data.admDistrict + '</strong>';
      wo = 'in der Stadt ';
      was = 'die Stadt';
      headline += data.admDistrict + ': ';
    }

    // Rückgang oder Anstieg 2005-2015
    if (data.shopCountDeltaPrc === 0) {

      paragraph += ' ist der Einzelhandel in den vergangenen zehn Jahren gleich geblieben.';
      headline += ' Einzelhandel stabil';

    } else if (data.shopCountDeltaPrc < 0) {

      paragraph += ' ist der Einzelhandel in den vergangenen zehn Jahren' + (getWrittenPcg(data.shopCountDeltaPrc) === 'leicht' ? ' ' : ' um ') +  getWrittenPcg(data.shopCountDeltaPrc) + ' zurückgegangen. Heute gibt es ' + wo + ' ' + getDigitStr(-data.shopCountDeltaAbs) + ' Geschäft' + ((data.shopCountDeltaAbs == -1) ? ' ' : 'e ') + 'weniger als noch im Jahr 2005.';
      headline += ((data.shopCountDeltaPrc < -15) ? 'Deutlich w' : 'W') + 'eniger Geschäfte';
    }

    if (data.shopCountDeltaPrc > 0) {

      paragraph += ' ist der Einzelhandel in den vergangenen zehn Jahren' + (getWrittenPcg(data.shopCountDeltaPrc) === 'leicht' ? ' ' : ' um ') + getWrittenPcg(data.shopCountDeltaPrc) +  ' gewachsen. Heute gibt es ' + wo + ' ' + getDigitStr(data.shopCountDeltaAbs) + ' Geschäft' + ((data.shopCountDeltaAbs == 1) ? ' ' : 'e ') + 'mehr als noch im Jahr 2005.';
      headline += ' Einzelhandel wächst' + ((data.shopCountDeltaPrc >= 10) ? ' deutlich' : '');
    }

    if (data.shopCountDeltaPrc > 0 && data.lastShopCountDeltaPrc >= 5 || data.shopCountDeltaPrc < 0 && data.lastShopCountDeltaPrc <= -5) {

      paragraph += ' Allein im Vergleich zur letzten Erhebung 2014 sind ' + getDigitStr(Math.abs(data.lastShopCountDeltaAbs)) + ' Läden ' + ((data.lastShopCountDeltaAbs > 0) ? 'hinzugekommen.' : 'weggefallen.');
    }

    // Rückgang oder Anstieg der Ladenfläche
    if (data.shopCountDeltaPrc < 0 && data.salesAreaDeltaPrc > 0) {

      paragraph += ' Gleichzeitig hat die durchschnittliche Verkaufsfläche der Geschäfte hier ' + (getWrittenPcg(data.salesAreaDeltaPrc) === 'leicht' ? ' ' : 'um ') + getWrittenPcg(data.salesAreaDeltaPrc) + ' zugenommen. Das deutet darauf hin, dass kleinere Läden verschwunden sind, während sich größere Märkte gehalten oder sogar neu eröffnet haben.';
    } else if (data.shopCountDeltaPrc < 0 && data.salesAreaDeltaPrc < 0) {

      paragraph += ' Gleichzeitig hat auch die durchschnittliche Verkaufsfläche der Geschäfte abgenommen. Das deutet darauf hin, dass größere Märkte geschlossen haben, während sich kleinere Läden gehalten haben.';
    }

    paragraph += ' Marktführer ' + wo + ' ist ' + ((data.biggestChainDeltaFctr > 2) ? 'mit deutlichem Abstand ' : ' ') + data.biggestChain + ', mit insgesamt ' + data.biggestChainCount + ' Filialen.';

    if (data.districtType === 'Stadt' && data.popDeltaPrc > 0) {

      paragraph += ' Wie die meisten kreisfreien Städte in Bayern wächst auch ' + data.admDistrict + '.';
    }

    if (data.noStoreCount > 1) {

      paragraph += ' In ' + getDigitStr(data.noStoreCount) + ' Orten ' + wo + ' gibt es' + ((data.shopCountDeltaPrc > 15) ? ' dennoch ' : '') + ' kein Lebensmittelgeschäft';

      if (data.noSupermarketCount > 1) {

        paragraph += '. ' + ((data.noStoreCount === data.noSupermarketCount) ? 'Die Orte ' : capitalizeFirstLetter(getDigitStr(data.noSupermarketCount)) + ' davon ') + 'gelten';
      } else if (data.noSupermarketCount == 1) {

        paragraph += ', einer davon gilt';
      }

      if (data.noSupermarketCount > 0) {

        paragraph += ' sogar als unversorgt, das heißt es ist nicht einmal ein Bäcker oder Metzger im Ort';
      }

      paragraph += '.';
    }

    if (data.noStoreCount == 1) {

      paragraph += ' In einem Ort ' + wo + ' gibt es kein Lebensmittelgeschäft' + ((data.noSupermarketCount == 1) ? ', der Ort gilt als unversorgt, das heißt es ist nicht einmal ein Bäcker oder Metzger im Ort' : '') + '.';
    }

    paragraph += ' Die Zahlen beruhen auf Erhebungen der Staatsregierung.';

    if (data.ruralStoresCount) {

      var stores = data.ruralStoresNames.split(', ');

      if (data.ruralStoresCount == 1) {

        paragraph += ' Es gibt einen Dorfladen ' + wo + ', in ' + stores[0] + '.';
      } else if (data.ruralStoresCount == 2) {

        paragraph += ' Es gibt zwei Dorfläden ' + wo + ' ' + getShortName(data) + ': In ' + stores[0] + ' und ' + stores[1] +'.';
      } else if (data.ruralStoresCount == 3) {

        paragraph += ' Es gibt drei Dorfläden ' + wo + ' ' + getShortName(data) + ': In ' + stores[0] + ', ' + stores[1] + ' und ' + stores[2] +'.';
      } else if (data.ruralStoresCount > 3) {

        paragraph += ' Es gibt ' + getDigitStr(data.ruralStoresCount) + ' Dorfläden ' + wo + ' ' + getShortName(data) + '. Der Landkreis nimmt damit in Bayern eine Vorreiterrolle ein.';
      }
    }

    return '<h3>' + headline + '</h3> <p>' + paragraph + '</p>';
  }

  function getDigitStr(dig) {

    var array = ['kein', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf'];

    return array[dig] || dig;
  }

  function getShortName(data) {

    return data.shortName || data.admDistrict;
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
