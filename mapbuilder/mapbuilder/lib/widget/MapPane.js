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

  var node = widgetNode.selectSingleNode("mb:noPreload");
  if( node ) {
    this.doNotPreload = widgetNode.selectSingleNode("mb:noPreload").firstChild.nodeValue;
  } else {
    this.doNotPreload = false;
  }
  
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
      domImg = document.getElementById(imgId); // Hack to make sure that the child element is toggled in IE
      if( domImg ) {
        if( domImg.isLoading ) {
          domImg.style.visibility = vis;
        } else if (vis == 'visible') {
          // load map image and make it visible
          MapImgLoad( objRef, layer );
        }
        else { 
          // hide image
          domImg.style.visibility = vis;
        }
      }
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
  this.model.addListener("timestamp",this.timestampListener,this);
}

/**
 * Render the widget.
 * @param objRef Pointer to widget object.
 */
MapPane.prototype.paint = function(objRef) {

  if (objRef.model.doc && objRef.node) {
    //if (objRef.debug) mbDebugMessage(objRef, "source:"+Sarissa.serialize(objRef.model.doc));

    objRef.stylesheet.setParameter("width", objRef.model.getWindowWidth());
    objRef.stylesheet.setParameter("height", objRef.model.getWindowHeight());
    objRef.stylesheet.setParameter("bbox", objRef.model.getBoundingBox().join(","));
    objRef.stylesheet.setParameter("srs", objRef.model.getSRS());

    //confirm inputs
    if (objRef.debug) mbDebugMessage(objRef, "painting:"+Sarissa.serialize(objRef.model.doc));
    if (objRef.debug) mbDebugMessage(objRef, "stylesheet:"+Sarissa.serialize(objRef.stylesheet.xslDom));
//alert("PAINT MODEL.DOC  : "+Sarissa.serialize(objRef.model.doc));

    //process the doc with the stylesheet
    var tempDom = objRef.stylesheet.transformNodeToObject(objRef.model.doc);
//alert(Sarissa.serialize(tempDom));
    var tempNodeList = tempDom.selectNodes("//img");

    //debug output
    if (objRef.debug) {
      var s = objRef.stylesheet.transformNodeToString(objRef.model.doc);
      mbDebugMessage(objRef, "painting:"+objRef.id+":"+s);
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
    // create a index with the visible layer indices and the invisible layer indices last
    var visibleLayerIndices = new Array();
    var invisibleLayerIndices = new Array();
    for (var i=0;i<layers.length;i++){
      if (layers[i].getAttribute("hidden")==1) {
        invisibleLayerIndices.push(i);
      } else {
        visibleLayerIndices.push(i);
      }
    }
    var sortedLayerIndices = visibleLayerIndices.concat(invisibleLayerIndices);
    if (!objRef.imageStack) objRef.imageStack = new Array(layers.length);
    objRef.firstImageLoaded = false;

    objRef.layerCount = layers.length;
    objRef.loadingLayerCount = 0;
    for (var i=0;i<layers.length;i++){
      var j = sortedLayerIndices[i];
      if (!objRef.imageStack[j]) {
        objRef.imageStack[j] = new Image();
        objRef.imageStack[j].objRef = objRef;
      }
      
      //var newSrc = tempNode.firstChild.childNodes[i].firstChild.getAttribute("src"); 
      var newSrc = tempNodeList[j].getAttribute("src");
      objRef.loadImgDiv(layers[j],newSrc,objRef.imageStack[j], i);
    }
  }
}

/**
 * Returns an ID for the image DIV given a layer name
 * @param layerName the name of the WMS layer
 */
MapPane.prototype.getLayerDivId = function(layerName) {
  return this.model.id +"_"+ this.id +"_"+ layerName; 

  //add timestamp to layerID if layer have a timestampList
  if (this.model.timestampList && this.model.timestampList.getAttribute("layerName") == layerName) {
    
    var timestampIndex = this.model.getParam("timestamp");
    var timestamp = this.model.timestampList.childNodes[timestampIndex];
    layerId += "_" + timestamp.firstChild.nodeValue;
  }
}

  /**
   * Called when the map timestamp is changed so set the layer visiblity.
   * @param objRef This object.
   * @param timestampIndex  The array index for the layer to be displayed. 
   */
MapPane.prototype.timestampListener = function(objRef, timestampIndex){
    var layerName = objRef.model.timestampList.getAttribute("layerName");
    var timestamp = objRef.model.timestampList.childNodes[timestampIndex];
    var vis = (timestamp.getAttribute("current")=="1") ? "visible":"hidden";
    var layerId = objRef.model.id + "_" + objRef.id + "_" + layerName + "_" + timestamp.firstChild.nodeValue;
    var layer = document.getElementById(layerId);
    if (layer) {
      layer.style.visibility=vis;
    } else {
      alert(mbGetMessage("layerNotFound", layerId));
    }
  }

/**
 * Adds a layer into the output
 * @param layerName the WMS name for the layer to be added
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

  ++objRef.layerCount;
  objRef.loadImgDiv(layerNode,newSrc,objRef.imageStack[objRef.imageStack.length-1]);
}

/**
 * Modify a layer into the output
 * @param layerName the WMS name for the layer to be modified
 */
MapPane.prototype.modifyLayer = function(objRef, layerNode) {

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
  
  ++objRef.layerCount;
  objRef.loadImgDiv(layerNode,newSrc,objRef.imageStack[objRef.imageStack.length-1]);
}

/**
 * Removes a layer from the output
 * @param layerName the WMS name for the layer to be removed
 */
MapPane.prototype.deleteLayer = function(objRef, layerName) {
  var imgDivId = objRef.getLayerDivId(layerName); 
  
  var imgDiv = document.getElementById(imgDivId);
  var outputNode = document.getElementById( objRef.outputNodeId );
  outputNode.removeChild(imgDiv);
}

/**
 * Moves a layer up in the stack of map layers
 * @param layerName the WMS name for the layer to be moved up
 */
MapPane.prototype.moveLayerUp = function(objRef, layerName) {
  var outputNode = document.getElementById( objRef.outputNodeId );
  var imgDivId = objRef.getLayerDivId(layerName); 
  var movedNode = document.getElementById(imgDivId);
  var sibNode = movedNode.nextSibling;
  if (!sibNode) {
    alert(mbGetMessage("cantMoveUp", layerName));
    return;
  }
  outputNode.insertBefore(sibNode,movedNode);
}

/**
 * Moves a layer up in the stack of map layers
 * @param layerName the WMS name for the layer to be moved down
 */
MapPane.prototype.moveLayerDown = function(objRef, layerName) {
  var outputNode = document.getElementById( objRef.outputNodeId );
  var imgDivId = objRef.getLayerDivId(layerName); 
  var movedNode = document.getElementById(imgDivId);
  var sibNode = movedNode.previousSibling;
  if (!sibNode) {
    alert(mbGetMessage("cantMoveDown", layerName));
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
    // code to put imgDiv at the right place in the dom image stack
    // necessary because smart loading (visible layers first) messes
    // up the image stack order
    //
    // get the names of the layers that come after this one
    var layers = this.model.getAllLayers();
    for (var i=0; i<layers.length; i++) {
      if (layers[i] == layerNode) {
        var thisLayersPosition = i;
        break;
      }
    }
    // we could use this slice method, but IE6 chokes on it...
    //var layersAfter = layers.slice(thisLayersPosition);
    var layersAfter = new Array();
    for (var i=thisLayersPosition; i<layers.length; i++) {
      layersAfter.push(layers[i]);
    }
    //
    // find the first layer that comes after this one in the layer order and that already
    // has a node in the dom, and insert before that one
    for (var i=layersAfter.length-1; i>=0; i--) {
      var layerAfterName = layersAfter[i].selectSingleNode("wmc:Name").firstChild.nodeValue;
      var findSiblingNode = document.getElementById(this.getLayerDivId(layerAfterName));
      if (findSiblingNode) {
        var insertBeforeNode = findSiblingNode;
      }
    }
    if (insertBeforeNode) {
      outputNode.insertBefore(imgDiv, insertBeforeNode);
    } else {
      outputNode.appendChild(imgDiv);
    }
  } else {
    // NB this assumes that the img element is the first child!?
    var domImg = imgDiv.firstChild;
  }

  // preload image
  newImg.id = imgDiv.imgId;
  newImg.hidden = layerHidden;
  newImg.fixPng = false;
  if (_SARISSA_IS_IE && imageFormat=="image/png") newImg.fixPng = true;

  if( this.doNotPreload && layerHidden ) {
    // delay loading until visible
    newImg.srcToLoad = newSrc;
    domImg.isLoading = false;
    //alert( 'hiding: ' + newSrc + '\n' + this.loadingLayerCount + '/' + this.layerCount );
  }
  else {
    // increment number of loading layers
    ++this.loadingLayerCount;
    var message = mbGetMessage((this.loadingLayerCount>1) ? "loadingLayers" : "loadingLayer",
      this.loadingLayerCount);
    this.model.setParam("modelStatus", message);
    // load now
    newImg.onload = MapImgLoadHandler;
    newImg.src = newSrc;
    domImg.isLoading = true;
  }
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

  // decrement number of loading layers
  --this.objRef.loadingLayerCount;
  if (this.objRef.loadingLayerCount > 0) {
    var message = mbGetMessage((this.objRef.loadingLayerCount>1) ? "loadingLayers" : "loadingLayer",
      this.objRef.loadingLayerCount);
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

/**
 * Sets up an image to be loaded. Used when images are not preloaded in the
 * image stack.
 * @param objRef Pointer to widget object.
 * @param layer Layer element.
 */
function MapImgLoad( objRef, layer ) {
  var imgId = layer.imgId;
  for( var i = 0; i < objRef.imageStack.length; i++ )
  {
    if( objRef.imageStack[i].id == imgId ) {
      // increment number of loading layers
      ++objRef.loadingLayerCount;
      var message = mbGetMessage((objRef.loadingLayerCount>1) ? "loadingLayers" : "loadingLayer",
        objRef.loadingLayerCount);
      objRef.model.setParam("modelStatus", message);
      
      var newImg = objRef.imageStack[i];
      newImg.onload = MapImgLoadHandler;
      newImg.src = newImg.srcToLoad;
      newImg.hidden = false;
      var domImg = document.getElementById("real"+imgId );
      domImg.isLoading = true;
      domImg.layerHidden = false;
      return;
    }
  }
  alert(mbGetMessage("imageNotFound"));
}
