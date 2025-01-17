"use strict";

/**
 * This is main plugin loading function
 * Feel free to write your own compiler
 */
W.loadPlugin(
/* Mounting options */
{
  "name": "windy-plugin-boulder",
  "version": "0.5.0",
  "author": "mattschy",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/mattschy/windy-plugins"
  },
  "description": "Windy plugin that show some boulder rocks on the map. At the moment only for the Odenwald.",
  "displayName": "Boulder Rocks",
  "hook": "menu"
},
/* HTML */
'',
/* CSS */
'',
/* Constructor */
function () {
  var _this = this;

  var Evented = W.require('Evented');

  var map = W.require('map');

  var bcast = W.require('broadcast');

  var clickmessage = "click for weather forecast<br>doubleclick for past weather data<br>";
  var tblbegin = "<table><tr><th>below 6a :&nbsp&nbsp</th><th>6a-6c+ :&nbsp&nbsp</th><th>7a-... :&nbsp&nbsp</th></tr><tr>";
  var rocks = [[49.725054, 8.690041, "<h3>Felsenmeer(+ Borstein, Hohenstein)</h2><br>" + tblbegin + "<td>85+++</td><td>127</td><td>46</td></tr></table><br>" + clickmessage], [49.785035, 8.669139, "<h3>Mühltal</h3><br>" + tblbegin + "<td>9</td><td>14</td><td>4</td></tr></table><br>" + clickmessage], [49.748890, 8.760186, "<h3>Lützelbach</h3><br>" + tblbegin + "<td>20</td><td>39</td><td>11</td></tr></table><br>" + clickmessage], [49.728538, 8.779184, "<h3>Neunkirchen</h3><br>" + tblbegin + "<td>65</td><td>57</td><td>9</td></tr></table><br>" + clickmessage], [49.685411, 8.786355, "<h3>Lindenfels</h3><br>" + tblbegin + "<td>39</td><td>30</td><td>6</td></tr></table><br>" + clickmessage], [49.727333, 8.802494, "<h3>Laudenau</h3><br>" + tblbegin + "<td>34</td><td>27</td><td>6</td></tr></table><br>" + clickmessage], [49.739589, 8.798285, "<h3>Steinau</h3><br>" + tblbegin + "<td>28</td><td>58</td><td>18</td></tr></table><br>" + clickmessage], [49.740297, 8.810833, "<h3>Messbach</h3><br>" + tblbegin + "<td>10</td><td>15</td><td>2</td></tr></table><br>" + clickmessage], [49.754096, 8.815553, "<h3>Nonrod</h3><br>" + tblbegin + "<td>18</td><td>13</td><td>3</td></tr></table><br>" + clickmessage], [49.740583, 8.822180, "<h3>Erlau</h3><br>" + tblbegin + "<td>2</td><td>6</td><td>4</td></tr></table><br>" + clickmessage], [49.767497, 8.791081, "<h3>Lichtenberg</h3><br>" + tblbegin + "<td>0</td><td>1</td><td>1</td></tr></table><br>" + clickmessage], [49.737770, 8.911591, "<h3>Böllstein</h3><br>" + tblbegin + "<td>2</td><td>4</td><td>2</td></tr></table><br>" + clickmessage], [49.679703, 8.696766, "<h3>Hambach</h3><br>" + tblbegin + "<td>20</td><td>12</td><td>1</td></tr></table><br>" + clickmessage], [49.555406, 8.783792, "<h3>Absteinach</h3><br>" + tblbegin + "<td>12</td><td>8</td><td>2</td></tr></table><br>" + clickmessage], [49.567530, 8.838915, "<h3>Wald-Michelbach</h3><br>" + tblbegin + "<td>3</td><td>3</td><td>1</td></tr></table><br>" + clickmessage], [49.407535, 8.703931, "<h3>Heidelberg, Riesenstein</h3><br>" + tblbegin + "<td>7+++</td><td>16</td><td>16</td></tr></table><br>" + clickmessage]];
  var markers = new Array(rocks.length);
  var hasHooks = false;
  var stopclosing = false;

  this.onopen = function () {
    if (hasHooks) {
      return;
    } else {
      var myIcon = L.icon({
        iconUrl: 'https://cdn.pixabay.com/photo/2016/04/22/14/42/png-1345905_960_720.png',
        iconSize: [38, 38]
      });

      for (var i = 0; i < rocks.length; i++) {
        markers[i] = new L.marker([rocks[i][0], rocks[i][1]], {
          icon: myIcon
        }).bindPopup(rocks[i][2]).addTo(map).on("mouseover", function () {
          this.openPopup();
        }).on("mouseout", function () {
          this.closePopup();
        }).on("click", function () {
          stopclosing = true;
          bcast.emit('rqstOpen', 'detail', {
            lat: rocks[this.index][0],
            lon: rocks[this.index][1]
          });
        }).on("dblclick", function () {
          window.open('https://www.meteoblue.com/de/products/historyplus/download/' + rocks[this.index][0] + 'N' + rocks[this.index][1] + 'E', '_blank');
        });
        markers[i].index = i;
        hasHooks = true;
      }
    }
  };

  this.onclose = function () {
    if (stopclosing) {
      stopclosing = false;

      _this.open();

      return;
    } else if (hasHooks) {
      markers.forEach(function (l) {
        return map.removeLayer(l);
      });
      hasHooks = false;
    } else {
      return;
    }
  };
});