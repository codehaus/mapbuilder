/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id: GetFeatureInfo.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");
/**
 * Implements WMS GetFeatureInfo functionality, popping up a query result
 * window when user clicks on map.
 * @constructor
 * @base ButtonBase
 * @author adair
 * @constructor
 * @param toolNode The XML node in the Config file referencing this object.
 * @param model The widget object which this tool is associated with.
 */
function GetFeatureInfo(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

  /**
   * Calls the centerAt method of the context doc to zoom out, recentering at 
   * the mouse event coordinates.
   * TBD: set the zoomBy property as a button property in conifg
   * @param objRef      Pointer to this AoiMouseHandler object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
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

  /**
   * Register for mouseUp events.
   * @param objRef  Pointer to this object.
   */
  this.setMouseListener = function(objRef) {
    if (objRef.mouseHandler) {
      objRef.mouseHandler.model.addListener('mouseup',objRef.doAction,objRef);
    }
  }
  this.model.addListener( "loadModel", this.setMouseListener, this );

}
