# Nahversorgung in Gefahr
Während in Boom-Gegenden wie München oder Ingolstadt immer mehr Lebensmittelgeschäfte eröffnen, geht die Zahl in vielen Landkreisen teilweise dramatisch zurück. Besonders ältere und wenig mobile Bürger leiden darunter. Eine interaktive Karte generiert dabei automatisch 96 Texte für alle bayerischen Landkreise und Städte.

- **Live**: https://web.br.de/interaktiv/ladensterben
- **Redirect**: https://br.de/ladensterben
- **Analyse**: https://github.com/digitalegarage/einzelhandel-analyse

## Verwendung
1. Repository klonen `git clone https://...`
2. Erforderliche Module installieren `npm install`
3. Erforderliche Module installieren `bower install`
4. Projekt bauen mit `grunt dist`
5. Website über Apache oder einen ähnlichen HTTP-Server ausliefern

Informationen für Entwickler finden sich weiter unten. 

## Spezielle Elemente

### Interaktive Karte
Die interaktive Karte ermöglicht eine Vorauswahl des angezeigten Landkreises. Ruft man die URL https://web.br.de/interaktiv/ladensterben/#09162 auf, wird die Karte mit der Vorauswahl München angezeigt.

Der Standard-Landkreis, der angezeigt wird wenn kein Location Hash gesetzt wird, kann in der `map.js` eingestellt werden:

```javascript
var defaultDistrict = validateHash(location.hash) || '09479';
```

Die Klassifizierung der Werte erfolgt nach gleichen Intervallen und wird automatisch in der Funktion `constructScale` vorgenommen. Die Farbpalette für die Karte und die Legende wird in der Funktion `getColors` definiert:

```javascript
function getColor(cat) {

  return [
    '#d81d09',
    '#f9842d',
    '#ffc166',
    '#f7eec1',
    '#dfedf7',
    '#a7c9ea'
  ][cat];
}
```

Der aktuell ausgewählte Landkreis kann auch von anderen Skripten mit der Funktion `map.forceSelectLayer(id)` verändert werden.

## Robo-Text
Bei Klick auf die Karte wird eine kleiner Auswertungstext für die jeweilige Stadt oder den Landkreis generiert. Dabei werden in der `text.js` die Daten für den jeweiligen Landkreis geladen und ausgewertet. Je nach Wert wird an den Paragraphen eine anderes Textfragment angehängt.

Ein Beispiel:

```javascript
paragraph += ' ' + ((relatedDistrict.districtType === 'Stadt') ? 'In der' : 'Im') + ((relatedDistrict.admDistrict === currentDistrict.admDistrict) ? ' gleichnamigen ' : ' ') + relatedDistrict.districtType + ' ' + relatedDistrict.admDistrict + ((relatedDistrict.districtType === 'Landkreis') ? ', der die Stadt umgibt, ' : ', die vom Landkreis umschlossen ist, ');
```

Für den Landkreis Straubing-Bogen wird dafür folgender Text generiert:

```
In der Stadt Straubing, die vom Landkreis umschlossen ist,
```

Für die Stadt Straubing wird hingegen folgender Text ausgegeben:

```
Im Landkreis Straubing-Bogen, der die Stadt umgibt,
```

### Videos
Für die Darstellung der Videos wird [Video.js](http://videojs.com/) und das Streaming-Plugin [Video.js HLS](http://videojs.github.io/videojs-contrib-hls/) verwendet. Die Videos liegen in BR Audio-Video und können in verschiedener Qualität über einen Link eingebunden werden:

```html
<video class="video-js vjs-sublime-skin" poster="images/vorschaubild.jpg" controls preload="metadata" data-setup="{}">

  <source src="https://cdn-vod-ios.br.de/i/MUJIuUOVBwQIbtCCBLzGiLC1uwQoNA4p_ATS/_-OS/9Ar69-Np/d27dc1b6-8c37-4952-abd2-dbb99de0f114_,0,A,B,E,C,X,.mp4.csmil/master.m3u8?__b__=200" type="application/x-mpegURL">
  <source src="https://cdn-storage.br.de/MUJIuUOVBwQIbtCCBLzGiLC1uwQoNA4p_ATS/_-OS/9Ar69-Np/d27dc1b6-8c37-4952-abd2-dbb99de0f114_E.mp4" type="video/mp4">

  <p class="vjs-no-js">
    Um dieses Video sehen zu können, müssen Sie JavaScript aktivieren und einen Browser verwenden
    <a href="http://videojs.com/html5-video-support/" target="_blank">der HTML5-Videos unterstützt.</a>
  </p>
</video>
```

Als Design verwendet der Player eine angepasste Version des [Sublime Skins](http://codepen.io/zanechua/pen/GozrNe).

### Embed und Modal
Andere Redaktionen und Blogger haben die Möglichkeit die Karte und den jeweiligen Text auf ihren Seiten einzubetten. Der Embed-Code wird in der `text.js` in der Funktion `getEmbedCode` erstellt.

Das Modal (oder Popup) wird folgendermaßen initialisert und gesteuert:

```javascript
modal.init();

$embedContainer = document.getElementById('embed-container');
$embedButton = document.getElementById('embed-button');

$embedButton.addEventListener('click', function () {

  modal.open($embedContainer);
});
```

## Elemente

### Bilder und Bildunterschriften
Bilder können ganz normal über das `<img>`-Element eingebunden werden. Wichtig ist eine aussagekräftige `alt=""`-Beschreibung (SEO und Accessibility). Bildbeschreibungen können mit einem Paragraphen und der Klasse `<p class="caption">Beschreibung</p>` hinzugefügt werden. Die relative Bildbreite ist abhängig vom Eltern-Container (siehe Raster):

```html
<main>

<!-- seitenbreites Bild -->
<img src="bild.jpg" alt="Bild">

 <section>

    <!-- inhaltsbreites Bild -->
    <img src="bild.jpg" alt="Bild">

    <div class="block">
    
      <!-- textbreites Bild mit Bildunterschrift -->
      <img src="bild.jpg" alt="Bild">
      <p class="caption">Beschreibung</p>

    </div>
 </section>
</main>
```

Für die Kompression der Bilder empfiehlt sich **JPEG** (60-70%) und folgende Bildgrößen:
- Bild seitenbreit (Aufmacher): 1600 Pixel Breite
- Bild inhaltsbreit: 940 Pixel Breite
- Bild textbreit: 658 Pixel Breite
- Teaserbilder: 658 Pixel Breite

Für Grafiken und Diagramme empfiehlt sich fast immer – durch die geringe Dateigröße und das scharfe Rendering – das Vektorformat **SVG**.

### Infokasten
Der Infokasten bietet sich für kleinere Einschübe und Erklärtexte („Woher stammen die Daten?”) an.

```html
<div class="infobox">
  <h3>Infokasten</h3>

  <p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum.</p>
</div>
```

### Tabellen
Eigentlich eine klassische HTML-Tabelle mit kleinen CSS-Tricks, um eine schicke mobile Darstellung zu erreichen. Das `data-label`-Attribut sorgt für die richtige Spalten- und Zeilenbeschriftung in der mobilen Ansicht. Ein Beispiel: 

```html
<table>
  <thead>
    <tr>
      <th>Temperatur</th><th>A</th><th>B</th><th>C</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Temperatur">Sommer</td><td data-label="A">2,1</td><td data-label="B">3,5</td><td data-label="C">7,4</td>
    </tr>
    <tr>
      <td data-label="Temperatur">Winter</td><td data-label="A">-2,8</td><td data-label="B">-2,4</td><td data-label="C">0,2</td>
    </tr>
  </tbody>
</table>
```

Daraus wird in der Desktop-Ansicht folgende Tabelle:  

```
+------------+------+------+-----+
| Temperatur |  A   |  B   |  C  |
+------------+------+------+-----+
| Zeile 1    | 2,1  | 3,5  | 7,4 |
| Zeile 2    | -2,8 | -2,4 | 0,2 |
+------------+------+------+-----+
```

In der mobilen Ansicht wird aus jeder Zeile eine eigene kleine Tabelle mit den jeweiligen Werten:

```
+------------+--------+
| Temperatur | Sommer |
+------------+--------+
| A          | 2,1    |
| B          | 3,5    |
| C          | 7,4    |
+------------+--------+

+------------+--------+
| Temperatur | Winter |
+------------+--------+
| A          | -2,8   |
| B          | -2,4   |
| C          | 0,2    |
+------------+--------+
```

Dabei werden die Daten transponiert. Das heißt, die X- und Y-Achse werden vertauscht. Bei manchen Datensätzen kann das zu Problemen führen, da nicht jeder Datensatz beliebig transponiertbar ist. In diesem Fall kann man die mobile Tabellenansicht im CSS auskommentieren. Mit etwas Nachdenken bekommt man jedoch fast jeden Datensatz in eine transponierbare Form.


### Embeds
Manchmal möchte man externe Inhalte von Youtube, Soundclound oder anderen Dienstleistern responsiv einbetten. Sollten der Embed-Code sich nicht automatisch responsiv verhalten, gibt es dafür einen responsiven Embed-Container:

```html
<div class="embed ratio-16-9">
  <iframe src="https://www.youtube.com/embed/XsI9F3n-Bog" frameborder="0" allowfullscreen></iframe>
</div>
```

Der Embed-Container unterstützt folgende Seitenverhältnisse: 16:9, 4:3, 3:2, 1:1. Andere Seitenverhältnisse lasse sich leicht im CSS hinzufügen.

*Hinweis*: Bei den meisten iFrame-Embed-Codes muss man noch die Attribute `width` und `height` entfernen.

### Zitate
Zitate können entweder links oder rechts im Text fließen. Damit Zitate bis zum Rand gehen, sollten sie außerhalb des Block-Containers platziert werden:

```html
<div class="quote right">
  <p>Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit.</p>
  <p class="author">Maximilian Maximus</p>
</div>

<div class="block">
  <!-- Inhalt -->
</div>
```

### Randnotizen (marginals)
Responsive Randnotizen. Das JavaScript wird benötigt, um die Randnotizen korrekt umzubrechen. Dadurch steht in der mobilen Ansicht die Randnotiz hinter dem Paragraphen, auf den sie sich bezieht. Wann die Randnotizen umbrechen, lässt sich im JavaScript konfigurieren: 

```javascript
var BREAKPOINT = 840;
```

### Navigation und Sharing
Mitlaufende (sticky) Navigationsleiste. Der Hintergrund der Leiste und der Seitentitel sind zuerst unsichtbar. Erst beim Scrollen werden beide Elemente sichtbar. Das Verhalten der Navigationsleiste kann über zwei Parameter gesteuert werden: 

```javascript
var SCROLLDELAY = 100; // Verzögerung für das Scroll-Event
var TRIGGER = -20;     // vertikale Position, aber der die Navigation undurchsichtig wird 
```

Außerdem enhält die Navigationsleiste das BR-Logo und die Share-Buttons für die sozialen Netzwerke. Diese Elemente sind von Anfang an sichtbar. Die Hover-Farbe der Buttons wird durch Variablen in `/layout/color.scss` bestimmt:

```sass
$facebook-blue: #3b5998;
$twitter-blue: #4099ff;
$whatsapp-green: #4dc247;
$google-red: #dd4b39;
$linkedin-blue: #007bb5;
$instagram-blue: #125688;
$mail-red: #cb2323;
```

Die Icons für die sozialen Netzwerke kommen von [Fontawesome](https://fortawesome.github.io/Font-Awesome/). Um einen neuen Button hinzufügen, kann man einen bestehenden Button kopieren, um dann die Icon-Klasse und den Link zu ändern. Hier am Beispiel eines neuen Google+-Buttons:

```html
<a href="https://plus.google.com/share?url=http://meineurl.com" target="_blank" title="Auf Google+ teilen">
  <i class="icon-gplus"></i>
</a>
```

### Weitere Artikel (related)
Teaserfläche für verwandte Artikel. Sollte man auf jeden Fall am Ende des Artikels einzubauen, um wenigstens ein paar Leser auf dem Angebot des BR zu halten.

```html
<div class="related">
  <h2>Mehr zum Thema:</h2>

  <div class="table">
    <div class="cell">
      <a href="http://www.br.de/">
        <img src="images/teaser-1.jpg" alt="Beschreibung">
        <p>Super Artikel, den man unbedingt noch lesen sollte</p>
      </a>
    </div>
    <div class="cell">
      <!-- weiter Artikel -->
    </div>
    <div class="cell">
      <!-- weiter Artikel -->
    </div>
  </div>
</div>
```

### Footer
Hervorgehobene Fläche um die Projektbeteiligten, Daten- und Bildquellen, Logos, Impressum und so weiter zu nennen.

## Layout

### Typografie
Als Schriftart wird [Open Sans](https://www.google.com/fonts/specimen/Open+Sans) verwendet. Die bevorzugten Schriftschnitte sind:
- **Headlines**: Normal 400 
- **Fließtext**: Light 300
- **Fließtext italic**: Light 300 italic
- **Fließtext bold**: Semi-Bold 600

Das sind die globalen Schrift-Einstellungen:

```CSS
body {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  font-size: 1.1em;
  font-weight: 300;
  line-height: 1.6;
}
```

Momentan werden die Schriften noch aus dem Google-CDN geladen. In naher Zukunft sollten die Schriften jedoch aus dem BR-eigenen CDN geladen werden.

### Raster
Das Longread-Template nutzt ein Gestaltungsraster. Dabei gibt es drei verschiedene Hierarchie-Ebenen:

- **main**: Seitenbreite Inhalte, zum Beispiel das Aufmacherbild
- **section**: Inhaltsbreite Inhalte, zum Beispiel Diagramme oder Kapitelaufmacher
- **block**: Textbreite Inhalte

- **marginals**: Randnotizen, fließen rechts, 20% der Inhaltsbreite 
- **floats** (.left, .right): Zum Beispiel Zitate, fließen links oder recht, 45% der Inhaltsbreite

Die folgende Darstellung der Elemente ist nicht proportional:

```
+-------------------------------------------------+
| main                                            |
|                                                 |
|  +-------------------------------------------+  |
|  | section                                   |  |
|  |                                           |  |
|  |   +---------------------------------------+  |
|  |   | .block                   | .marginals |  |
|  |   |                          |            |  |
|  +---------------------+  +------------------+  |
|  | .left               |  | .right           |  |
|  |   |                 |  |     |            |  |
|  |   |                 |  |     |            |  |
```

### Farben
Alle Farben sind im SASS-Modul `_color.scss` definiert und folgen dem BR Data-Styleguide. Hier finden sich auch die Farben für die Share-Buttons. Im Zweifelsfall sollte man immer eine der bestehenden Farben verwenden, statt eine neue Farbe anzulegen.
Farbskalen, für Choropleth-Karten oder Diagramme, kann man sich aus einer Basisfarbe mithilfe von SASS berechnen lassen. Eine Anleitung dazu findet sich [hier](http://alistapart.com/article/mixing-color-for-the-web-with-sass).   

## Entwickeln
Das Longread-Template ist eine Web-Anwendung basierend auf HTML, SASS und JavaScript. Als Paketmanager kommen NPM und Bower zum Einsatz. Alle anderen Abhänigkeiten, wie Grunt und PostCSS, dienen nur dazu, einen optimierten Build zu erstellen.

### Stylesheets
Die Stylesheets sind modular in [SASS](http://sass-lang.com/) angelegt:
- **custom**: projektspezifische Stylesheets 
- **layout**: allgemeine Layout-Komponenten (Typo, Farben, Grid ...) 
- **modules**: komponentenspezifische Komponenten (Navigation, Footer, Zitate ...)

Um die SASS-Styles bei jeder Änderungen neu zu kompilieren, kann man den SASS-Watcher laufen lassen: 
- Sass installieren (falls noch nicht gesschehen): `gem install sass`
- Sass kompilieren: `sass --watch src/styles:src/styles`

*Hinweis*: Vendor-Prefixes können weggelassen werden, das diese im Grunt Build Task automatisch hinzugefügt werden.

### Javascript
Das Javascript is ebenfalls modular aufgebaut. Es gibt einen zentralen Einstiegspunkt `init.js`, wo alle Module initialisiert werden. Auch globale Event Listener auf das window oder document-Objekt sollten hier registriert werden.

Die Module haben folgen dem [Revealing Module Pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript) und haben folgenden Aufbau: 

```javascript
var module = (function () {

  'use strict';

  function init() {

    doSomething();
  }

  function doSomething() {

    // Do something
  }

  // Export global functions
  return {
    init: init,
  };
})();
```

In der `init.js` würde man das Modul folgendermaßen aufrufen:

```javascript
module.init()
```

Alle Module sind in Vanilla-Javascript (ohne andere Bibliotheken) geschrieben. Sollte man eine externe Bibliothek benötigen, kann man diese mit Bower installieren:

```
bower install d3 --save
```

### Grunt (Build Task)
Mithilfe des Taskrunners Grunt kann eine optimierte Version der Seite gebaut werden. Dabei wird:
- JavaScript wird minifiziert und in eine Datei zusammengefasst (uglify)
- Stylesheet werden geprefixt, minifiziert und zusammengefasst (PostCSS)
- HTML-Script und Style-Tags werden angepasst (Usemin)
- Bilder und Daten werden kopiert (copy)

Ausführen den Grunt Tasks:
- Erforderliche Module installieren `npm install`
- Task ausführen mit `grunt dist`

Die optimierte Version des Webseite liegt nach Ausführen des Grunt Tasks unter `dist`. Sollten neue Bibliotheken hinzugefügt werden, müssen diese auch im Gruntfile hinzugefügt werden:

```javascript
uglify: {

  dist: {

    files: {

      'dist/scripts/main.min.js': [
        'bower_components/d3/d3.min.js', // Neue Bibliothek
        'src/scripts/classList.js',
        'src/scripts/navigation.js',
        'src/scripts/marginals.js',
        'src/scripts/intro.js',
        'src/scripts/highlights.js',
        'src/scripts/comparison.js',
        'src/scripts/ranking.js',
        'src/scripts/init.js'
      ]
    }
  }
}
```

Externe Stylesheet importiert man jedoch besser in einem SASS-Modul:

```SASS
@import url(https://web.br.de/interaktiv/assets/libraries/leaflet/leaflet.v0.min.css)
```

## Verbesserungen
- Open Sans aus BR CDN einbinden (statt Google Fonts)
