/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: EditButtonBase.js 1796 2005-11-10 10:51:43Z camerons $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

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

  // override default cursor by user
  // cursor can be changed by specifying a new cursor in config file
  this.cursor = "crosshair"; 

  this.trm=widgetNode.selectSingleNode("mb:transactionResponseModel");
  if(this.trm)this.trm=this.trm.firstChild.nodeValue;

  /** Empty GML to load when this tool is selected. */
  this.defaultModelUrl=widgetNode.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;

  /** Reference to GML node to update when a feature is added. */
  this.featureXpath=widgetNode.selectSingleNode("mb:featureXpath").firstChild.nodeValue;

  /**
   * If tool is selected and the Edit Tool has changed (eg, changed from
   * LineEdit to PointEdit) then load new default feature.
   * This function is called when a tool is selected or deselected.
   * @param objRef Pointer to this object.
   * @param selected True when selected.
   */
  this.doSelect = function(selected,objRef) {
    // Model that will be populated with the WFS response.
    if (objRef.trm && !objRef.transactionResponseModel){
      objRef.transactionResponseModel=window.config.objects[objRef.trm];
    }
    // Load default feature.
    if (objRef.enabled && selected && objRef.targetModel.url!=objRef.defaultModelUrl){
      objRef.loadDefaultModel(objRef);
    }
    // Remove the transactionResponseModel (and result of last transaction)
    // when a transaction button is deselected
    if(!selected && objRef.transactionResponseModel){
      objRef.transactionResponseModel.setModel(objRef.transactionResponseModel,null);
    }
  }

  /**
   * Load the defaultModel into the targetModel.
   */
  this.loadDefaultModel=function(objRef){
    objRef.targetModel.url=objRef.defaultModelUrl;
    // load default GML
    var httpPayload=new Object();
    httpPayload.url=objRef.defaultModelUrl;
    httpPayload.method="get";
    httpPayload.postData=null;
    objRef.targetModel.newRequest(objRef.targetModel,httpPayload);
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
