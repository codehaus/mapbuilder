/*
Author:       Patrice G. Cappelaere patAtcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: WmsLayer.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/
mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");

WmsLayer = function(model, mapPane, layerName, layerNode, queryable, visible) {
    MapLayer.apply(this, new Array(model, mapPane, layerName, layerNode, queryable, visible));

    /** Date object used to create a unique id. */
    this.d=new Date();
    this.img = new Image();
    this.img.objRef = mapPane;
    this.mapPane = mapPane;
  /**
    * Sets the source
    */
  this.setSrc= function( src ) {
    this.src = src;
  }

/**
  * Paint the layer.
  * @param objRef Pointer to widget object.
  * @param img 
  * @param layerNum The position of this layer in the LayerList.
  */
  this.paint= function(objRef, img, layerNum ) {
    //alert( "paint:"+this.src);
    this.loadImgDiv(objRef, this.layerNode,this.src,this.img,layerNum);
  
    return img;
  }

  this.isWmsLayer= function() {
    return true;
  }

/**
 * Returns an ID for the image DIV given a layer name
 * @param layerName the name of the WMS layer
 */
  this.getLayerDivId= function() {
    var divId = this.model.id +"_"+ this.mapPane.id +"_"+ this.layerName; //TBD: add in timestamps
    return divId;
    
    //add timestamp to layerID if layer have a timestampList
    if (this.model.timestampList && this.model.timestampList.getAttribute("layerName") == layerName) {  
      var timestampIndex = this.model.getParam("timestamp");
      var timestamp = this.model.timestampList.childNodes[timestampIndex];
      layerId += "_" + timestamp.firstChild.nodeValue;
    }
  }
  
/**
 * sets up the image div to be loaded.  Images are preloaded in the imageStack
 * array and replaced in the document DOM in the onload handler
 * @param layerNode the context layer to be loaded
 * @param newSrc the new URL to be used for the image
 * @param newImg an HTML IMG object to pre-load the image in
 * @param layerNum The position of this layer in the LayerList.
 */
  this.loadImgDiv= function(objRef, layerNode,newSrc,newImg,layerNum) {
  var outputNode = document.getElementById( objRef.mapPane.outputNodeId );
   //alert("WmsLayer.loadImgDiv: outputNodeId="+this.mapPane.outputNodeId+" outputNode="+document.getElementById(this.mapPane.outputNodeId));
  
  //var layerName = layerNode.selectSingleNode("wmc:Name").firstChild.nodeValue;  
  var layerHidden = (layerNode.getAttribute("hidden")==1)?true:false; 
  //var layerHidden = this.isHidden();
  
  var imageFormat = "image/gif";
  var imageFormatNode = layerNode.selectSingleNode("wmc:FormatList/wmc:Format[@current='1']");  
  if (imageFormatNode) imageFormat = imageFormatNode.firstChild.nodeValue;  

  //make sure there is an image DIV in the output node for this layer
  var imgDivId = this.getLayerDivId(); 
  var imgDiv = document.getElementById(imgDivId);
  if (!imgDiv) {
    imgDiv = document.createElement("div");
    imgDiv.setAttribute("id", imgDivId);
    imgDiv.style.position = "absolute"; 
    imgDiv.style.visibility = (layerHidden)?"hidden":"visible";
    imgDiv.style.top = '0px'; 
    imgDiv.style.left = '0px';
    imgDiv.imgId = this.d.getTime(); 
    imgDiv.style.zIndex=this.zIndexFactor + layerNum;
    //alert( "Zindex:"+imgDiv.style.zIndex + " layerNum:"+layerNum);
    var domImg = document.createElement("img");
    domImg.id = "real"+imgDiv.imgId;
    domImg.setAttribute("src", config.skinDir + "/images/Loading.gif");
    domImg.layerHidden = layerHidden;
    imgDiv.appendChild(domImg);
    outputNode.appendChild(imgDiv);
  }

  // preload image
  newImg.id = imgDiv.imgId;
  newImg.hidden = layerHidden;
  if (_SARISSA_IS_IE && imageFormat=="image/png") newImg.fixPng = true;
  newImg.onload = MapImgLoadHandler;
  newImg.setAttribute("src", newSrc);
  
  }
}


/**
* image onload handler function.
* Replaces the source with the new one and fixes the displacement to 
* compensate the container main div displacement to result in in a zero displacement.
* The first image to be returned will hide all other layers and re-position them
* and they are made visible when their onload event fires.
* @author Michael Jenik     
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
    var message = mbGetMessage((this.objRef.layerCount>1) ? "loadingLayers" : "loadingLayer",
      this.objRef.layerCount);
    this.objRef.model.setParam("modelStatus", message);
  } else {
    this.objRef.model.setParam("modelStatus");
    this.objRef.model.callListeners("refreshOtherLayers");
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
    oldImg.setAttribute("src", this.src);
    oldImg.width = this.objRef.model.getWindowWidth();
    oldImg.height = this.objRef.model.getWindowHeight();
    if (!this.hidden) {
      oldImg.parentNode.style.visibility = "visible";
      oldImg.style.visibility = "visible"; //Make sure for IE that the child node is visible as well
    }
  }
}
