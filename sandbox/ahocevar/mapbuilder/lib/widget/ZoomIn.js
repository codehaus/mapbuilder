/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
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

  this.createControl = function() {
    return new OpenLayers.Control.ZoomBox();
  }
  
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
}

