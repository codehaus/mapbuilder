/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is pressed a WFS-T InsertFeature transaction will be started.
 * @constructor
 * @base ButtonBase
 * @author Cameron Shorter
 * @param widgetNode The widget node from the Config XML file.
 * @param model The model for this widget
 */
function InsertFeature(widgetNode, model) {
  var base = new ButtonBase(this, widgetNode, model);

  this.trm=widgetNode.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue;
  this.tm=widgetNode.selectSingleNode("mb:targetModel").firstChild.nodeValue;

  this.httpPayload=new Object();
  this.httpPayload.url=widgetNode.selectSingleNode("mb:webServiceUrl").firstChild.nodeValue;
  this.httpPayload.method="post";

  /** Xsl to convert Feature into a WFS Transaction Insert. */
  this.insertXsl=new XslProcessor(baseDir+"/tool/xsl/wfs_Insert.xsl");

  /**
   * Start a WFS-T InsertFeature transaction.
   * @param objRef Pointer to this object.
   */
  this.doSelect = function(selected,objRef) {
    if (selected){
      // Model that will be populated with the WFS response.
      if (!objRef.transactionResponseModel){
        objRef.transactionResponseModel=eval("config.objects."+objRef.trm);
        objRef.transactionResponseModel.addListener("loadModel",objRef.handleResponse, objRef);
      }
      if (!objRef.targetModel){
        objRef.targetModel=eval("config.objects."+objRef.tm);
      }
      s=objRef.insertXsl.transformNodeToObject(objRef.targetModel.doc);
      objRef.httpPayload.postData=s;
      objRef.transactionResponseModel.newRequest(objRef.transactionResponseModel,objRef.httpPayload);
    }
  }

  /**
   * If transaction was sucessful, refresh the map and remove contents of
   * FeatureList.  This function is called after the TransactionResponseModel
   * has been updated.
   * @param objRef Pointer to this object.
   */
  this.handleResponse=function(objRef){
    sucess=objRef.transactionResponseModel.doc.selectSingleNode("//wfs:TransactionResult/wfs:Status/wfs:SUCCESS");
    if (sucess){
          // Remove FeatureList if feature entry was successful.
      httpPayload.url=null;
      objRef.targetModel.newRequest(objRef.targetModel,httpPayload);
          // Repaint the WMS layers
          targetContext.callListeners("refreshWmsLayers");
        }
  }

}
