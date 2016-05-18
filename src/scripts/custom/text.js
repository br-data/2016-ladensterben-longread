var text = (function() {

  var $textContainer, $embedContainer, $embedCode, $embedButton, $textHighlight, districtData, scale;

  function init(data, range) {

    $textContainer = document.getElementById('text');

    $embedContainer = document.getElementById('embed-container');
    $embedCode = document.querySelector('pre');
    $embedButton = document.getElementById('embed-button');
    $textHighlight = document.getElementById('text-highlight');

    $embedButton.addEventListener('click', function () {

      modal.open($embedContainer);
    });

    $embedCode.addEventListener('mousewheel', utils.preventPageScoll);
    $embedCode.addEventListener('click', utils.selectText);

    scale = range;
    districtData = data;
  }

  function render(currentDistrict, currentText) {

    currentDistrict = getDistrictById(currentDistrict);
    currentText = getText(currentDistrict, scale);

    $textContainer.innerHTML = currentText;
    $embedCode.textContent = getEmbedCode(currentText);

    highlightText();
  }

  function getText(currentDistrict, scale) {

    var relatedDistrict = getDistrictById(currentDistrict.relatedDistrictId);
    var headline = '', paragraph = '', theCurrentDistrict = '', inCurrentDistrict = '', prefix = '';

    if (currentDistrict.govDistrict === 'Oberpfalz') {

      prefix = ' der';
    }

    if (currentDistrict.districtType === 'Landkreis') {

      paragraph += 'Im ' + getDistrictAdj(currentDistrict.govDistrict) + 'en <strong>Landkreis ' + currentDistrict.admDistrict + '</strong>';
      inCurrentDistrict = 'im Landkreis';
      theCurrentDistrict = 'der Landkreis';
      headline += 'Landkreis ' + currentDistrict.admDistrict + ':<br> ';
    } else if (currentDistrict.districtType === 'Stadt') {

      paragraph += 'In <strong>' + currentDistrict.admDistrict + '</strong>';
      inCurrentDistrict = 'in der Stadt ';
      theCurrentDistrict = 'die Stadt';
      headline += currentDistrict.admDistrict + ':<br> ';
    }

    if (currentDistrict.shopCountDeltaPrc === 0) {

      paragraph += ' ist die Zahl der Lebensmittelgeschäfte in den vergangenen zehn Jahren gleich geblieben.';
      headline += ' Einzelhandel stabil';

    } else if (currentDistrict.shopCountDeltaPrc < 0) {

      paragraph += ' ist die Zahl der Lebensmittelgeschäfte in den vergangenen zehn Jahren' + (getWrittenPcg(currentDistrict.shopCountDeltaPrc) === 'leicht' ? ' ' : ' um ') +  getWrittenPcg(currentDistrict.shopCountDeltaPrc) + ' zurückgegangen' + ((currentDistrict.popDeltaPrc < 0) ? '. Auch die Einwohnerzahl hat abgenommen.' : ', obwohl die Einwohnerzahl zugenommen hat.') + ' Heute gibt es hier ' + getDigitStr(-currentDistrict.shopCountDeltaAbs) + ' Geschäft' + ((currentDistrict.shopCountDeltaAbs === -1) ? ' ' : 'e ') + 'weniger als im Jahr 2005.';
      headline += ((currentDistrict.shopCountDeltaPrc < -15) ? 'Deutlich w' : 'W') + 'eniger Geschäfte';
    }

    if (currentDistrict.shopCountDeltaPrc > 0) {

      paragraph += ' ist die Zahl der Lebensmittelgeschäfte in den vergangenen zehn Jahren' + (getWrittenPcg(currentDistrict.shopCountDeltaPrc) === 'leicht' ? ' ' : ' um ') + getWrittenPcg(currentDistrict.shopCountDeltaPrc) +  ' gewachsen' + ((currentDistrict.popDeltaPrc > 0) ? '. Auch die Einwohnerzahl hat zugenommen.' : ', obwohl die Einwohnerzahl abgenommen hat.') + ' Heute gibt es hier ' + getDigitStr(currentDistrict.shopCountDeltaAbs) + ' Geschäft' + ((currentDistrict.shopCountDeltaAbs === 1) ? ' ' : 'e ') + 'mehr als im Jahr 2005.';
      headline += ((currentDistrict.shopCountDeltaPrc >= 10) ? ' Deutlich m' : 'M') + 'ehr Geschäfte';
    }


    //Compare to 2015 to 2014 values, mention only if big difference
    if (currentDistrict.shopCountDeltaPrc > 0 && currentDistrict.lastShopCountDeltaPrc >= 5 || currentDistrict.shopCountDeltaPrc < 0 && currentDistrict.lastShopCountDeltaPrc <= -5) {

      paragraph += ' Allein im Vergleich zur letzten Erhebung 2014 sind ' + getDigitStr(Math.abs(currentDistrict.lastShopCountDeltaAbs)) + ' Läden ' + ((currentDistrict.lastShopCountDeltaAbs > 0) ? 'hinzugekommen.' : 'weggefallen.');
    }


    //Get category and interpret it
    paragraph += ' ';

    if (getCategory(currentDistrict.shopCountDeltaPrc, scale) === 0) {

      paragraph += capitalizeFirstLetter(theCurrentDistrict) + ' ist damit ' + ((currentDistrict.shopCountDeltaPrc === scale[0]) ? '' : ' mit ') + ' am stärksten vom Ladensterben betroffen.';
    } else if (getCategory(currentDistrict.shopCountDeltaPrc, scale) === 1 || getCategory(currentDistrict.shopCountDeltaPrc, scale) === 2) {

      paragraph += capitalizeFirstLetter(theCurrentDistrict) + ' ist damit ' + ((getCategory(currentDistrict.shopCountDeltaPrc, scale) === 1) ? ' deutlich ' : ' ') + 'stärker vom Ladensterben betroffen als andere Landkreise und kreisfreien Städte.';
    } else if (getCategory(currentDistrict.shopCountDeltaPrc, scale) === 3) {

      paragraph +=  capitalizeFirstLetter(theCurrentDistrict) + ' ist damit weniger stark vom Ladensterben betroffen als andere Landkreise und kreisfreien Städte.';
    } else if (getCategory(currentDistrict.shopCountDeltaPrc, scale) === 4 || getCategory(currentDistrict.shopCountDeltaPrc, scale) === 5) {

      paragraph += capitalizeFirstLetter(inCurrentDistrict) + ' hat sich die Nahversorgungssituation damit' + ((getCategory(currentDistrict.shopCountDeltaPrc, scale) === 5) ? ' deutlich ' : ' ' ) + 'besser entwickelt als in den meisten Landkreisen und kreisfreien Städten in Bayern.';
    }


    // relatedDistrict
    if (relatedDistrict) {
      var inRelatedDistrict = '';
      var theRelatedDistrict = '';

      if (relatedDistrict.districtType === 'Stadt') {
        inRelatedDistrict = 'in der Stadt';
        theRelatedDistrict = 'die Stadt';

      } else if (relatedDistrict.districtType === 'Landkreis') {
        inRelatedDistrict = 'im umliegenden Landkreis';
        theRelatedDistrict = 'der Landkreis';
      }

      paragraph += ' ' + ((relatedDistrict.districtType === 'Stadt') ? 'In der' : 'Im') + ((relatedDistrict.admDistrict === currentDistrict.admDistrict) ? ' gleichnamigen ' : ' ') + relatedDistrict.districtType + ' ' + relatedDistrict.admDistrict + ((relatedDistrict.districtType === 'Landkreis') ? ', der die Stadt umgibt, ' : ', die vom Landkreis umschlossen ist, ');

      // the other district has a higher rate
      if (relatedDistrict.shopCountDeltaPrc > currentDistrict.shopCountDeltaPrc) {

        paragraph += ' sieht es ' + ((currentDistrict.shopCountDeltaPrc >= 0) ? '' : 'dagegen' ) + ' besser aus: Dort ist die Zahl der Läden';

        // ...and both are diminishing
        if (relatedDistrict.shopCountDeltaPrc < 0 && currentDistrict.shopCountDeltaPrc < 0) {

          paragraph += ' nicht ganz so stark zurückgegangen.' + ((relatedDistrict.districtType === 'Stadt') ? '' : '');
        // ...and the other one is growing while this one is diminishing
        } else if (relatedDistrict.shopCountDeltaPrc > 0 && currentDistrict.shopCountDeltaPrc < 0) {

          paragraph += ' gewachsen.';
        } else if (relatedDistrict.shopCountDeltaPrc === 0 && currentDistrict.shopCountDeltaPrc < 0) {

          paragraph += ' immerhin gleich geblieben.';
        }
      // the other district has a lower rate
      } else if (relatedDistrict.shopCountDeltaPrc < currentDistrict.shopCountDeltaPrc) {

        paragraph += ' sieht es ' + ((currentDistrict.shopCountDeltaPrc >= 0 && relatedDistrict.shopCountDeltaPrc < 0) ? 'dagegen' : '' ) + ' schlechter aus: Dort ist die Zahl der Läden';

        // ... but both are growing
        if (relatedDistrict.shopCountDeltaPrc > 0 && currentDistrict.shopCountDeltaPrc > 0) {

          paragraph += ' nicht ganz so stark gewachsen.' + ((relatedDistrict.districtType === 'Stadt') ? '' : '');
        // ... and the other one is diminishing while this one is growing
        } else if (relatedDistrict.shopCountDeltaPrc < 0 && currentDistrict.shopCountDeltaPrc >= 0) {

          paragraph += ' zurückgegangen.';
        // ...and both are diminishing
        } else if (relatedDistrict.shopCountDeltaPrc < 0 && currentDistrict.shopCountDeltaPrc < 0) {

          paragraph += ' noch stärker zurückgegangen.';
        //... this one is growing, the other one stays the same
        } else if (relatedDistrict.shopCountDeltaPrc === 0 && currentDistrict.shopCountDeltaPrc > 0) {

          paragraph += ' gleich geblieben.';
        }
      }
    }


    // Rückgang oder Anstieg der Ladenfläche
    if (currentDistrict.shopCountDeltaPrc < 0 && currentDistrict.salesAreaDeltaPrc > 0) {

      paragraph += ' Gleichzeitig werden die einzelnen Geschäfte ' + ((relatedDistrict) ? inCurrentDistrict + ' ' : 'hier ') + 'immer größer: Die durchschnittliche Verkaufsfläche pro Laden hat ' + (getWrittenPcg(currentDistrict.salesAreaDeltaPrc) === 'leicht' ? ' ' : 'um ') + getWrittenPcg(currentDistrict.salesAreaDeltaPrc) + ' zugenommen. Das deutet darauf hin, dass kleinere Läden verschwunden sind, während sich größere Märkte gehalten oder sogar neu eröffnet haben.';
    } else if (currentDistrict.shopCountDeltaPrc < 0 && currentDistrict.salesAreaDeltaPrc < 0) {

      paragraph += ' Gleichzeitig hat auch die durchschnittliche Verkaufsfläche der Geschäfte ' + ((relatedDistrict) ? inCurrentDistrict + ' ' : 'hier ') + 'abgenommen. Das deutet darauf hin, dass größere Märkte geschlossen haben, während sich kleinere Läden gehalten haben.';
    }

    paragraph += '</p></p> Marktführer ' + inCurrentDistrict + ' ' + currentDistrict.admDistrict + ((currentDistrict.biggestChainDeltaFctr === 1) ? ' sind ' : ' ist ') + ((currentDistrict.biggestChainDeltaFctr > 2) ? 'mit deutlichem Abstand ' : ' ') + currentDistrict.biggestChain + ' mit ' + ((currentDistrict.biggestChainDeltaFctr === 1) ? 'jeweils ' : 'insgesamt ') + getDigitStr(currentDistrict.biggestChainCount) + ' Filialen.';


    if (currentDistrict.districtType === 'Stadt' && currentDistrict.popDeltaPrc > 0) {

      paragraph += ' Wie die meisten kreisfreien Städte in Bayern wächst auch ' + currentDistrict.admDistrict + '.';
    }


    if (currentDistrict.noSupermarketCount > 1) {

      paragraph += ' In ' + getDigitStr(currentDistrict.noSupermarketCount) + ' Orten ' + inCurrentDistrict + ' gibt es' + ((currentDistrict.shopCountDeltaPrc > 15) ? ' dennoch ' : '') + ' kein Lebensmittelgeschäft';

      if (currentDistrict.noStoreCount > 1) {

        paragraph += '. ' + ((currentDistrict.noSupermarketCount === currentDistrict.noStoreCount) ? 'Die Orte ' : capitalizeFirstLetter(getDigitStr(currentDistrict.noStoreCount)) + ' davon ') + 'gelten';
      } else if (currentDistrict.noStoreCount === 1) {

        paragraph += ', einer davon gilt';
      }

      if (currentDistrict.noStoreCount > 0) {

        paragraph += ' sogar als unversorgt, das heißt es ist nicht einmal ein Bäcker oder Metzger im Ort';
      }

      paragraph += '.';
    }

    if (currentDistrict.noSupermarketCount === 1) {

      paragraph += ' In einem Ort ' + inCurrentDistrict + ' gibt es kein Lebensmittelgeschäft' + ((currentDistrict.noStoreCount === 1) ? ', der Ort gilt als unversorgt, das heißt es ist nicht einmal ein Bäcker oder Metzger im Ort' : '') + '.';
    }


    if (currentDistrict.ruralStoresCount) {

      var stores = currentDistrict.ruralStoresNames.split(', ');

      if (currentDistrict.noSupermarketCount > 1) {
        paragraph += ' Allerdings nehmen engagierte Bürger die Nahversorgung ' +inCurrentDistrict+ ' selbst in die Hand: ';
      }

      if (currentDistrict.ruralStoresCount === 1) {

        paragraph += ' In ' + stores[0] + ' gibt es eine Dorfladeninitiative.';
      } else if (currentDistrict.ruralStoresCount === 2) {

        paragraph += ' In ' + stores[0] + ' und ' + stores[1] +' gibt es Dorfladeninitiativen.';
      } else if (currentDistrict.ruralStoresCount === 3) {

        paragraph += ' In ' + stores[0] + ', ' + stores[1] + ' und ' + stores[2] +' gibt es Dorfladeninitiativen.';
      } else if (currentDistrict.ruralStoresCount > 3) {

        paragraph += ' Es gibt bereits in ' + getDigitStr(currentDistrict.ruralStoresCount) + ' Orten Dorfladeninitiativen. Der Landkreis nimmt damit in Bayern eine Vorreiterrolle ein.';
      }
    }


    paragraph += ' Die Angaben beruhen auf Erhebungen der Firma Trade Dimensions im Auftrag der Staatsregierung.';

    return '<h3>' + headline + '</h3><p>' + paragraph + '</p>';
  }

  function getEmbedCode(text) {

    var img = '<img src="http://web.br.de/interaktiv/einzelhandel/images/landkreise.svg" style="width=100%;max-width=660px;margin-bottom:1em;" alt="Entwicklung des Einzelhandels in Bayern">';
    var source = '<p><strong>Quelle</strong>: <a href="http://web.br.de/interaktiv/einzelhandel">Nahversorgung in Gefahr</a>, ein Projekt des Bayerischen Rundfunks.</p>';

    text = img + text + source;

    return text;
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

  function highlightText() {

    $textHighlight.style.background = '#ffffe1';

    setTimeout(function () {

      $textHighlight.style.background = '#ffffff';
    }, 300);
  }

  // Export global functions
  return {
    init: init,
    render: render
  };
})();
