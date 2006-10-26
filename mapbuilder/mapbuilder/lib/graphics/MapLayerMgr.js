/*
Author:       Patrice G. Cappelaere patAtcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: $
*/

// Ensure this object's dependancies are loaded.

mapbuilder.loadScript(baseDir+"/graphics/WmsLayer.js");
//mapbuilder.loadScript(baseDir+"/graphics/FeatureLayer.js");
//mapbuilder.loadScript(baseDir+"/graphics/RssLayer.js");
mapbuilder.loadScript(baseDir+"/graphics/GmlLayer.js");

//should be pulled in by google tool
//mapbuilder.loadScript(baseDir+"/graphics/GoogleMapLayer.js");

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
  this.id       = "MapLayerMgr";
  
  this.namespace = "xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder' xmlns:wmc='http://www.opengis.net/context' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'";
  
  // create imageStack
  //this.imageStack = new Array(); //new Array(layers.length);
  
  this.model.addListener("addLayer",this.addLayer, this);
  this.model.addListener("deleteLayer",this.deleteLayer, this);
  this.model.addListener("hidden",this.hiddenListener, this);
  //this.model.addListener("contextLoaded",this.setLayersFromContext, this);
  //this.model.addListener("loadModel",this.setLayersFromContext, this);
  this.model.addListener("refreshWmsLayers",this.refreshWmsLayers,this);
  this.model.addListener("refreshOtherLayers",this.paintOtherLayers,this);
  this.model.addListener("timestamp",this.timestampListener,this);
  
}

/**
  * Called after a feature has been added to a WFS.  This function triggers
  * the WMS basemaps to be redrawn.  A timestamp param is added to the URL
  * to ensure the basemap image is not cached.
  * @param objRef Pointer to this object.
  */
MapLayerMgr.prototype.refreshWmsLayers=function(objRef){
  objRef.d=new Date();
  objRef.stylesheet.setParameter("uniqueId",objRef.d.getTime());
  objRef.paintWmsLayers(objRef);
}
   
   /**
   * Called when the map timestamp is changed so set the layer visiblity.
   * @param objRef This object.
   * @param timestampIndex  The array index for the layer to be displayed. 
   */
MapLayerMgr.prototype.timestampListener = function(objRef, timestampIndex){
    var layerName = objRef.model.timestampList.getAttribute("layerName");
    var timestamp = objRef.model.timestampList.childNodes[timestampIndex];
    var vis = (timestamp.getAttribute("current")=="1") ? "visible":"hidden";
    var layerId = objRef.model.id + "_" + objRef.id + "_" + layerName + "_" + timestamp.firstChild.nodeValue;
    var layer = document.getElementById(layerId);
    if (layer) {
      layer.style.visibility=vis;
    } else {
      alert("error finding layerId:"+layerId);
    }
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
  * @param objRef Pointer to this object
  */
MapLayerMgr.prototype.setLayersFromContext = function(objRef) {
 // add all the layers from the context document
  var contextLayers = objRef.model.getAllLayers();
  for(var i=0;i<contextLayers.length;i++){
    var layer = contextLayers[i];
    objRef.addLayer( objRef, layer ); 
  }
  //objRef.paint(objRef);
}

/**
  * Instantiate a layer of the righ type
  * @param objRef Pointer to this object
  * @param layerNode  Layer node element from WMC/OWSContext document 
  */
MapLayerMgr.prototype.addLayer = function(objRef, layerNode) {
  var layer = null;
  service=layerNode.selectSingleNode("wmc:Server/@service");
  if(service)service=service.nodeValue;
   
  var nodeName = layerNode.nodeName;

  // GoogleMap
  if(service == "GoogleMap") {
    layer = new GoogleMapLayer( objRef.model, objRef.mapPane, "GoogleMapLayer", layerNode, false, true );
    objRef.layers.push( layer );

  // WMS
  } else if( (service == "wms") || (service == "OGC:WMS")) {
    layer = objRef.addWmsLayer( objRef.model, objRef.mapPane, layerNode);

  // GML2
  } else if( (service == "gml") || (service == "OGC:GML")) {
    layerName=layerNode.selectSingleNode("Title");
    layerName = layerNode.selectSingleNode("wmc:Name");
    if(layerName){
      layerName=layerName.firstChild.nodeValue;
    }else{
      layerName="gml";
    }

    url=layerNode.selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");
    if(url){
      url=url.nodeValue;
      layerNode=Sarissa.getDomDocument();
      layerNode.async=false;
      layerNode.validateOnParse=false; //IE6 SP2 parsing bug
      layerNode.load(url);
      if(layerNode.parseError<0)alert("MapLayerMgr - error loading GML: "+url);
      layer = new GmlLayer( objRef.model, objRef.mapPane, layerName, layerNode, false, true );
          objRef.layers.push( layer );
    }

  // GeoRss
  } else if( (service == "GeoRss2")) {
  //} else if( nodeName.indexOf("RssLayer") >= 0 ) {
    var layerName = layerNode.getAttribute("id" );
    layer = new RssLayer( objRef.model, objRef.mapPane, layerName, layerNode, false, true );
    objRef.layers.push( layer );

  // WfsQueryLayer
  } else if( nodeName.indexOf("FeatureType") >= 0 ) {
    var layerName = layerNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
    if( objRef.getLayer(layerName) == null ) {
      //layer = new WfsQueryLayer( layerNode.model, objRef.mapPane, layerName, layerNode, false, true );
      layer = new WfsQueryLayer( objRef.model, objRef.mapPane, layerName, layerNode, false, true );
      objRef.layers.push( layer );
    }

  // Unknown layer
  } else {
    alert( "Failed adding Layer:"+nodeName + " service:"+service );
  }
  return layer
}

/**
  * Method to add a WmsLayer to the LayerList
  * @param objRef object pointer
  * @param layerNode the Layer node from another context doc or capabiltiies doc
  */
MapLayerMgr.prototype.addWmsLayer = function(model, mapPane, layerNode) {
   
  var layerNameNode = layerNode.selectSingleNode("wmc:Name");
  if( layerNameNode ) {
    layerName = layerNameNode.firstChild.nodeValue;
  } else {
    layerName = "UNKNOWN";
  }
  
  var queryable = layerNode.getAttribute("queryable");
  var visible = layerNode.getAttribute("hidden");
    
  var layer = new WmsLayer( model, mapPane, layerName, layerNode, queryable, visible );
  
  mapPane.MapLayerMgr.layers.push( layer );
  return layer;
}

/**
  * Called by MapPane.paint
  * Calls MapLayer.paint for all defined layers
  * @param objRef Pointer to widget object.
  */
MapLayerMgr.prototype.paintWmsLayers = function( objRef ) {
  
  //alert( "wmslayers:"+ objRef.layers.length)
  //loop through all layers 
  for (var i=0;i< objRef.layers.length;i++) {
    var layer = objRef.layers[i];
    
    if( layer.isWmsLayer() )
            layer.paint(objRef, null, i);
  }
}
  
  /**
  * Called by MapPane.paint
  * Calls MapLayer.paint for all defined layers
  * @param objRef Pointer to widget object.
  */
MapLayerMgr.prototype.paintOtherLayers = function( objRef ) {
  
  //loop through all layers 
  //alert( "otherlayers:"+objRef.layers.length)
  var count=0;
  for (var i=0;i< objRef.layers.length;i++) {
    var layer = objRef.layers[i];
    
    if( !layer.isWmsLayer() ) {
            layer.paint(objRef, null, i);
      count++;
    }
  }
  //alert("painted:"+count+" others")
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
  for( var i=0; i<this.layers.length; i++ ) {
    if( this.layers[i].layerName == layerName ) {
      return this.layers[i];
    }
  }
  return null;
}

/**
  * Remove all layers (usually triggered by changing the context
  * that this MapPane depends upon.
  */
MapLayerMgr.prototype.deleteAllLayers = function() {
  if(this.layers){
    for (var i=0;i<this.layers.length;i++) {
      var layer = this.layers[i]; 
      layer.unpaint();
    }
  }
  this.layers=null;
  this.layers=new Array();
}

/**
  * Method to remove a Layer from the LayerList.
  * @param layerName the Layer to be deleted
  */
MapLayerMgr.prototype.deleteLayer = function(objRef, layerName) {
  for( var i=0; i<objRef.layers.length; i++ ) {
    var layer = objRef.layers[i]; 
    if( layer.layerName == layerName ) {
      layer.unpaint();
      layers = objRef.layers.splice(i, 1);
    }
  }
}
