/*
Author:       Tom Kralidis
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to display predefined locations
 *
 * @constructor
 *
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */


function Locations(widgetNode, model) {
  var base = new WidgetBase(widgetNode, model);
  for (sProperty in base) {
    this[sProperty] = base[sProperty];
  }

  /**
   * Change the AOI coordinates from select box choice of prefined locations
   * @param bbox the bbox value of the location keyword chosen
   */

  this.setAoi = function(bbox, targetModel) {
    var bboxArray = new Array();
    bboxArray     = bbox.split(",");
    var ul = new Array(bboxArray[0],bboxArray[3]);
    var lr = new Array(bboxArray[2],bboxArray[1]);
    //convert this.model XY to latlong
    //convert latlong to targetmodel XY
    //extent.setAoi takes XY as input
    config[targetModel].extent.setAoi(ul,lr);
  }
}
