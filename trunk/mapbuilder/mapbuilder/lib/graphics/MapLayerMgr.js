/*
Author:       Patrice G. Cappelaere patAtcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: $
*/

// Ensure this object's dependancies are loaded.

mapbuilder.loadScript(baseDir+"/graphics/WmsLayer.js");

//@TODO move out
mapbuilder.loadScript(baseDir+"/graphics/GoogleMapLayer.js");

/**
  * Keeps an ordered array of layers
  * A Layer of proper (WMS, GML...) type is instantiated when addLayer is called
  * Layer Manager calls the paint function for all layers in the list
  * paint function is layer specific
  * @param mapPane mapPane object
  * @param model current model
  */
function MapLayerMgr(mapPane, model) {
  this.layers   = new Array();
  this.mapPane  = mapPane;
  this.model    = model;
  
  this.namespace = "xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder' xmlns:wmc='http://www.opengis.net/context' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'";
  
  // create imageStack
  this.imageStack = new Array(); //new Array(layers.length);
  
  this.model.addListener("addLayer",this.addLayer, this);
  this.model.addListener("deleteLayer",this.deleteLayer, this);
  this.model.addListener("hidden",this.hiddenListener, this);
  this.model.addListener("contextLoaded",this.setLayersFromContext, this);
}

 /**
   * Called when the context's hidden attribute changes.
   * @param objRef This object.
   * @param layerName  The name of the layer that was toggled.
   */
MapLayerMgr.prototype.hiddenListener=function(objRef, layerName){
  var vis="visible";
  //alert("MapLayerMgr.hiddenListener layerName="+layerName);
  if(objRef.model.getHidden(layerName)=="1") {
    vis="hidden";
  }
  var layerId = objRef.model.id + "_" + objRef.mapPane.id + "_" + layerName;
  var layer = document.getElementById(layerId);
  if (layer) {
    layer.style.visibility=vis;
    imgId = "real"+layer.imgId;
    img = document.getElementById(imgId); // Hack to make sure that the child element is toggled in IE
    if(img) img.style.visibility=vis;
  } else {
    layer = objRef.model.getFeatureNode( layerName );
    var id = layer.selectSingleNode("@id").nodeValue + "_vector";
    layer = document.getElementById(id);
    if (layer) {
      layer.setAttribute("visibility", vis);  //svg
      layer.style.visibility=vis; //vml
    }
  }
}
  
/**
  * Load all layers from context document when it is loaded
  * @param objRef Pointer to widget object
  */
MapLayerMgr.prototype.setLayersFromContext = function(objRef) {
 // add all the layers from the context document
  var contextLayers = objRef.model.getAllLayers();
  for(var i=0;i<contextLayers.length;i++){
    var layer = contextLayers[i];
    objRef.addLayer( objRef, layer ); 
  }
}

/**
  * Instantiate a layer of the righ type
  * @param objRef
  * @param layerNode  Layer node element from WMC/OWSContext document 
  */
MapLayerMgr.prototype.addLayer = function(objRef, layerNode) {
    
  service=layerNode.selectSingleNode("wmc:Server/@service");
  if(service)service=service.nodeValue;
  
  var nodeName = layerNode.nodeName;
  if(service == "GoogleMap") {
    var layer = new GoogleMapLayer( objRef.model, objRef.mapPane, "GoogleMapLayer", layerNode, false, true );
    objRef.layers.push( layer );
  } else if( (service == "wms") || (service == "OGC:WMS")) {
    objRef.addWmsLayer( objRef, layerNode);
  } else if( nodeName.indexOf("RssLayer") >= 0 ) {
    var layer = new RssLayer( objRef.model, objRef.mapPane, "RssLayer", layerNode, false, true );
    objRef.layers.push( layer );
  } else {
    alert( "Failed adding Layer:"+nodeName + " service:"+service );
  }
}

/**
  * Method to add a WmsLayer to the LayerList
  * @param objRef object pointer
  * @param layerNode the Layer node from another context doc or capabiltiies doc
  */
MapLayerMgr.prototype.addWmsLayer = function(objRef, layerNode) {
   
  var layerNameNode = layerNode.selectSingleNode("wmc:Name");
  if( layerNameNode ) {
    layerName = layerNameNode.firstChild.nodeValue;
  } else {
    layerName = "UNKNOWN";
  }
  
  var queryable = layerNode.getAttribute("queryable");
  var visible = layerNode.getAttribute("hidden");
    
  var layer = new WmsLayer( objRef.model, objRef.mapPane, layerName, layerNode, queryable, visible );

 // process the doc with the stylesheet
  objRef.mapPane.stylesheet.setParameter("width", objRef.model.getWindowWidth());
  objRef.mapPane.stylesheet.setParameter("height", objRef.model.getWindowHeight());
  objRef.mapPane.stylesheet.setParameter("bbox", objRef.model.getBoundingBox().join(","));
  objRef.mapPane.stylesheet.setParameter("srs", objRef.model.getSRS());
  
  var s = objRef.mapPane.stylesheet.transformNodeToString(layerNode);
  
  var tempNode = document.createElement("div");
  tempNode.innerHTML = s;
  var newSrc = tempNode.firstChild.firstChild.getAttribute("src"); 
  layer.setSrc( newSrc );
  
  objRef.imageStack.push(new Image());
  objRef.imageStack[objRef.imageStack.length-1].objRef = objRef;
  
  objRef.layers.push( layer );
}

/**
  * Called by MapPane.paint
  * Calls MapLayer.paint for all defined layers
  * @param objRef Pointer to widget object.
  */
MapLayerMgr.prototype.paint = function( objRef ) {
  if (!this.imageStack) 
    this.imageStack = new Array(this.layers.length);
    
  this.firstImageLoaded = false;
  
  //process the doc with the stylesheet
  this.mapPane.stylesheet.setParameter("width",   this.model.getWindowWidth());
  this.mapPane.stylesheet.setParameter("height",  this.model.getWindowHeight());
  this.mapPane.stylesheet.setParameter("bbox",    this.model.getBoundingBox().join(","));
  this.mapPane.stylesheet.setParameter("srs",     this.model.getSRS());
  
  //loop through all layers 
  for (var i=0;i<this.layers.length;i++) {
    var layer = this.layers[i];
    
    // deal with WMS layer type, we need some pre-processing
    if( layer.isWmsLayer() ) {
      var s = this.mapPane.stylesheet.transformNodeToString(layer.layerNode);
     
      var tempNode = document.createElement("div");
      tempNode.innerHTML = s;
      var newSrc = tempNode.firstChild.firstChild.getAttribute("src");

      layer.setSrc( newSrc );

      if (!this.imageStack[i]) {
	      this.imageStack[i] = new Image();
	      this.imageStack[i].objRef = objRef;
	    }
	  }
	  // now paint it WMS or not
	  layer.paint(objRef, this.imageStack[i],i);
  }
}
  

/**
 * Method to get a list of all layers 
 * @return the list with all layers
 */
MapLayerMgr.prototype.getAllLayers = function() {
 return layers;
}

 /**
   * Method to get a layer with the specified name
   * @param layerName the layer to be returned
   * @return the layer or null
   */
MapLayerMgr.prototype.getLayer = function(layerName) {
  for( var i=0; i<layers.length; i++ ) {
    if( layer[i].layerName.equalsIgnoreCase(layerName) )
      return layer;
  }
  return null;
}

/**
  * Method to remove a Layer from the LayerList
  * @param objRef Pointer to widget object.
  * @param layerName the Layer to be deleted
  */
MapLayerMgr.prototype.deleteLayer = function(objRef, layerName) {
  for( var i=0; i<layers.length; i++ ) {
  if( layer[i].layerName.equalsIgnoreCase(layerName) )
    layers = layers.splice(i, 1);
  }
}
