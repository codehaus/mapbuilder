/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: EditButtonBase.js,v 1.9 2005/09/20 02:37:54 madair1 Exp $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/../customlib/widget/ButtonBase.js");

/**
 * Base class for tools which update GML by clicking on the mapPane.
 * @constructor
 * @base ButtonBase
 * @author Cameron Shorter cameronATshorter.net
 * @param widgetNode The node from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function EditButtonBase(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
 this.cursor = "default";	// Adding support for customized cursors
  /** Empty GML to load when this tool is selected. */
  this.defaultModelUrl=widgetNode.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;

  /** Reference to GML node to update when a feature is added. */
  this.featureXpath=widgetNode.selectSingleNode("mb:featureXpath").firstChild.nodeValue;

  /**
   * If tool is selected and the Edit Tool has changed (eg, changed from
   * LineEdit to PointEdit) then load new default feature.
   * This function is called when a tool is selected or deselected.
   * The following parameters are copied from this button's config node into
   * the target model:<br/>
   * "transactionResponseModel", "webServiceUrl", "featureXpath",
   * "defaultModelUrl", "targetContext".
   * These values will be used by WebServiceAction when processing a
   * transaction.
   * @param objRef Pointer to this object.
   * @param selected True when selected.
   */
  this.doSelect = function(selected,objRef) {
	// Add support to change cursors in the map area based on:
     // either user selected cursor in config file
     // or default tool cursor as defined in constructor
     
     if( selected == true ) {
         var a = document.getElementById("mainMapContainer");
         if( a != null ) {
             // default tool cursor
             a.style.cursor = this.cursor;
             
             // Check for user override
             var cursorNode =  objRef.widgetNode.selectSingleNode("mb:cursor");
             if( cursorNode != null ) {
                 var cursor = cursorNode.firstChild.nodeValue;
                 a.style.cursor = cursor;
             }
         }  
     }
    if (objRef.enabled && selected && objRef.targetModel.url!=objRef.defaultModelUrl){
      a=new Array("transactionResponseModel","webServiceUrl","featureXpath","defaultModelUrl","targetContext");
      for (i in a){
        param=widgetNode.selectSingleNode("mb:"+a[i]);
        if(param){
          objRef.targetModel.setParam(a[i],param.firstChild.nodeValue);
        }
      }

      objRef.targetModel.url=objRef.defaultModelUrl;
      // load default GML
      var httpPayload=new Object();
      httpPayload.url=objRef.defaultModelUrl;
      httpPayload.method="get";
      httpPayload.postData=null;
      objRef.targetModel.newRequest(objRef.targetModel,httpPayload);
    }
  }

  /**
   * Register for mouseup events, called after model loads.
   * @param objRef Pointer to this object.
   */
  this.setMouseListener = function(objRef) {
    if (objRef.mouseHandler) {
      objRef.mouseHandler.model.addListener('mouseup',objRef.doAction,objRef);
    }
  }

  /**
   * Set the loadModel listener in response to init event
   * @param objRef Pointer to this object.
   */
  this.initButton = function(objRef) {
    objRef.targetModel.addListener("loadModel",objRef.setMouseListener, objRef);
  }

  this.model.addListener("init",this.initButton, this);
}
