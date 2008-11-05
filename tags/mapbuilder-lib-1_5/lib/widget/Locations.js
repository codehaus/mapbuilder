/*
Author:       Tom Kralidis
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to display predefined locations (as per schema at lib/model/schemas/locations.xsd)
 * into a HTML select box. Changing a location will set the AOI of the targetModel.
 * TBD: projection coordinate conversion still to be implemented.
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */


function Locations(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  /**
   * Change the AOI coordinates from select box choice of prefined locations
   * @param bbox the bbox value of the location keyword chosen
   * @param targetModel the model on which to set the AOI
   * @param srsName srs of the bbox
   */
  this.setAoi = function(bbox, targetModel, srsName) {
    var srsTokens = srsName.split(/[:#]/);
    srsName = 'EPSG:'+srsTokens[srsTokens.length-1];
    if (!srsName) {
      srsName = 'EPSG:4326';
    }
    var proj = new OpenLayers.Projection(srsName);
    var bboxArray = new Array();
    bboxArray     = bbox.split(",");
    var ptUL=new OpenLayers.Geometry.Point(parseFloat(bboxArray[0]),parseFloat(bboxArray[3]));
    var ptLR=new OpenLayers.Geometry.Point(parseFloat(bboxArray[2]),parseFloat(bboxArray[1]));
    ptUL.transform(proj,this.targetModel.proj);
    ptLR.transform(proj,this.targetModel.proj);
    var ul = new Array(ptUL.x,ptUL.y);
    var lr = new Array(ptLR.x,ptLR.y);   
    this.targetModel.setParam("aoi",new Array(ul,lr));

    //convert this.model XY to latlong
    //convert latlong to targetmodel XY
    this.targetModel.map.zoomToExtent(new OpenLayers.Bounds(ul[0],lr[1],lr[0],ul[1]));
  }
}
