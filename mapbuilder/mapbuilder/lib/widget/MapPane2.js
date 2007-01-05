/*
Author:       Cameron Shorter cameronAtshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: MapPane.js 1918 2006-02-13 22:31:26 -0500 (Mon, 13 Feb 2006) cappelaere $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
mapbuilder.loadScript(baseDir+"/graphics/MapLayerMgr.js");

/**
 * Widget to render a map from an OGC context document.  The layers are rendered
 * as an array of DHTML layers that contain an <IMG> tag with src attribute set 
 * to the GetMap request.
 * @constructor
 * @base WidgetBaseXSL
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function MapPane2(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));
  MapContainerBase.apply(this,new Array(widgetNode, model));

  // Set this.stylesheet
  // Defaults to "widget/<widgetName>.xsl" if not defined in config file.
  if ( !this.stylesheet ) {
    var styleNode = widgetNode.selectSingleNode("mb:stylesheet");
    if (styleNode ) {
      this.stylesheet = new XslProcessor(styleNode.firstChild.nodeValue,model.namespace);
    } else {
      this.stylesheet = new XslProcessor(baseDir+"/widget/"+widgetNode.nodeName+".xsl",model.namespace);
    }
  }

  //loading img to be displayed while models load
  var loadingSrc = widgetNode.selectSingleNode("mb:loadingSrc");
  if (loadingSrc) {
    this.loadingSrc = config.skinDir + loadingSrc.firstChild.nodeValue;
  } else {
    this.loadingSrc = config.skinDir + "/images/Loading.gif";
  }

  // Set stylesheet parameters for all the child nodes from the config file
  for (var j=0;j<widgetNode.childNodes.length;j++) {
    if (widgetNode.childNodes[j].firstChild
      && widgetNode.childNodes[j].firstChild.nodeValue)
    {
      this.stylesheet.setParameter(
        widgetNode.childNodes[j].nodeName,
        widgetNode.childNodes[j].firstChild.nodeValue);
    }
  }

  //all stylesheets will have these properties available
  this.stylesheet.setParameter("modelId", this.model.id );
  this.stylesheet.setParameter("modelTitle", this.model.title );
  this.stylesheet.setParameter("widgetId", this.id );
  this.stylesheet.setParameter("skinDir", config.skinDir );
  this.stylesheet.setParameter("lang", config.lang );

  this.MapLayerMgr = new MapLayerMgr(this, model); //PatC
  
 
  this.model.addListener("refresh",this.paint, this);
  //this.model.addListener("addLayer",this.addLayer, this);
  this.model.addListener("deleteLayer",this.deleteLayer, this);
  this.model.addListener("moveLayerUp",this.moveLayerUp, this);
  this.model.addListener("moveLayerDown",this.moveLayerDown, this);
  //this.model.addListener("newModel",this.clearWidget2,this);
  //this.model.addListener("bbox",this.clearWidget2,this);
 
}

/**
 * Render the widget.
 * @param objRef Pointer to widget object.
 */
MapPane2.prototype.paint = function(objRef, refresh) {

  if (objRef.model.doc && objRef.node && (objRef.autoRefresh||refresh) ) {
    //if (objRef.debug) mbDebugMessage(objRef, "source:"+Sarissa.serialize(objRef.model.doc));

    objRef.stylesheet.setParameter("width", objRef.model.getWindowWidth());
    objRef.stylesheet.setParameter("height", objRef.model.getWindowHeight());
    objRef.stylesheet.setParameter("bbox", objRef.model.getBoundingBox().join(","));
    objRef.stylesheet.setParameter("srs", objRef.model.getSRS());

    //confirm inputs
    if (objRef.debug) mbDebugMessage(objRef, "painting:"+Sarissa.serialize(objRef.model.doc));
    if (objRef.debug) mbDebugMessage(objRef, "stylesheet:"+Sarissa.serialize(objRef.stylesheet.xslDom));

    //process the doc with the stylesheet
    var tempDom = objRef.stylesheet.transformNodeToObject(objRef.model.doc);
    if( tempDom.parseError != 0 ) {
        alert(objRef.getMessage("parseError", Sarissa.getParseErrorText(tempDom)));
    }
    
    var tempNodeList = tempDom.selectNodes("//img");

    //debug output
    if (objRef.debug) {
      var s = objRef.stylesheet.transformNodeToString(objRef.model.doc);
      mbDebugMessage(objRef, "painting:"+objRef.id+":"+s);
      if (config.serializeUrl) postLoad(config.serializeUrl, s);
    }

    // This is done on newModel only and called by clearWidget2
    objRef.MapLayerMgr.deleteAllLayers();
 
    //create a DIV to hold all the individual image DIVs
    var outputNode = document.getElementById( objRef.outputNodeId );
    if (!outputNode) {
      outputNode = document.createElement("div");
      outputNode.setAttribute("id", objRef.outputNodeId);
      outputNode.style.position = "absolute"; 
      objRef.node.appendChild(outputNode);
      outputNode.style.left='0px';
      outputNode.style.top='0px';
    } 
     
    // loop through all layers and create an array of IMG objects for preloading 
    // the WMS getMap calls
    var layers = objRef.model.getAllLayers();
    // if (!objRef.imageStack) objRef.imageStack = new Array(layers.length);
    objRef.firstImageLoaded = false;

    objRef.layerCount = layers.length;

    for (var i=0;i<layers.length;i++) {
      var layer = objRef.MapLayerMgr.addLayer(objRef.MapLayerMgr,layers[i] )
      if(tempNodeList[i])newSrc = tempNodeList[i].getAttribute("src");
      if(layer.setSrc)layer.setSrc(newSrc)
    }
    var message = objRef.getMessage((objRef.layerCount>1) ? "loadingLayers" : "loadingLayer",
      objRef.layerCount);
    objRef.model.setParam("modelStatus", message);
    
    objRef.MapLayerMgr.paintWmsLayers( objRef.MapLayerMgr );
  }
}

/**
  * returns layer node from LayerMgr
  * @param layerName The layer Id.
  */
MapPane2.prototype.getLayer = function(layerName) {
  return this.MapLayerMgr( layerName );
}

/**
 * Returns an ID for the image DIV given a layer name
 * @param layerName the name of the WMS layer
 */
MapPane2.prototype.getLayerDivId = function(layerName) {
  return this.model.id +"_"+ this.id +"_"+ layerName; //TBD: add in timestamps
}

/**
 * Removes a layer from the output
 * @param objRef Pointer to this object.
 * @param layerName the WMS anme for the layer to be removed
 */
MapPane2.prototype.deleteLayer = function(objRef, layerName) {
  var imgDivId = objRef.getLayerDivId(layerName); 
  if( imgDivId != null ) {
    var imgDiv = document.getElementById(imgDivId);
    if( imgDiv != null ) {
      var outputNode = document.getElementById( objRef.outputNodeId );
      outputNode.removeChild(imgDiv);
    }
  }
}

/**
 * Moves a layer up in the stack of map layers
 * @param objRef Pointer to this object.
 * @param layerName the WMS anme for the layer to be removed
 */
MapPane2.prototype.moveLayerUp = function(objRef, layerName) {
  var outputNode = document.getElementById( objRef.outputNodeId );
  var imgDivId = objRef.getLayerDivId(layerName); 
  var movedNode = document.getElementById(imgDivId);
  var sibNode = movedNode.nextSibling;
  if (!sibNode) {
    alert(objRef.getMessage("cantMoveUp", layerName));
    return;
  }
  outputNode.insertBefore(sibNode,movedNode);
}

/**
 * Moves a layer up in the stack of map layers
 * @param objRef Pointer to this object.
 * @param layerName the WMS name for the layer to be removed
 */
MapPane2.prototype.moveLayerDown = function(objRef, layerName) {
  var outputNode = document.getElementById( objRef.outputNodeId );
  var imgDivId = objRef.getLayerDivId(layerName); 
  var movedNode = document.getElementById(imgDivId);
  var sibNode = movedNode.previousSibling;
  if (!sibNode) {
    alert(objRef.getMessage("cantMoveDown", layerName));
    return;
  }
  outputNode.insertBefore(movedNode,sibNode);
}

/**
 * This function is called when a new Context is about to be loaded
 * - it deletes all the old layers so new ones can be loaded.
 * TBD: This should be renamed to clearWidget, except inheritence
 * is not working if we do that and it doesn't get called.
 * @param objRef Pointer to this object.
 */
MapPane2.prototype.clearWidget2 = function(objRef) {
  objRef.MapLayerMgr.deleteAllLayers();
}



