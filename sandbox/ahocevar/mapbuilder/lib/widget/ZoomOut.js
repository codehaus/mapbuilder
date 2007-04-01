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
function ZoomOut(widgetNode, model) {
  // The OpenLayers control we want to use for this widget
  this.control = new this.ZoomOut();
  
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
}

ZoomOut.prototype.ZoomOut = function() {};
ZoomOut.prototype.ZoomOut.prototype = {
    displayClass: 'mbControlZoomOut',
    type: 1, // constant from OpenLayers.Control
    setMap: function(map) {
        this.map = map;
    },
    draw: function() {
    },
    deactivate: function () {
    },
    trigger: function() {
        this.map.zoomOut();
    }
}
