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

  this.setAoi = function(bbox) {
    var bboxArray = new Array();
    bboxArray     = bbox.split(",");
    config.setParam("aoi", new Array(new Array(bboxArray[0],bboxArray[3]), new Array(bboxArray[2], bboxArray[1])));
  }
}
