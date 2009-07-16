/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
/**
 * Implements GetFeatureInfo functionality, using the WebServiceRequest
 * tool. This will work with the WMS:GetFeatureInfo request as well as
 * with WFS:GetFeature. This widget can be used as an example on how to
 * write widgets that use the WebServiceRequest functionality.
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
  
  /** WebServiceRequest controller for this widget */
  this.controller = this.getProperty("mb:controller");
  
  /**
   * tolerance in pixels around the click point for WFS:GetFeature
   * default is 3
   */
  this.tolerance = parseFloat(this.getProperty("mb:tolerance", 3));
  
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
   * Register click event when button is selected, unregister it when
   * unselected
   * @param objRef reference to this widget
   * @param selected true if button is selected, false otherwise
   */
  this.doSelect = function(objRef, selected) {
    if (selected) {
      objRef.targetModel.map.events.register('click', objRef, objRef.doOnClick);  
    } else {
      objRef.targetModel.map.events.unregister('click', objRef, objRef.doOnClick);  
    }
  }
  
  /**
   * For GetFeatureInfo, we want to check for queryable layers and only use
   * those.
   * @param e OpenLayers click event
   */
  this.doOnClick = function(e) {
    objRef = this;
    if (!objRef.enabled) return;
    var controller = config.objects[objRef.controller];
    var layerNameList = new Array();
    var selectedLayer=objRef.targetModel.getParam("selectedLayer");
    var queryList;
    if (!selectedLayer) {
      queryList = objRef.targetModel.getQueryableLayers();
      if (queryList.length==0) {
         alert(mbGetMessage("noQueryableLayers"));
         return;
      }
    } else {
      queryList = [objRef.targetModel.getLayer(selectedLayer)];
    }
    
    var llPx = e.xy.add(-objRef.tolerance, objRef.tolerance);
    var urPx = e.xy.add(objRef.tolerance, -objRef.tolerance);
    
    var ll = objRef.targetModel.map.getLonLatFromPixel(llPx);
    var ur = objRef.targetModel.map.getLonLatFromPixel(urPx);
    
    for (var i=0; i<queryList.length; ++i) {
      var layerNode = queryList[i];

      // Get the name of the layer
      var layerName = Mapbuilder.getProperty(layerNode, "wmc:Name", "");

      // reproject to the SRS of the layer if necessary
      var srs = Mapbuilder.getProperty(layerNode, "wmc:SRS");
      if (srs && srs != objRef.targetModel.map.getProjectionObject().getCode()) {
        ll = ll.transform(objRef.targetModel.map.getProjectionObject(), new OpenLayers.Projection(srs));
        ur = ur.transform(objRef.targetModel.map.getProjectionObject(), new OpenLayers.Projection(srs));
      }

      var hidden = objRef.targetModel.getHidden(layerName);
      if (hidden == 0) { //query only visible layers
        controller.requestStylesheet.setParameter("bBoxMinX", ll.lon);
        controller.requestStylesheet.setParameter("bBoxMinY", ll.lat);
        controller.requestStylesheet.setParameter("bBoxMaxX", ur.lon);
        controller.requestStylesheet.setParameter("bBoxMaxY", ur.lat);
        controller.requestStylesheet.setParameter("queryLayer", layerName);
        objRef.targetModel.setParam(controller.requestName.replace(/:/,"_"), layerName);
      }
    }
  }
}
