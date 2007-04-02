/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");

/**
 * When this button is selected, clicks on the MapPane trigger a zoomIn to the 
 * currently set AOI.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode The widget node from the Config XML file.
 * @param model The model for this widget
 */
function Reset(widgetNode, model) {

  this.createControl = function() {
  	return new OpenLayers.Control.ZoomToMaxExtent();
  }
  
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
}

