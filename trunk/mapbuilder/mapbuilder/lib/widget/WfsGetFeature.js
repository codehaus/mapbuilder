/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");
/**
 * Builds then sends a WFS GetFeature GET request based on the WMC
 * coordinates and click point.
 * @constructor
 * @base ButtonBase
 * @author Cameron Shorter
 * @param widgetNode The XML node in the Config file referencing this object.
 * @param model The Context object which this tool is associated with.
 */
function WfsGetFeature(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
  this.tolerance= widgetNode.selectSingleNode('mb:tolerance').firstChild.nodeValue;
  this.typeName= widgetNode.selectSingleNode('mb:typeName').firstChild.nodeValue;
  this.webServiceUrl= widgetNode.selectSingleNode('mb:webServiceUrl').firstChild.nodeValue;
  this.httpPayload=new Object();
  this.httpPayload.method="get";
  this.httpPayload.postData=null;
  this.trm=widgetNode.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue;

  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
  this.cursor = "pointer"; 

  /**
   * Open window with query info.
   * This function is called when user clicks map with Query tool.
   * @param objRef      Pointer to this GetFeatureInfo object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      extent=objRef.targetModel.extent;
      point=extent.getXY(targetNode.evpl);
      xPixel=extent.res[0]*objRef.tolerance;
      yPixel=extent.res[1]*objRef.tolerance;
      bbox=(point[0]-xPixel)+","+(point[1]-yPixel)+","+(point[0]+xPixel)+","+(point[1]+yPixel);
      if (objRef.webServiceUrl.indexOf("?") > -1){
        objRef.httpPayload.url=objRef.webServiceUrl+"&request=GetFeature&typeName="+objRef.typeName+"&bbox="+bbox;
      }else{
        objRef.httpPayload.url=objRef.webServiceUrl+"?request=GetFeature&typeName="+objRef.typeName+"&bbox="+bbox;
      }

      // Model that will be populated with the WFS response.
      if (!objRef.transactionResponseModel){
        objRef.transactionResponseModel=eval("config.objects."+objRef.trm);
        //objRef.transactionResponseModel.addListener("loadModel",objRef.handleResponse, objRef);
      }
      objRef.transactionResponseModel.newRequest(objRef.transactionResponseModel,objRef.httpPayload);
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
    objRef.context=objRef.widgetNode.selectSingleNode("mb:context");
    if (objRef.context){
      objRef.context=eval("config.objects."+objRef.context.firstChild.nodeValue);
    }
  }
  config.addListener( "loadModel", this.setMouseListener, this );
}
