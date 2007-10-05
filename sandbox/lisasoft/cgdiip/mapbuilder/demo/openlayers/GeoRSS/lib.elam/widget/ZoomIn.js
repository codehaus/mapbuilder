/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ZoomIn.js 2956 2007-07-09 12:17:52Z steven $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");

/**
 * ZoomIn button - zooms in on click or box drag in the map.
 * @constructor
 * @base ButtonBase
 * @author Andreas HOcevar andreas.hocevarATgmail.com
 * @param widgetNode The widget node from the Config XML file.
 * @param model The model for this widget
 */
function ZoomIn(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

  this.cursor = 'crosshair';

  this.createControl = function() {
    return OpenLayers.Control.ZoomBox;
  }
}

