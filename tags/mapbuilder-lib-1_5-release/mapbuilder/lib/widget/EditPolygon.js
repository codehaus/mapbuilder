/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");

/**
 * When this button is selected, clicks on the MapPane will add a
 * new point to a polygon.
 * @constructor
 * @base EditButtonBase
 * @author Simon Flannery simonDOTflanneryATbigpondDOTcom
 * @sponser VPAC
 * @param widgetNode The node from the Config XML file.
 * @param model The ButtonBar widget.
 */
function EditPolygon(widgetNode, model) {
  // Extend EditButtonBase
  EditButtonBase.apply(this, new Array(widgetNode, model));

  this.instantiateControl = function(objRef, Control) {
    return new Control(objRef.featureLayer, OpenLayers.Handler.Polygon);
  }

}

