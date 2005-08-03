/*
Author:       Tom Kralidis
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to display predefined locations (as per schema at lib/model/schemas/locations.xsd)
 * into a HTML select box. Changing a location will set the AOI of the targetModel.
 * TBD: projection coordinate conversion still to be implemented.
 * @constructor
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */


function Locations(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

  //TBD: implement this in a Locations model
  this.model.getSRS = function(){return "EPSG:4326";}

/**
 * Change the AOI coordinates from select box choice of prefined locations
 * @param bbox the bbox value of the location keyword chosen
 * @param targetModel the model on which to set the AOI
 */
  this.setAoi = function(bbox, targetModel) {
    var bboxArray = new Array();
    bboxArray     = bbox.split(",");
    var ul = new Array(parseFloat(bboxArray[0]),parseFloat(bboxArray[3]));
    var lr = new Array(parseFloat(bboxArray[2]),parseFloat(bboxArray[1]));
    this.model.setParam("aoi",new Array(ul,lr));

    //convert this.model XY to latlong
    //convert latlong to targetmodel XY
    //extent.setAoi takes XY as input
    this.targetModel.setParam("aoi", new Array(ul,lr));
    this.targetModel.setParam("mouseup",this);
  }
}
