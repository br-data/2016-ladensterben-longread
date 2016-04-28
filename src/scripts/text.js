var text = (function() {

  var textContainer, districtData;

  function init(data) {

    textContainer = document.getElementById('text');

    districtData = data;

    // Set the default district
    render('09475');
  }

  function render(currentDistrict, scale) {

    currentDistrict = getDistrictById(currentDistrict);
    scale = scale || [-37.14, -27.92, -18.7, -9.479999999999997, -0.259999999999998, 8.96, 18.180000000000007];

    textContainer.innerHTML = getString(currentDistrict, scale);
  }

  function getString(currentDistrict, scale) {

    var relatedDistrict = getDistrictById(currentDistrict.relatedDistrictId);

     var headline = '', paragraph = '', was = '', wo = '', prefix = '';

    if (currentDistrict.govDistrict === 'Oberpfalz') {

      prefix = ' der';
    }

    // Administrative district or city?
    if (currentDistrict.districtType === 'Landkreis') {

      paragraph += 'Im ' + getDistrictAdj(currentDistrict.govDistrict) + 'en <strong>Landkreis ' + currentDistrict.admDistrict + '</strong>';
      wo = ' im Landkreis';
      was = 'der Landkreis';
      headline += 'Landkreis ' + currentDistrict.admDistrict + ': ';
    } else if (currentDistrict.districtType === 'Stadt') {

      paragraph += 'In <strong>' + currentDistrict.admDistrict + '</strong>';
      wo = 'in der Stadt ';
      was = 'die Stadt';
      headline += currentDistrict.admDistrict + ': ';
    }

    // Compare values 2005-2015
    if (currentDistrict.shopCountDeltaPrc === 0) {

      paragraph += ' ist der Einzelhandel in den vergangenen zehn Jahren gleich geblieben.';
      headline += ' Einzelhandel stabil';

    } else if (currentDistrict.shopCountDeltaPrc < 0) {

      paragraph += ' ist der Einzelhandel in den vergangenen zehn Jahren' + (getWrittenPcg(currentDistrict.shopCountDeltaPrc) === 'leicht' ? ' ' : ' um ') +  getWrittenPcg(currentDistrict.shopCountDeltaPrc) + ' zurückgegangen. Heute gibt es hier ' + getDigitStr(-currentDistrict.shopCountDeltaAbs) + ' Geschäft' + ((currentDistrict.shopCountDeltaAbs === -1) ? ' ' : 'e ') + 'weniger als noch im Jahr 2005.';
      headline += ((currentDistrict.shopCountDeltaPrc < -15) ? 'Deutlich w' : 'W') + 'eniger Geschäfte';
    }

    if (currentDistrict.shopCountDeltaPrc > 0) {

      paragraph += ' ist der Einzelhandel in den vergangenen zehn Jahren' + (getWrittenPcg(currentDistrict.shopCountDeltaPrc) === 'leicht' ? ' ' : ' um ') + getWrittenPcg(currentDistrict.shopCountDeltaPrc) +  ' gewachsen. Heute gibt es hier ' + getDigitStr(currentDistrict.shopCountDeltaAbs) + ' Geschäft' + ((currentDistrict.shopCountDeltaAbs === 1) ? ' ' : 'e ') + 'mehr als noch im Jahr 2005.';
      headline += ' Einzelhandel wächst' + ((currentDistrict.shopCountDeltaPrc >= 10) ? ' deutlich' : '');
    }

    //Compare to 2015 to 2014 values, mention only if big difference

    if (currentDistrict.shopCountDeltaPrc > 0 && currentDistrict.lastShopCountDeltaPrc >= 5 || currentDistrict.shopCountDeltaPrc < 0 && currentDistrict.lastShopCountDeltaPrc <= -5) {

      paragraph += ' Allein im Vergleich zur letzten Erhebung 2014 sind ' + getDigitStr(Math.abs(currentDistrict.lastShopCountDeltaAbs)) + ' Läden ' + ((currentDistrict.lastShopCountDeltaAbs > 0) ? 'hinzugekommen.' : 'weggefallen.');
    }


    //Get category and interpret it

    paragraph += ' '

    if (getCategory(currentDistrict.shopCountDeltaPrc, scale) === 0) {
      paragraph += capitalizeFirstLetter(was) + ' ist damit ' + ((currentDistrict.shopCountDeltaPrc === scale[0]) ? '' : ' mit ') + ' am stärksten vom Ladensterben betroffen. '
    } else if (getCategory(currentDistrict.shopCountDeltaPrc, scale) === 1 || getCategory(currentDistrict.shopCountDeltaPrc, scale) === 2) {
      paragraph += capitalizeFirstLetter(was) + ' ist damit ' + ((getCategory(currentDistrict.shopCountDeltaPrc, scale) === 1) ? ' deutlich ' : ' ') + 'stärker vom Ladensterben betroffen als andere Landkreise und kreisfreien Städte. '
    } else if (getCategory(currentDistrict.shopCountDeltaPrc, scale) === 3) {
      paragraph +=  capitalizeFirstLetter(was) + ' ist damit weniger stark vom Ladensterben betroffen als andere Landkreise und kreisfreien Städte.'
    } else if (getCategory(currentDistrict.shopCountDeltaPrc, scale) === 4 || getCategory(currentDistrict.shopCountDeltaPrc, scale) === 5) {
      paragraph += capitalizeFirstLetter(wo) + ' ist die Nahversorgungssituation damit' + ((getCategory(currentDistrict.shopCountDeltaPrc, scale) === 5) ? ' deutlich ' : ' ' ) + 'besser als im Rest des Freistaats.'
    }

    // Rückgang oder Anstieg der Ladenfläche
    if (currentDistrict.shopCountDeltaPrc < 0 && currentDistrict.salesAreaDeltaPrc > 0) {

      paragraph += ' Gleichzeitig hat die durchschnittliche Verkaufsfläche der Geschäfte hier ' + (getWrittenPcg(currentDistrict.salesAreaDeltaPrc) === 'leicht' ? ' ' : 'um ') + getWrittenPcg(currentDistrict.salesAreaDeltaPrc) + ' zugenommen. Das deutet darauf hin, dass kleinere Läden verschwunden sind, während sich größere Märkte gehalten oder sogar neu eröffnet haben.';
    } else if (currentDistrict.shopCountDeltaPrc < 0 && currentDistrict.salesAreaDeltaPrc < 0) {

      paragraph += ' Gleichzeitig hat auch die durchschnittliche Verkaufsfläche der Geschäfte abgenommen. Das deutet darauf hin, dass größere Märkte geschlossen haben, während sich kleinere Läden gehalten haben.';
    }

    paragraph += ' Marktführer ' + wo + ((currentDistrict.biggestChainDeltaFctr === 1) ? ' sind ' : ' ist ') + ((currentDistrict.biggestChainDeltaFctr > 2) ? 'mit deutlichem Abstand ' : ' ') + currentDistrict.biggestChain + ', mit ' + ((currentDistrict.biggestChainDeltaFctr === 1) ? 'jeweils ' : 'insgesamt ') + getDigitStr(currentDistrict.biggestChainCount) + ' Filialen.';

    if (currentDistrict.districtType === 'Stadt' && currentDistrict.popDeltaPrc > 0) {

      paragraph += ' Wie die meisten kreisfreien Städte in Bayern wächst auch ' + currentDistrict.admDistrict + '.';
    }

    if (currentDistrict.noStoreCount > 1) {

      paragraph += ' In ' + getDigitStr(currentDistrict.noStoreCount) + ' Orten ' + wo + ' gibt es' + ((currentDistrict.shopCountDeltaPrc > 15) ? ' dennoch ' : '') + ' kein Lebensmittelgeschäft';

      if (currentDistrict.noSupermarketCount > 1) {

        paragraph += '. ' + ((currentDistrict.noStoreCount === currentDistrict.noSupermarketCount) ? 'Die Orte ' : capitalizeFirstLetter(getDigitStr(currentDistrict.noSupermarketCount)) + ' davon ') + 'gelten';
      } else if (currentDistrict.noSupermarketCount === 1) {

        paragraph += ', einer davon gilt';
      }

      if (currentDistrict.noSupermarketCount > 0) {

        paragraph += ' sogar als unversorgt, das heißt es ist nicht einmal ein Bäcker oder Metzger im Ort';
      }

      paragraph += '.';
    }

    if (currentDistrict.noStoreCount === 1) {

      paragraph += ' In einem Ort ' + wo + ' gibt es kein Lebensmittelgeschäft' + ((currentDistrict.noSupermarketCount === 1) ? ', der Ort gilt als unversorgt, das heißt es ist nicht einmal ein Bäcker oder Metzger im Ort' : '') + '.';
    }

    paragraph += ' Die Zahlen beruhen auf Erhebungen der Staatsregierung.';

    if (currentDistrict.ruralStoresCount) {

      var stores = currentDistrict.ruralStoresNames.split(', ');

      if (currentDistrict.ruralStoresCount === 1) {

        paragraph += ' Es gibt einen Dorfladen ' + wo + ', in ' + stores[0] + '.';
      } else if (currentDistrict.ruralStoresCount === 2) {

        paragraph += ' Es gibt zwei Dorfläden ' + wo + ' ' + getShortName(currentDistrict) + ': In ' + stores[0] + ' und ' + stores[1] +'.';
      } else if (currentDistrict.ruralStoresCount === 3) {

        paragraph += ' Es gibt drei Dorfläden ' + wo + ' ' + getShortName(currentDistrict) + ': In ' + stores[0] + ', ' + stores[1] + ' und ' + stores[2] +'.';
      } else if (currentDistrict.ruralStoresCount > 3) {

        paragraph += ' Es gibt ' + getDigitStr(currentDistrict.ruralStoresCount) + ' Dorfläden ' + wo + ' ' + getShortName(currentDistrict) + '. Der Landkreis nimmt damit in Bayern eine Vorreiterrolle ein.';
      }
    }

    console.log(relatedDistrict)

    return '<h3>' + headline + '</h3> <p>' + paragraph + '</p>';
  }

  function getDigitStr(dig) {

    var array = ['kein', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf'];

    return array[dig] || dig.toString();
  }

  function getShortName(currentDistrict) {

    return currentDistrict.shortName || currentDistrict.admDistrict;
  }

  function capitalizeFirstLetter(string) {

    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function getDistrictAdj(currentDistrict) {

    var result;

    if (currentDistrict == 'Oberbayern') {

      result = 'oberbayerisch';
    } else if (currentDistrict == 'Oberpfalz') {

      result = 'oberpfälzisch';
    } else if (currentDistrict == 'Oberfranken') {

      result = 'oberfränkisch';
    } else if (currentDistrict == 'Unterfranken') {

      result = 'unterfränkisch';
    } else if (currentDistrict == 'Mittelfranken') {

      result = 'mittelfränkisch';
    } else if (currentDistrict == 'Schwaben') {

      result = 'schwäbisch';
    } else if (currentDistrict == 'Niederbayern') {

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

  function getDistrictById(id) {

    return districtData.filter(function (element) {

      return element.id === id;
    })[0];
  }

  function getCategory(value, scale) {

    for (var i = 0; i <= scale.length; i++) {

      if (value <= scale[i+1]) {

        return i;
      }
    }
  }

  // Export global functions
  return {
    init: init,
    render: render
  };
})();
