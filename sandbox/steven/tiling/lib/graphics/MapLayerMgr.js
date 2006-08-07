/*
Author:       Patrice G. Cappelaere patAtcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: $
*/

// Ensure this object's dependancies are loaded.

mapbuilder.loadScript(baseDir+"/graphics/WmsLayer.js");
mapbuilder.loadScript(baseDir+"/graphics/TiledWmsLayer.js");

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
  
}

MapLayerMgr.prototype.paint=function(objRef,layerNode,layerNum){


 var layer = null;
  service=layerNode.selectSingleNode("wmc:Server/@service");
  if(service)service=service.nodeValue;
   
  var nodeName = layerNode.nodeName;
  //SMO: switch is faster
  if(service == "GoogleMap") {
    layer = new GoogleMapLayer( objRef.model, objRef.mapPane, "GoogleMapLayer", layerNode, false, true );
    objRef.layers.push( layer );
    //alert( "Add Google Layer, total Layers:"+objRef.layers.length)
  }// else if( (service == "wms") || (service == "OGC:WMS")) {
   // layer = objRef.addWmsLayer( objRef.model, objRef.mapPane, layerNode);
    //alert( "Added Wms Layer:"+layerNode.nodeName+", total Layers:"+objRef.layers.length)
 // } 
  else if( (service == "wms-c") || (service == "OGC:WMS-C") ||(service == "wms") || (service == "OGC:WMS")) {
    objRef.addTiledWmsLayer( objRef.model, objRef.mapPane, layerNode,layerNum);
    //alert( "Added Wms Layer:"+layerNode.nodeName+", total Layers:"+objRef.layers.length)
  } else if( nodeName.indexOf("RssLayer") >= 0 ) {
    var layerName = layerNode.getAttribute("id" );
    layer = new RssLayer( objRef.model, objRef.mapPane, layerName, layerNode, false, true );
    objRef.layers.push( layer );
    //alert( "Add Rss Layer, total Layers:"+objRef.layers.length)
  } else if( nodeName.indexOf("FeatureType") >= 0 ) {
    var layerName = layerNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
    if( objRef.getLayer(layerName) == null ) {
      layer = new WfsQueryLayer( layerNode.model, objRef.mapPane, layerName, layerNode, false, true );
      objRef.layers.push( layer );
      //alert( "Add Wfs Layer, total Layers:"+objRef.layers.length)
    }
  } else {
    alert( "Failed adding Layer:"+nodeName + " service:"+service );
  }
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
  * Method to add a TiledWmsLayer to the LayerList
  * @param objRef object pointer
  * @param layerNode the Layer node from another context doc or capabiltiies doc
  */
MapLayerMgr.prototype.addTiledWmsLayer = function(model, mapPane, layerNode,layerNum) {
   
  var layerNameNode = layerNode.selectSingleNode("wmc:Name");
  if( layerNameNode ) {
    layerName = layerNameNode.firstChild.nodeValue;
  } else {
    layerName = "UNKNOWN";
  }
  
  var queryable = layerNode.getAttribute("queryable");
  var visible = layerNode.getAttribute("hidden");
    
  var tiledWmsLayer = new TiledWmsLayer( model, mapPane, layerName, layerNode, queryable, visible );

  tiledWmsLayer.paint(this,layerNum);
}

