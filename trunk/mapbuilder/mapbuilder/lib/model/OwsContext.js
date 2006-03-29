/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

/**
 * Stores an OWS Context document as defined by the OGC interoperability
 * experiment. This model should be eventually merged with the standard OGC 
 * context doc.
 * Listeners supported by this model:
 * "refresh" called when window parameters (width/height, bbox) are changed
 * "hidden" called when visibilty of a layer is changed
 * "wfs_getFeature" called when feature resources are loaded
 *
 * @constructor
 * @base ModelBase
 * @author Mike Adair
 * @requires Sarissa
 * 
 */
function OwsContext(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  ModelBase.apply(this, new Array(modelNode, parent));

  this.namespace = "xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:xlink='http://www.w3.org/1999/xlink'";

  // ===============================
  // Update of Context Parameters
  // ===============================

  /**
   * Change a Layer's visibility.
   * @param layerName  The name of the layer that is to be changed
   * @param hidden     String with the value to be set; 1=hidden, 0=visible.
   */
  this.setHidden=function(layerName, hidden){
    // Set the hidden attribute in the Context
    var hiddenValue = "0";
    if (hidden) hiddenValue = "1";
      
    var layer=this.getFeatureNode(layerName);
    layer.setAttribute("hidden", hiddenValue);
    // Call the listeners
    this.callListeners("hidden", layerName);
  }

  /**
   * Get the layer's visiblity attribute value.
   * @param layerName  The name of the layer that is to be changed
   * @return hidden  String with the value; 1=hidden, 0=visible.
   */
  this.getHidden=function(layerName){
    var hidden=1;
    var layer=this.getFeatureNode(layerName)
    return layer.getAttribute("hidden");
  }

  /**
   * Get the BoundingBox.
   * @return BoundingBox array in form (xmin,ymin,xmax,ymax).
   */
  this.getBoundingBox=function() {
    // Extract BoundingBox from the context
    //boundingBox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    var lowerLeft=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:LowerCorner");
    var upperRight=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:UpperCorner");
    var strBbox = new String(lowerLeft.firstChild.nodeValue + " " + upperRight.firstChild.nodeValue).split(" ");
    var bbox = new Array();
    for (i=0; i<strBbox.length; ++i) {
      bbox[i] = parseFloat(strBbox[i]);
    }
    return bbox;
  }

  /**
   * Set the BoundingBox element and call the refresh listeners
   * @param boundingBox array in the sequence (xmin, ymin, xmax, ymax).
   */
  this.setBoundingBox=function(boundingBox) {
    // Set BoundingBox in context
    var lowerLeft=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:LowerCorner");
    lowerLeft.firstChild.nodeValue = boundingBox[0] + " " + boundingBox[1];
    var upperRight=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:UpperCorner");
    upperRight.firstChild.nodeValue = boundingBox[2] + " " + boundingBox[3];
    // Call the listeners
    //PGC this.callListeners("bbox");
    this.callListeners("bbox", boundingBox); // from Context.js
    
  }

  /*PGC Added from Context.js */
  /**
   * Set the BoundingBox element and call the refresh listeners
   * @param boundingBox array in the sequence (xmin, ymin, xmax, ymax).
   */
  this.initBbox=function(objRef) {
    // Set BoundingBox in context from URL CGI params
    if (window.cgiArgs["bbox"]) {     //set as minx,miny,maxx,maxy
      var boundingBox = window.cgiArgs["bbox"].split(',');
      objRef.setBoundingBox(boundingBox);
    }
  }
  this.addListener( "loadModel", this.initBbox, this );  // removed the comment
  //this.addListener( "contextLoaded", this.initBbox, this );

  /**
   * Set the aoi param and call the refresh listeners
   * @param boundingBox array in the sequence (xmin, ymin, xmax, ymax).
   */
  this.initAoi=function(objRef) {
    // Set AOI of context from URL CGI params
    if (window.cgiArgs["aoi"]) {      //set as ul,lr point arrays
      var aoi = window.cgiArgs["aoi"].split(',');
      objRef.setParam("aoi",new Array(new Array(aoi[0],aoi[3]),new Array(aoi[2],aoi[1])));
    }
  }
  this.addListener( "loadModel", this.initAoi, this );
  //MA this.addListener( "contextLoaded", this.initAoi, this );
  /*End of addition */
  
  /**
   * Set the Spacial Reference System for layer display and layer requests.
   * @param srs The Spatial Reference System.
   */
  this.setSRS=function(srs) {
    //bbox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    var bbox=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox");
    bbox.setAttribute("crs",srs);
    this.callListeners("srs");
  }

  /**
   * Set the Spacial Reference System for layer display and layer requests.
   * @return srs The Spatial Reference System.
   */
  this.getSRS=function() {
    //bbox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    if( this.doc ) {
      var bbox=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox");
      srs=bbox.getAttribute("crs");
      return srs;
    } 
  }

  /**
   * Get the Window width.
   * @return width The width of map window from the context document
   */
  this.getWindowWidth=function() {
    if( this.doc ) {
      //var win=this.doc.documentElement.getElementsByTagName("Window").item(0);
      var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
      width=win.getAttribute("width");
      return width;
    }
  }

  /**
   * Set the Window width.
   * @param width The width of map window (therefore of map layer images).
   */
  this.setWindowWidth=function(width) {
    //win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
    win.setAttribute("width", width);
    this.callListeners("resize");
  }

  /**
   * Get the Window height.
   * @return height The height of map window from the context document.
   */
  this.getWindowHeight=function() {
    //var win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    if( this.doc ) {
      var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
      height=win.getAttribute("height");
      return height;
    }
  }

  /**
   * Set the Window height.
   * @param height The height of map window (therefore of map layer images).
   */
  this.setWindowHeight=function(height) {
    //win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
    win.setAttribute("height", height);
    this.callListeners("resize");
  }

  /**
   * Returns the serverUrl for the layer passed in as the feature argument.
   * @param requestName ignored for context docs (only GetMap supported)
   * @param method ignored for context docs (only GET supported)
   * @param feature the node for the feature from the context doc
   * @return height String URL for the GetMap request
   */
  this.getServerUrl = function(requestName, method, feature) {
    return feature.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
  }

  /**
   * Returns the WMS version for the layer passed in as the feature argument
   * @param feature the node for the feature from the context doc
   * @return the WMS GetMap version for the Layer.
   */
  this.getVersion = function(feature) {  
    return feature.selectSingleNode("wmc:Server").getAttribute("version");
  }

  /**
   * Get HTTP method for the specified feature
   * @param feature the Layer node from the context doc
   * @return the HTTP method to get the feature with
   */
  this.getMethod = function(feature) {
    return feature.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("wmc:method");
  }

  /**
   * returns a node that has the specified feature name in the context doc
   * @param featureName Name element value to return
   * @return the node from the context doc with the specified feature name
   */
  this.getFeatureNode = function(featureName) {
    if( this.doc ) {
	    var feature = this.doc.selectSingleNode("//wmc:ResourceList/*[wmc:Name='"+featureName+"']");
	    
	    if(feature == null ) {
        alert( "feature not found" );
	    } 
      	
	    return feature;
    }
  }

  /**
   * listener method which loads WFS features from the context doc, after WMS 
   * layers are loaded.
   * @param objRef Pointer to this object.
   */
  this.loadFeatures = function(objRef) {
    var nodeSelectXpath = objRef.nodeSelectXpath + "/wmc:FeatureType[wmc:Server/@service='OGC:WFS']/wmc:Name";
    var featureList = objRef.doc.selectNodes(nodeSelectXpath);
    for (var i=0; i<featureList.length; i++) {
      var featureName = featureList[i].firstChild.nodeValue;
      objRef.setParam('wfs_GetFeature',featureName);
    }
    
    //this.callListeners("contextLoaded");  //PGC
  }
  this.addListener("loadModel", this.loadFeatures, this);

  /**
   * Listener function which sets stylesheet params for WebServiceRequests
   * @param objRef pointer to this object
   * @param featureNodeId the id of the node in the doc to be processed by the stylesheet
   */
  this.setRequestParameters = function(featureName, requestStylesheet) {
    var feature = this.getFeatureNode(featureName);
    if (feature.selectSingleNode("ogc:Filter")) {
      requestStylesheet.setParameter("filter", escape(Sarissa.serialize(feature.selectSingleNode("ogc:Filter"))) );
    }
  }
  //this.addFirstListener("wfs_GetFeature", this.setRequestParameters, this);

  /**
   * Method to get a list of queryable layers
   * @return the list with queryable layers
   */
  this.getQueryableLayers = function() {
    var listNodeArray = this.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[attribute::queryable='1']/wmc:Name");
    return listNodeArray;
  }

  /**
   * Method to get a list of all layers in the context doc
   * TBD: merge this with above, passing queryable as an optional boolean param?
   * @return the list with all layers
   */
  this.getAllLayers = function() {
    var listNodeArray = this.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:Layer");
    return listNodeArray;
  }

  /**
   * Method to get a layer with the specified name in the context doc
   * @param layerName the layer to be returned
   * @return the list with all layers
   */
  this.getLayer = function(layerName) {
    var layer = this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[wmc:Name='"+layerName+"']");
    //TBD: add in time stamp
    return layer;
  }

  /* PGC Added from Context.js */
  /**
   * Method to add a Layer to the LayerList
   * @param layerNode the Layer node from another context doc or capabiltiies doc
   */
  this.addLayer = function(objRef, layerNode) { 
    if( objRef.doc != null ) {
      var parentNode = objRef.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList");
   
      var node = objRef.doc.importNode(layerNode,true);
      parentNode.appendChild( node );
      objRef.modified = true;
      //alert( "Adding layer:"+Sarissa.serialize( layerNode ) );
    } else {
      alert( "null OWSContext doc" );
    }
    //objRef.callListeners("refresh");
  }
  this.addFirstListener( "addLayer", this.addLayer, this );

  /**
   * Method to remove a Layer from the LayerList
   * @param layerName the Layer to be deleted
   */
  this.deleteLayer = function(objRef, layerName) {
    var deletedNode = objRef.getLayer(layerName);
    if (!deletedNode) {
      alert("node note found; unable to delete node:"+layerName);
      return;
    }
    deletedNode.parentNode.removeChild(deletedNode);
    objRef.modified = true;
  }
  this.addFirstListener( "deleteLayer", this.deleteLayer, this );

  /**
   * Method to move a Layer in the LayerList up
   * @param layerName the layer to be moved
   */
  this.moveLayerUp = function(objRef, layerName) {
    var movedNode = objRef.getLayer(layerName);
    var sibNode = movedNode.selectSingleNode("following-sibling::*");
    if (!sibNode) {
      alert("can't move node past beginning of list:"+layerName);
      return;
    }
    movedNode.parentNode.insertBefore(sibNode,movedNode);
    objRef.modified = true;
  }
  this.addFirstListener( "moveLayerUp", this.moveLayerUp, this );

  /**
   * Method to move a Layer in the LayerList down
   * @param layerName the layer to be moved
   */
  this.moveLayerDown = function(objRef, layerName) {
    var movedNode = objRef.getLayer(layerName);
    var listNodeArray = movedNode.selectNodes("preceding-sibling::*");  //preceding-sibling axis contains all previous siblings
    var sibNode = listNodeArray[listNodeArray.length-1];
    if (!sibNode) {
      alert("can't move node past beginning of list:"+layerName);
      return;
    }
    movedNode.parentNode.insertBefore(movedNode,sibNode);
    objRef.modified = true;
  }
  this.addFirstListener( "moveLayerDown", this.moveLayerDown, this );
  /*PGC End of Addition */
}

