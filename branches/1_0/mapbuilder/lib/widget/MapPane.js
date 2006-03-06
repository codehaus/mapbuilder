/*
Author:       Cameron Shorter cameronAtshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");

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
function MapPane(widgetNode, model) {
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


  /**
   * Called when the context's hidden attribute changes.
   * @param objRef This object.
   * @param layerName  The name of the layer that was toggled.
   */
  this.hiddenListener=function(objRef, layerName){
    var vis="visible";
    if(objRef.model.getHidden(layerName)=="1") {
      vis="hidden";
    }
    var layerId = objRef.model.id + "_" + objRef.id + "_" + layerName;
    var layer = document.getElementById(layerId);
    if (layer) {
      layer.style.visibility=vis;
      imgId = "real"+layer.imgId;
      img = document.getElementById(imgId); // Hack to make sure that the child element is toggled in IE
      if(img) img.style.visibility=vis;
    }
  }
  this.model.addListener("hidden",this.hiddenListener,this);

  /**
   * Called after a feature has been added to a WFS.  This function triggers
   * the WMS basemaps to be redrawn.  A timestamp param is added to the URL
   * to ensure the basemap image is not cached.
   */
  this.refreshWmsLayers=function(objRef){
    objRef.d=new Date();
    objRef.stylesheet.setParameter("uniqueId",objRef.d.getTime());
    objRef.paint(objRef);
  }
  this.model.addListener("refreshWmsLayers",this.refreshWmsLayers,this);

  this.model.addListener("refresh",this.paint, this);
  this.model.addListener("addLayer",this.addLayer, this);
  this.model.addListener("deleteLayer",this.deleteLayer, this);
  this.model.addListener("moveLayerUp",this.moveLayerUp, this);
  this.model.addListener("moveLayerDown",this.moveLayerDown, this);
}

/**
 * Render the widget.
 * @param objRef Pointer to widget object.
 */
MapPane.prototype.paint = function(objRef, refresh) {

  if (objRef.model.doc && objRef.node && (objRef.autoRefresh||refresh) ) {
    //if (objRef.debug) alert("source:"+Sarissa.serialize(objRef.model.doc));

    objRef.stylesheet.setParameter("width", objRef.model.getWindowWidth());
    objRef.stylesheet.setParameter("height", objRef.model.getWindowHeight());
    objRef.stylesheet.setParameter("bbox", objRef.model.getBoundingBox().join(","));
    objRef.stylesheet.setParameter("srs", objRef.model.getSRS());

    //confirm inputs
    if (objRef.debug) alert("painting:"+Sarissa.serialize(objRef.model.doc));
    if (objRef.debug) alert("stylesheet:"+Sarissa.serialize(objRef.stylesheet.xslDom));

    //process the doc with the stylesheet
    var tempDom = objRef.stylesheet.transformNodeToObject(objRef.model.doc);
    var tempNodeList = tempDom.selectNodes("//img");

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

    //loop through all layers and create an array of IMG objects for preloading 
    // the WMS getMap calls
    var layers = objRef.model.getAllLayers();
    if (!objRef.imageStack) objRef.imageStack = new Array(layers.length);
    objRef.firstImageLoaded = false;

    objRef.layerCount = layers.length;

    for (var i=0;i<layers.length;i++){
      if (!objRef.imageStack[i]) {
        objRef.imageStack[i] = new Image();
        objRef.imageStack[i].objRef = objRef;
      }
      //var newSrc = tempNode.firstChild.childNodes[i].firstChild.getAttribute("src"); 
      var newSrc = tempNodeList[i].getAttribute("src");
      objRef.loadImgDiv(layers[i],newSrc,objRef.imageStack[i]);
    }
    var message = "loading " + objRef.layerCount + " map layers"
    objRef.model.setParam("modelStatus", message);
  }
}

/**
 * Returns an ID for the image DIV given a layer name
 * @param layerName the name of the WMS layer
 */
MapPane.prototype.getLayerDivId = function(layerName) {
  return this.model.id +"_"+ this.id +"_"+ layerName; //TBD: add in timestamps
}

/**
 * Adds a layer into the output
 * @param layerName the WMS anme for the layer to be removed
 */
MapPane.prototype.addLayer = function(objRef, layerNode) {
  //process the doc with the stylesheet
  objRef.stylesheet.setParameter("width", objRef.model.getWindowWidth());
  objRef.stylesheet.setParameter("height", objRef.model.getWindowHeight());
  objRef.stylesheet.setParameter("bbox", objRef.model.getBoundingBox().join(","));
  objRef.stylesheet.setParameter("srs", objRef.model.getSRS());
  var s = objRef.stylesheet.transformNodeToString(layerNode);
  var tempNode = document.createElement("div");
  tempNode.innerHTML = s;
  var newSrc = tempNode.firstChild.firstChild.getAttribute("src"); 

  objRef.imageStack.push(new Image());
  objRef.imageStack[objRef.imageStack.length-1].objRef = objRef;
  objRef.firstImageLoaded = true;
  objRef.loadImgDiv(layerNode,newSrc,objRef.imageStack[objRef.imageStack.length-1]);
}

/**
 * Removes a layer from the output
 * @param layerName the WMS anme for the layer to be removed
 */
MapPane.prototype.deleteLayer = function(objRef, layerName) {
  var imgDivId = objRef.getLayerDivId(layerName); 
  var imgDiv = document.getElementById(imgDivId);
  var outputNode = document.getElementById( objRef.outputNodeId );
  outputNode.removeChild(imgDiv);
}

/**
 * Moves a layer up in the stack of map layers
 * @param layerName the WMS anme for the layer to be removed
 */
MapPane.prototype.moveLayerUp = function(objRef, layerName) {
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
 * @param layerName the WMS anme for the layer to be removed
 */
MapPane.prototype.moveLayerDown = function(objRef, layerName) {
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
 * sets up the image div to be loaded.  Images are preloaded in the imageStack
 * array and replaced in the document DOM in the onload handler
 * @param layerNode the context layer to be loaded
 * @param newSrc the new URL to be used for the image
 * @param newImg an HTML IMG object to pre-load the image in
 */
MapPane.prototype.loadImgDiv = function(layerNode,newSrc,newImg) {
  var outputNode = document.getElementById( this.outputNodeId );
  var layerName = layerNode.selectSingleNode("wmc:Name").firstChild.nodeValue;  
  var layerHidden = (layerNode.getAttribute("hidden")==1)?true:false;  
  var imageFormat = "image/gif";
  var imageFormatNode = layerNode.selectSingleNode("wmc:FormatList/wmc:Format[@current='1']");  
  if (imageFormatNode) imageFormat = imageFormatNode.firstChild.nodeValue;  

  //make sure there is an image DIV in the output node for this layer
  var imgDivId = this.getLayerDivId(layerName); 
  var imgDiv = document.getElementById(imgDivId);
  if (!imgDiv) {
    imgDiv = document.createElement("div");
    imgDiv.setAttribute("id", imgDivId);
    imgDiv.style.position = "absolute"; 
    imgDiv.style.visibility = (layerHidden)?"hidden":"visible";
    imgDiv.style.top = '0px'; 
    imgDiv.style.left = '0px';
    imgDiv.imgId = Math.random().toString(); 
    var domImg = document.createElement("img");
    domImg.id = "real"+imgDiv.imgId;
    //domImg.src = this.loadingSrc;
    domImg.src = config.skinDir+"/images/Spacer.gif";
    domImg.layerHidden = layerHidden;
    imgDiv.appendChild(domImg);
    outputNode.appendChild(imgDiv);
  }

  // preload image
  newImg.id = imgDiv.imgId;
  newImg.hidden = layerHidden;
  newImg.fixPng = false;
  if (_SARISSA_IS_IE && imageFormat=="image/png") newImg.fixPng = true;
  newImg.onload = MapImgLoadHandler;
  newImg.src = newSrc;
}

/**
* image onload handler function.
* Replaces the source with the new one and fixes the displacement to 
* compensate the container main div displacement to result in in a zero displacement.
* The first image to be returned will hide all other layers and re-position them
* and they are made visible when their onload event fires.
*/
function MapImgLoadHandler() {
  var oldImg = document.getElementById("real"+this.id );

  if (!this.objRef.firstImageLoaded) {
    this.objRef.firstImageLoaded = true;
    var outputNode = document.getElementById( this.objRef.outputNodeId );
    var siblingImageDivs = outputNode.childNodes;
    for (var i=0; i<siblingImageDivs.length ;++i) {
      var sibImg = siblingImageDivs[i].firstChild;
      sibImg.parentNode.style.visibility = "hidden";
      sibImg.style.visibility = "hidden";//Make sure for IE that the child node is hidden as well
      if (_SARISSA_IS_IE) sibImg.src = config.skinDir+"/images/Spacer.gif";
    }
    if (_SARISSA_IS_IE) siblingImageDivs[0].firstChild.parentNode.parentNode.style.visibility = "hidden";
    outputNode.style.left='0px';
    outputNode.style.top='0px';
  }

  --this.objRef.layerCount;
  if (this.objRef.layerCount > 0) {
    var message = "loading " + this.objRef.layerCount + " map layers"
    this.objRef.model.setParam("modelStatus", message);
  } else {
    this.objRef.model.setParam("modelStatus");
  }

  if (_SARISSA_IS_IE) oldImg.parentNode.parentNode.style.visibility = "visible";
  if (this.fixPng) {
    var vis = oldImg.layerHidden?"hidden":"visible";
    oldImg.outerHTML = fixPNG(this,"real"+this.id);
    if (!this.hidden) {
      fixImg = document.getElementById("real"+this.id); // The result of fixPng is a span, so we need to set that particular element visible
      fixImg.style.visibility = "visible"
    }
  } else {
    oldImg.src = this.src;
    oldImg.width = this.objRef.model.getWindowWidth();
    oldImg.height = this.objRef.model.getWindowHeight();
    if (!this.hidden) {
      oldImg.parentNode.style.visibility = "visible";
      oldImg.style.visibility = "visible"; //Make sure for IE that the child node is visible as well
    }
  }
}
