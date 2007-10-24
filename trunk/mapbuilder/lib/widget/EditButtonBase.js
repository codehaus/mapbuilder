/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
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
  this.doSelect = function(objRef, selected) {
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
   * This is called by the OL onFeatureInsert handler. It will
   * call the superclass's setFeature() method to handle the
   * created feature.
   * @param feature OpenLayers feature
   */
  this.handleFeatureInsert = function(feature) {
    // use the objRef reference stored by setEditingLayer()
    var objRef = feature.layer.mbButton;
    objRef.setFeature(objRef, feature);
    // destroy the feature in OL, because we do not use
    // the OL vector layer for displaying the feature
    feature.destroy();
  }

  /**
   * Set editing layer and register for editing events in OL,
   * called after model loads.
   * @param objRef Pointer to this object.
   */
  this.setEditingLayer = function(objRef) {
    if (!objRef.targetContext.featureLayers[objRef.id]) {
      objRef.featureLayer = new OpenLayers.Layer.Vector(objRef.id);
      // set objRef as mbButton attribute of the OL featureLayer,
      // because we otherwise don't have it available in
      // handleFeatureInsert()
      objRef.featureLayer.mbButton = objRef;
      objRef.targetContext.featureLayers[objRef.id] = objRef.featureLayer;
      // register OL event handler
      objRef.featureLayer.onFeatureInsert = objRef.handleFeatureInsert;
    }
  }

  /**
   * Create the array that will hold all OL feature layers
   * for editing buttons. Also register event handler to
   * create feature layers when the OL map is available.
   * @param objRef Pointer to this object.
   */
  this.initButton = function(objRef) {
    // initialize feature layers for the context.
    // each editing button gets its own feature layer,
    // which is not used for displaying the features,
    // because the transaction response model has its
    // own feature renderer.
    if (!objRef.targetContext.featureLayers) {
    	// this array in the context will hold all
    	// featureLayers used by editButton widgets
    	objRef.targetContext.featureLayers = new Array();
    }
    
    // feature layers will be created when the OL map is available
    objRef.targetContext.addFirstListener("refresh",objRef.setEditingLayer, objRef);
    objRef.targetModel.addListener("refreshGmlRenderers",objRef.loadDefaultModel, objRef);
  }

  this.model.addListener("init",this.initButton, this);
}
