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
function GetFeatureInfo(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
  
  /**
   * GetFeatureInfo control
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class.create();
    Control.prototype = OpenLayers.Class.inherit( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.GetFeatureInfo',
      type: OpenLayers.Control.TYPE_TOOL,
    });
    return Control;
  }
  
  this.doSelect = function(objRef, selected) {
    if (selected) {
      objRef.targetModel.addListener('mouseup', objRef.doOnMouseup, objRef);
    } else {
      objRef.targetModel.removeListener('mouseup', objRef.doOnMouseup, objRef);
    }
  }
  
  this.doOnMouseup = function(objRef) {
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
        config.objects.featureInfoController.requestStylesheet.setParameter("queryLayer", layerName);//TBD remove the hardcoded object ID here
        objRef.targetModel.setParam("wms_GetFeatureInfo", layerName);
      }
    }
  }
}
