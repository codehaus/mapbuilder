/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
/**
 * Implements WMS GetFeatureInfo functionality, popping up a query result
 * window when user clicks on map.
 * @constructor
 * @base ButtonBase
 * @author adair
 * @constructor
 * @param widgetNode The XML node in the Config file referencing this object.
 * @param model The widget object which this widget is associated with.
 */
function GetFeatureInfoWSR(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
  
  var controller = widgetNode.selectSingleNode("mb:controller");
  this.controller = controller ? controller.firstChild.nodeValue : null;
  
  /**
   * GetFeatureInfo control
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.GetFeatureInfo',
      type: OpenLayers.Control.TYPE_TOOL
    });
    return Control;
  }
  
  this.doSelect = function(objRef, selected) {
    if (selected) {
      objRef.targetModel.map.events.register('mouseup', objRef, objRef.doOnMouseup);  
    } else {
      objRef.targetModel.map.events.unregister('mouseup', objRef, objRef.doOnMouseup);  
    }
  }
  
  this.doOnMouseup = function(e) {
    objRef = this;
    var controller = config.objects[objRef.controller];
    if (!objRef.enabled) return;
    var layerNameList = new Array();
    var selectedLayer=objRef.targetModel.getParam("selectedLayer");
    if (selectedLayer==null) {
      var queryList = objRef.targetModel.getQueryableLayers();
      if (queryList.length==0) {
         alert("There are no queryable layers available, please add a queryable layer to the map.");
         return;
      } else {
        for (var i=0; i<queryList.length; ++i) {
          layerNameList[i] = queryList[i].firstChild.nodeValue;   //convert to the layer names
        }
      }
    } else {
      layerNameList[0]= selectedLayer;
    }
    for (var i=0; i<layerNameList.length; ++i) {
      var layerName = layerNameList[i];
      var hidden = objRef.targetModel.getHidden(layerName);
      if (hidden == 0) { //query only visible layers
        controller.requestStylesheet.setParameter("queryLayer", layerName);
        objRef.targetModel.setParam("wms_GetFeatureInfo", layerName);
      }
    }
  }
}
