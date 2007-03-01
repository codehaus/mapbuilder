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

  //loading img to be displayed while models load
  var loadingSrc = widgetNode.selectSingleNode("mb:loadingSrc");
  if (loadingSrc) {
    this.loadingSrc = config.skinDir + loadingSrc.firstChild.nodeValue;
  } else {
    this.loadingSrc = config.skinDir + "/images/Loading.gif";
  }

  this.MapLayerMgr = new MapLayerMgr(this, model); //PatC
   
  this.model.addListener("refresh",this.paint, this);
  this.model.addListener("addLayer",this.addLayer, this);
  this.model.addListener("deleteLayer",this.deleteLayer, this);
  this.model.addListener("moveLayerUp",this.moveLayerUp, this);
  this.model.addListener("moveLayerDown",this.moveLayerDown, this);
  this.model.addListener("hidden",this.hiddenListener,this);
  this.model.addListener("transparancy",this.transparancyListener,this);
}

/**
 * Render the widget.
 * @param objRef Pointer to widget object.
 */
MapPane2.prototype.paint = function(objRef, refresh) {

  if (objRef.model.doc && objRef.node && (objRef.autoRefresh||refresh) ) {
     //confirm inputs
    if (objRef.debug) alert("painting:"+Sarissa.serialize(objRef.model.doc));
    if (objRef.debug) alert("stylesheet:"+Sarissa.serialize(objRef.stylesheet.xslDom));

    //debug output
    if (objRef.debug) {
      alert("painting:"+objRef.id+":"+s);
      if (config.serializeUrl) postLoad(config.serializeUrl, s);
    }

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
    
    
    var loaderNode = document.getElementById("loaderDiv");
    if(!loaderNode) {
      loaderNode = document.createElement("div");
      loaderNode.setAttribute("id","loaderDiv");
      loaderNode.style.position = "absolute"; 
      
      
      loaderNode.style.width=objRef.model.getWindowWidth()+"px";
      loaderNode.style.height=objRef.model.getWindowHeight()+"px";
      loaderNode.style.background="white";
      loaderNode.style.zIndex="2000";
      loaderNode.style.left='0px';
    loaderNode.style.top='0px';
    if(!_SARISSA_IS_IE) {
    loaderNode.style.opacity = ".7"
    }
    else {
    
     loaderNode.style.filter="alpha(opacity=0)";
    }
    outputNode.parentNode.appendChild(loaderNode);
    }


    var layers = objRef.model.getAllLayers();

    objRef.firstImageLoaded = false;

    objRef.layerCount = layers.length;
 
    for (var i=0;i<layers.length;i++) {
      //SMO: dit zou evt flickerbug kunnen oplossen
   
   
//alert('paint');
      objRef.MapLayerMgr.paint(objRef.MapLayerMgr,layers[i],i )

  
  }
  if(loaderNode){
     if(!_SARISSA_IS_IE) {outputNode.parentNode.removeChild(loaderNode);}
    // else outputNode.parentNode=outputNode.parentNode.removeChild(loaderNode);
    }
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
 * Adds a layer into the output
 * @param layerName the WMS anme for the layer to be removed
 */
MapPane2.prototype.addLayer = function(objRef, layerNode) {
  var layers = objRef.model.getAllLayers();
  var layerNum = layers.length -1;
  objRef.MapLayerMgr.paint(objRef.MapLayerMgr, layerNode, layerNum);
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
    alert("can't move node past beginning of list:"+layerName);
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
    alert("can't move node past end of list:"+layerName);
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

/**
   * Called when the context's hidden attribute changes.
   * @param objRef This object.
   * @param layerName  The name of the layer that was toggled.
   */
MapPane2.prototype.hiddenListener=function(objRef, layerName){
    var vis="visible";
    if(objRef.model.getHidden(layerName)=="1") {
      vis="hidden";
    }
    var layerId = objRef.model.id + "_" + objRef.id + "_" + layerName;
    var layer = document.getElementById(layerId);
    if (layer) {
      if(vis=="visible") layer.style.display='inline';
      else layer.style.display='none';
      layer.style.visibility=vis;
      imgId = "real"+layer.imgId;
      img = document.getElementById(imgId); // Hack to make sure that the child element is toggled in IE
      if(img) img.style.visibility=vis;
    }
  }

/**
   * Called when the context's transparancy attribute changes.
   * @param objRef This object.
   * @param layerName  The name of the layer that was toggled.
   */
MapPane2.prototype.transparancyListener=function(objRef, layerName){
    var transp = objRef.model.getTransparancy(layerName);
    var layerId = objRef.model.id + "_" + objRef.id + "_" + layerName;
    var layer = document.getElementById(layerId);
    if (layer) {
    
      if(_SARISSA_IS_IE) {
      var ietr = "alpha(opacity=" + transp + ")";
      for(var i=0;i<layer.childNodes.length;i++){
        layer.childNodes[i].style.filter=ietr;
        }
      }
      else {
       var fftr = transp / 100;
       layer.style.opacity=fftr;
      }
    }
  }

