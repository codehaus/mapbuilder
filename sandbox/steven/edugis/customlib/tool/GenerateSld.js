/*
Author:       Steven Ottens AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: GenerateSld.js 2546 2007-01-23 12:07:39Z steven $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");


/**
 * A tool designed to store the history of the extent during a session
 *
 * @constructor
 * @base ToolBase
 * @param toolNode  The node for this tool from the configuration document.
 * @param model     The model object that contains this tool
 */
function GenerateSld(toolNode, model) {
  ToolBase.apply(this, new Array(toolNode, model));
  
  this.generateSld = function(objRef, layerName) {
  	var bbox = objRef.model.extent.getBbox();
  	var feature = objRef.model.getFeatureNode(layerName);
  	var url = objRef.model.getServerUrl('GetMap', 'GET', feature);
  	var url = url + "&version=1.1.0&request=GetSLDforBbox&service=wms&srs=EPSG:28992&format=image/gif&";
  	url = url + "width=" + objRef.model.extent.getSize()[0] + "&height=" +objRef.model.extent.getSize()[1];
  	url = url + "&bbox=" + bbox.toString()+"&layers="+layerName;
  	alert(url);
  	httpPayload = new Object();
		httpPayload.url = url;
    httpPayload.method="get";
    httpPayload.postData=null;
    objRef.targetModel.newRequest(objRef.targetModel,httpPayload);
  } 
  this.model.addListener("generateSld", this.generateSld, this);
  
    /**
    * Set the loadModel listener in response to the init event
    * @param objRef pointer to this object.
    */
  this.initReset = function(objRef) {
    objRef.targetModel.addListener("loadModel", objRef.applySld, objRef);
	}
		this.model.addListener("init", this.initReset, this);
  this.applySld = function(objRef) {
  	var sldNode = objRef.targetModel.getSldNode();
  	var urlNode =	sldNode.selectSingleNode("//StyleList");
  	objRef.model.setParam('addSLD',urlNode);
  	objRef.model.setParam('refresh');
  }
  this.clearSld = function(objRef,layerName){
  	objRef.model.setParam('removeSLD',layerName);
  	  	objRef.model.setParam('refresh');
  }
  
   this.model.addListener("clearSld", this.clearSld, this);
  
}