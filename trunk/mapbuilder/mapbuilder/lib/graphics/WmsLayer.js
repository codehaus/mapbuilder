/*
Author:       Patrice G. Cappelaere patAtcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/
mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");

function WmsLayer(model, mapPane, layerName, layerNode, queryable, visible) {
  MapLayer.apply(this, new Array(model, mapPane, layerName, layerNode, queryable, visible));

}

WmsLayer.prototype.setSrc = function( src ) {
  this.src = src;
}

/**
  * Paint the layer.
  * @param objRef Pointer to widget object.
  * @param img 
  * @param layerNum The position of this layer in the LayerList.
  */
WmsLayer.prototype.paint = function(objRef, img,layerNum ) {
  //alert( "paint:"+this.src);
  this.loadImgDiv(this.layerNode,this.src,img,layerNum);
  
  return img;
}

WmsLayer.prototype.isWmsLayer = function() {
  return true;
}

/**
 * Returns an ID for the image DIV given a layer name
 * @param layerName the name of the WMS layer
 */
WmsLayer.prototype.getLayerDivId = function() {
  var divId = this.model.id +"_"+ this.mapPane.id +"_"+ this.layerName; //TBD: add in timestamps
  return divId;
}


/**
 * sets up the image div to be loaded.  Images are preloaded in the imageStack
 * array and replaced in the document DOM in the onload handler
 * @param layerNode the context layer to be loaded
 * @param newSrc the new URL to be used for the image
 * @param newImg an HTML IMG object to pre-load the image in
 * @param layerNum The position of this layer in the LayerList.
 */
WmsLayer.prototype.loadImgDiv = function(layerNode,newSrc,newImg,layerNum) {
  var outputNode = document.getElementById( this.mapPane.outputNodeId );
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
    imgDiv.imgId = Math.random().toString(); 
    imgDiv.style.zIndex=this.zIndexFactor*layerNum;
    var domImg = document.createElement("img");
    domImg.id = "real"+imgDiv.imgId;
    domImg.setAttribute("src", "../../lib/skin/default/images/Loading.gif");
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
  --this.objRef.layerCount;
  if (this.objRef.layerCount > 0) {
    var message = "loading " + this.objRef.layerCount + " map layers"
    this.objRef.model.setParam("modelStatus", message);
  } else {
    this.objRef.model.setParam("modelStatus");
  }
  
  /*  var outputNode = oldImg.parentNode.parentNode;
  if (!this.objRef.firstImageLoaded) {
    var siblingImageDivs = outputNode.childNodes;
    for (var i=0; i<siblingImageDivs.length ;++i) {
      var sibImg = siblingImageDivs[i].firstChild;
      sibImg.parentNode.style.visibility = "hidden";
      sibImg.style.visibility = "hidden";//Make sure for IE that the child node is hidden as well
    }
    outputNode.style.left=0;
    outputNode.style.top=0;   
    this.objRef.firstImageLoaded = true;
  }
  */
  
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
