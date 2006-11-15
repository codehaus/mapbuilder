/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: DeleteFeature.js 2201 2006-09-26 14:56:28Z steven $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is pressed a WFS-T DeleteFeature transaction will be started.
 * The modifications are based on and tested against the MapPane2 design
 * @constructor
 * @base ButtonBase
 * @author Cameron Shorter
 * @param widgetNode The widget node from the Config XML file.
 * @param model The model for this widget
 */
function DeleteFeature(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
  
  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
  this.cursor = "default"; 

	//Get the different models from the config file
  this.trm=widgetNode.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue;
  this.tm=widgetNode.selectSingleNode("mb:targetModel").firstChild.nodeValue;
  this.tc=widgetNode.selectSingleNode("mb:targetContext").firstChild.nodeValue;

	//Make sure a new httpPayload is created and set it to 'post'
  this.httpPayload=new Object();
  this.httpPayload.url=widgetNode.selectSingleNode("mb:webServiceUrl").firstChild.nodeValue;
  this.httpPayload.method="post";

  /** Xsl to convert Feature into a WFS Transaction Delete. */
  this.deleteXsl=new XslProcessor(baseDir+"/tool/xsl/wfs_Delete.xsl");

  /**
   * Start a WFS-T DeleteFeature transaction.
   * @param objRef Pointer to this object.
   * @param selected Whether or not this button is selected
   */
  this.doSelect = function(selected,objRef) {
    if (selected){
      // Model that will be populated with the WFS response.
      if (!objRef.transactionResponseModel){
        objRef.transactionResponseModel=window.config.objects[objRef.trm];
        objRef.transactionResponseModel.addListener("loadModel",objRef.handleResponse, objRef);
      }
      if (!objRef.targetModel){
        objRef.targetModel=window.config.objects[objRef.tm];
      }
      if (!objRef.targetContext){
        objRef.targetContext=window.config.objects[objRef.tc];
      }
      fid=objRef.targetModel.getXpathValue(objRef.targetModel,"//@fid");
      //if fid exists, then we are deleting an existing feature.
      if (objRef.targetModel.doc && fid){
        s=objRef.deleteXsl.transformNodeToObject(objRef.targetModel.doc);
        objRef.httpPayload.postData=s;
        objRef.transactionResponseModel.newRequest(objRef.transactionResponseModel,objRef.httpPayload);
      }
      //TBD: move the alert text to widgetText.xml
      else alert("No feature available to delete");
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
			//Refresh de map
     	objRef.targetContext.setParam("refresh","yes");
     	//Easy way to check if the feature is deleted; just request it again
     	config.objects.webServiceForm.submitForm();
    }
  }
}
