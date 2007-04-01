/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, clicks on the MapPane trigger a zoomIn to the 
 * currently set AOI.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode The widget node from the Config XML file.
 * @param model The model for this widget
 */
function ZoomIn(widgetNode, model) {
  // The OpenLayers control we want to use for this widget
  this.control = new OpenLayers.Control.ZoomBox();
  
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
}

