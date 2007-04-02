/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");

/**
 * ZoomOut button - zooms out on click.
 * @constructor
 * @base ButtonBase
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param widgetNode The widget node from the Config XML file.
 * @param model The model for this widget
 */
function ZoomOut(widgetNode, model) {

  this.createControl = function(objRef) {
    var Control = OpenLayers.Class.create();
    Control.prototype = OpenLayers.Class.inherit( OpenLayers.Control, {
      displayClass: 'mbControlZoomOut',
      type: OpenLayers.Control.TYPE_BUTTON, // constant from OpenLayers.Control
      trigger: function() {
        this.map.zoomOut();
      }
    });
    return new Control();
  }

  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
}