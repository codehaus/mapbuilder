/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
/**
 * Implements WMS GetFeatureInfo functionality, using the WebServiceRequest
 * tool. This widget can be used as an example on how to write widgets that
 * use the WebServiceRequest functionality.
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
  /** WebServiceRequest controller for this widget */
  this.controller = controller ? controller.firstChild.nodeValue : null;
  
  /**
   * GetFeatureInfoWSR control
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.GetFeatureInfoWSR',
      type: OpenLayers.Control.TYPE_TOOL
    });
    return Control;
  }
  
  /**
   * Register mouseup event when button is selected, unregister it when
   * unselected
   * @param objRef reference to this widget
   * @param selected true if button is selected, false otherwise
   */
  this.doSelect = function(objRef, selected) {
    if (selected) {
      objRef.targetModel.map.events.register('mouseup', objRef, objRef.doOnMouseup);  
    } else {
      objRef.targetModel.map.events.unregister('mouseup', objRef, objRef.doOnMouseup);  
    }
  }
  
  /**
   * For GetFeatureInfo, we want to check for queryable layers and only use
   * those.
   * @param e OpenLayers mouseup event
   */
  this.doOnMouseup = function(e) {
    objRef = this;
    var controller = config.objects[objRef.controller];
    if (!objRef.enabled) return;
    var layerNameList = new Array();
    var selectedLayer=objRef.targetModel.getParam("selectedLayer");

    var queryList;
    if (selectedLayer==null) {
      queryList = objRef.targetModel.getQueryableLayers();
      if (queryList.length==0) {
         alert(mbGetMessage("noQueryableLayers"));
         return;
      } 
    } else {
      queryList = [objRef.targetModel.getLayer(selectedLayer)];
    }

    for (var i=0; i<queryList.length; ++i) {
      var layerNode = queryList[i];
      
      // Get the name of the layer
      var layerName = layerNode.selectSingleNode("wmc:Name");layerName=(layerName)?layerName.firstChild.nodeValue:"";

      // Get the layerId. Fallback to layerName if non-existent
      var layerId = layerNode.getAttribute("id") || layerName;

      var hidden = objRef.targetModel.getHidden(layerId);
      if (hidden == 0) { //query only visible layers
        controller.requestStylesheet.setParameter("queryLayer", layerName);
        objRef.targetModel.setParam("wms_GetFeatureInfo", layerName);
      }
    }
  }
}
