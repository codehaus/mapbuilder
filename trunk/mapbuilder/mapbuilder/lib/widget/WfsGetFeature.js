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
 * @param toolNode The XML node in the Config file referencing this object.
 * @param model The Context object which this tool is associated with.
 */
function WfsGetFeature(toolNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(toolNode, model));
  this.tolerance= toolNode.selectSingleNode('mb:tolerance').firstChild.nodeValue;
  this.typeName= toolNode.selectSingleNode('mb:typeName').firstChild.nodeValue;
  this.webServiceUrl= toolNode.selectSingleNode('mb:webServiceUrl').firstChild.nodeValue;
  this.httpPayload=new Object();
  this.httpPayload.method="get";
  this.httpPayload.postData=null;

  /** Xsl to convert Feature into a WFS Transaction Insert. */
  this.insertXsl=new XslProcessor(baseDir+"/tool/xsl/wfs_Insert.xsl");



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
      xPixel=objRef.targetModel.getWindowWidth()*extent.res[0];
      yPixel=objRef.targetModel.getWindowHeight()*extent.res[1];
      //alert("WfsGetFeature:yPixel="+yPixel);
      alert("WfsGetFeature:width="+objRef.targetModel.getWindowWidth());
      alert("WfsGetFeature:res="+extent.res[0]);
      alert("WfsGetFeature:bbox1="+objRef.targetModel.getBoundingBox());
      bbox=(point[0]-xPixel)+","+(point[1]-yPixel)+","+(point[0]+xPixel)+","+(point[1]+yPixel);
      objRef.httpPayload.url=objRef.webServiceUrl+"?typeName="+objRef.typeName+"&bbox="+bbox;
      alert("WfsGetFeature:URL="+objRef.httpPayload.url);

      /*
      // Model that will be populated with the WFS response.
      if (!objRef.transactionResponseModel){
        objRef.transactionResponseModel=eval("config.objects."+objRef.trm);
        //objRef.transactionResponseModel.addListener("loadModel",objRef.handleResponse, objRef);
      }
      if (!objRef.targetModel){
        objRef.targetModel=eval("config.objects."+objRef.tm);
      }
      if (objRef.targetModel.doc){
        s=objRef.insertXsl.transformNodeToObject(objRef.targetModel.doc);
        objRef.transactionResponseModel.newRequest(objRef.transactionResponseModel,objRef.httpPayload);
      }else alert("No feature available to insert");
      */
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
