/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: NewFeature.js 2201 2006-09-26 14:56:28Z steven $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is pressed a new feature can be drawn onto the map
 * It is based on and tested against the MapPane2 design
 * @constructor
 * @base ButtonBase
 * @author Steven.OttensATgeodan.nl
 * @param widgetNode The widget node from the Config XML file.
 * @param model The model for this widget
 */
function NewFeature(widgetNode, model) {
  // Extend EditButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

	//Get the different models and stylesheets from the config file
  this.tc=widgetNode.selectSingleNode("mb:targetContext").firstChild.nodeValue;
  this.defaultModelUrl=widgetNode.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;
  var requestStylesheet = widgetNode.selectSingleNode("mb:requestStylesheet");
  if (requestStylesheet) {
    this.requestStylesheet = new XslProcessor(requestStylesheet.firstChild.nodeValue,model.namespace); 
  }
  var featureXpath =  widgetNode.selectSingleNode("mb:featureXpath");
  if (featureXpath) {
  	this.featureXpath = widgetNode.selectSingleNode("mb:featureXpath").firstChild.nodeValue;
  }
  else this.featureXpath = "//topp:GEOMETRIE/gml:LineString/gml:coordinates";

  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
  this.cursor = "crosshair";	
  /**
   * When selected load an empty WFS featurecollection
   * Transform this model into a WFS layer in OWSContext
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
   	this.doSelect = function(selected,objRef) {
   		if(selected){
	   		if (!objRef.targetContext){
        	objRef.targetContext=window.config.objects[objRef.tc];
	      }
	      
	      //Create an empty WFS FeatureType layer
  			var layer = this.requestStylesheet.transformNodeToObject(this.targetContext.doc); 	
		    this.namespace = "xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";      
    	  Sarissa.setXpathNamespaces(layer, this.namespace);
   	  	objRef.targetModel.wfsFeature = layer.childNodes[0];
				objRef.targetModel.url=objRef.defaultModelUrl;

		    // load empty default model
    		var httpPayload=new Object();
		    httpPayload.url=objRef.defaultModelUrl;
		    httpPayload.method="get";
		    httpPayload.postData=null;
    		objRef.targetModel.newRequest(objRef.targetModel,httpPayload);
    	}
	  }
  	this.doAction = function(objRef,targetNode) {
    	if (objRef.enabled) {
    		point=objRef.mouseHandler.model.extent.getXY(targetNode.evpl);
	       old=objRef.targetModel.getXpathValue(
         objRef.targetModel,
         objRef.featureXpath);
  	    if(!old){
  	    //First point, make sure that it is put as point[0],point[1] without any whitespace
      	sucess=objRef.targetModel.setXpathValue(
	        objRef.targetModel,
  	      objRef.featureXpath,
    	    point[0]+","+point[1]);
    	    }
    	  else {
    	    //All other points need a space between them
    	    sucess=objRef.targetModel.setXpathValue(
	        objRef.targetModel,
  	      objRef.featureXpath,
    	    old+ " " +point[0]+","+point[1]);
    	    }
	      if(!sucess){
  	      alert("EditLine: invalid featureXpath in config: "+objRef.featureXpath);
    	  }
    	  //TBD: set this dynamic?
    	  //The WFS layer needs to be updated with the new coordinates.
    	  config.objects.mainMapWidget.MapLayerMgr.model.setParam("refreshOtherLayers");
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
