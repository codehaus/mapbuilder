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

  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
  this.cursor = "default"; 

  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

  this.trm=this.getProperty("mb:transactionResponseModel");
  this.tm=this.getProperty("mb:targetModel");
  this.tc=this.getProperty("mb:targetContext");

  this.httpPayload=new Object();
  this.httpPayload.url=this.getProperty("mb:webServiceUrl");
  this.httpPayload.method="post";

  /** Xsl to convert Feature into a WFS Transaction Insert. */
  this.insertXsl=new XslProcessor(baseDir+"/tool/xsl/wfs_Insert.xsl");

  /** Xsl to convert Feature into a WFS Transaction Update. */
  this.updateXsl=new XslProcessor(baseDir+"/tool/xsl/wfs_Update.xsl");

  /** creates the OL control for this button */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class(OpenLayers.Control, {
      CLASS_NAME: 'mbInsertFeature',
      type: OpenLayers.Control.TYPE_BUTTON
    });
    return Control;
  }

  /**
   * Start a WFS-T InsertFeature transaction.
   * @param objRef Pointer to this object.
   */
  this.doSelect = function(objRef, selected) {
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
      if (objRef.targetModel.doc){
        //if fid exists, then we are modifying an existing feature,
        // otherwise we are adding a new feature
        if(fid){
          s=objRef.updateXsl.transformNodeToObject(objRef.targetModel.doc);
        }else{
          s=objRef.insertXsl.transformNodeToObject(objRef.targetModel.doc);
        }
        objRef.httpPayload.postData=s;
        objRef.transactionResponseModel.transactionType="insert";
        objRef.transactionResponseModel.newRequest(objRef.transactionResponseModel,objRef.httpPayload);
      }else alert(mbGetMessage("noFeatureToInsert"));
    }
  }

  /**
   * If transaction was sucessful, refresh the map and remove contents of
   * FeatureList.  This function is called after the TransactionResponseModel
   * has been updated.
   * @param objRef Pointer to this object.
   */
  this.handleResponse=function(objRef){
    if (objRef.transactionResponseModel.transactionType=="insert") {
      success=objRef.transactionResponseModel.doc.selectSingleNode("//wfs:TransactionResult/wfs:Status/wfs:SUCCESS");
      if (success){
        // Remove FeatureList
        config.loadModel(objRef.targetModel.id, objRef.targetModel.url);

        // Repaint the WMS layers
        objRef.targetContext.callListeners("refreshWmsLayers");
      }
    }
  }
}
