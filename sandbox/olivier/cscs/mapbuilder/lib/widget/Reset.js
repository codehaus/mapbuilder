/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Reset.js 2680 2007-04-07 21:04:16Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");

/**
 * Reset button - resets the map to full extent.
 * @constructor
 * @base ButtonBase
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param widgetNode The widget node from the Config XML file.
 * @param model The model for this widget
 */
function Reset(widgetNode, model) {

  this.createControl = function() {
  	return OpenLayers.Control.ZoomToMaxExtent;
  }
  
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
}

