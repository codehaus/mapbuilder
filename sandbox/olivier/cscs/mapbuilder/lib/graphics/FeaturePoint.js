/*
Author:  Patrice G. Cappelaere patATcappelaere.com
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeaturePoint.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/
 
mapbuilder.loadScript(baseDir+"/graphics/VectorGraphics.js");

/**
  * Feature Point
  * @param widgetNode  The widget's XML object node from the configuration document.
  * @param model       The model object that this widget belongs to.
  */
                                  
function FeaturePoint(objRef, geometry, itemId, title, popupStr, tipObjectName, normalImage, highlightImage, shadowImage, imageOffset, shadowOffset) {
  
  /**/
  var imageOffsetArray  = imageOffset.split(" ");
  var shadowOffsetArray = shadowOffset.split(" ");
  
  //add in the normalImage
  var normalImageDiv = document.createElement("div");
  if( popupStr != undefined ) {
    normalImageDiv.setAttribute("id",itemId+"_normal");
  } else {
    normalImageDiv.setAttribute("id",itemId+"_lastPos");  
  } 
  normalImageDiv.style.position = "absolute";
  normalImageDiv.style.visibility = "visible";
  //normalImageDiv.style.height = "80px";
  //normalImageDiv.style.width = "80px";
  
  normalImageDiv.style.zIndex = 300;
  normalImageDiv.tipObjectName = tipObjectName;
  normalImageDiv.title = title;

  var X = geometry[0];
  var Y = geometry[1];
  var gr = new VectorGraphics(itemId+"_normal", normalImageDiv );
  gr.setColor( "red" );
  var circle = gr.fillCircle( X, Y, 3 );
  circle.itemId = itemId;
  
  gr.paint(); // for WZ
  
  this.install( circle, itemId, popupStr );  
  //alert( X+" " +Y)
  //gr.context.strokeStyle = 'red';
  /*
  gr.context.fillStyle = 'red';
  gr.context.beginPath();
  gr.context.arc(X,Y,3,0,Math.PI*2.0,true); 
  //gr.context.closePath();
  //gr.context.stroke();
  gr.context.fill();
  */
  objRef.node.appendChild( normalImageDiv );
  this.normalImageDiv       = normalImageDiv;
 
  /*
  normalImageDiv.style.position = "absolute";
  normalImageDiv.style.visibility = "visible";
  normalImageDiv.style.height = "80px";
  normalImageDiv.style.width = "80px";
  
  normalImageDiv.style.zIndex = 300;
  normalImageDiv.tipObjectName = tipObjectName;
  normalImageDiv.title = title;
  
  var newImage = document.createElement("img");
  newImage.src = config.skinDir+ normalImage;
 
  normalImageDiv.appendChild(newImage);
  //objRef.node.appendChild( normalImageDiv );
 
  var shadowImg = document.createElement("img");
  shadowImg.src = config.skinDir+ shadowImage;
  //shadowImg.title = title;
  shadowImg.style.position = "relative";
  shadowImg.style.left = "-19px";
  
  normalImageDiv.appendChild(shadowImg);
  objRef.node.appendChild( normalImageDiv );
  
  normalImageDiv.style.left = geometry[0] + parseInt(imageOffsetArray[0]);
  normalImageDiv.style.top  = geometry[1] + parseInt(imageOffsetArray[1]);
  this.normalImageDiv       = normalImageDiv;
  
  // install mousehandlers if we have popup
  // and instantiate the highlite image
  if( popupStr != undefined ) {
    this.install( normalImageDiv, itemId, popupStr );
                     
    //add in the highlightImage
    var highlightImageDiv = document.createElement("div");
    highlightImageDiv.setAttribute("id",itemId+"_highlight");
    highlightImageDiv.style.position = "absolute";
    highlightImageDiv.style.visibility = "hidden";
    highlightImageDiv.style.zIndex = 301;   //all highlight images are on top of others
  
    var newImage = document.createElement("img");
    newImage.src = config.skinDir+ highlightImage;
    //newImage.title = title;
    highlightImageDiv.appendChild(newImage);
  
    var shadowImg = document.createElement("img");
    shadowImg.src = config.skinDir+ shadowImage;
    //shadowImg.title = title;
    shadowImg.style.position = "relative";
    shadowImg.style.left = "-19px";
  
    highlightImageDiv.appendChild(shadowImg);
    objRef.node.appendChild( highlightImageDiv );
    highlightImageDiv.style.left = geometry[0] + parseInt(imageOffsetArray[0]);
    highlightImageDiv.style.top = geometry[1] + parseInt(imageOffsetArray[1]);
    this. highlightImageDiv =  highlightImageDiv; 
 }
 */
 
  return this;
}

/**
  * clear the point and asscoiated div
  */
FeaturePoint.prototype.clear = function( objRef ) {

    var img = this.normalImageDiv.firstChild;
    img.onmouseover = null;
    img.onmouseout = null;
    objRef.node.removeChild( this.normalImageDiv );
 
    if( this.highlightImageDiv != undefined ) {
      img = this.highlightImageDiv.firstChild;
      img.onmouseover = null;
      img.onmouseout = null;
      objRef.node.removeChild( this.highlightImageDiv );
    }
}

/**
  * MouseOver Handler
  *
  * Note: "This" points to the feature (the line or circle or div depending on the tool)
  */
FeaturePoint.prototype.mouseOverHandler = function(ev) {  
  this.strokecolor = "yellow";
  this.fillcolor = "yellow";
 
  // get the enclosing div to get the current position
  normalImageDiv = document.getElementById(this.itemId+"_normal");

  //var topPx = new String(normalImageDiv.style.top);
  //var leftPx = new String(normalImageDiv.style.left);
   
  //var offx = normalImageDiv.offsetParent.offsetLeft;
  //var offy = normalImageDiv.offsetParent.offsetTop;
  
  //var Y = parseInt(topPx.replace("px",""))  + offy + 20;
  //var X = parseInt(leftPx.replace("px","")) + offx + 20;
       
  // hilite the marker
  //normalImageDiv.style.visibility = "hidden";
  //var highlightImageDiv = document.getElementById(this.itemId+"_highlight");
  //highlightImageDiv.style.visibility = "visible";
  
  var objRef = window.cursorTrackObject;
  var evPL =  window.cursorTrackNode.evpl;
  var X = evPL[0];
  var Y = evPL[1];
  
  // set the popup text with stylesheet output
  var popupStr = this.popupStr;
  if( popupStr == undefined ) {
    popupStr = mbGetMessage("featureUnderConstruction");
  }
  
  toolTipObjs[normalImageDiv.tipObjectName].paint( new Array(""+X, ""+Y, 200, this.title, popupStr ));
  
  return false; 
}
  
/*
 * Mouseout handler
 */
FeaturePoint.prototype.mouseOutHandler = function(ev) {
  this.strokecolor = "red";
  this.fillcolor = "red";
    
  //var highlightImageDiv = document.getElementById(this.itemId+"_highlight");
  //highlightImageDiv.style.visibility = "hidden";
  var normalImageDiv = document.getElementById(this.itemId+"_normal");
  normalImageDiv.style.visibility = "visible";
 
  // hide popup
  toolTipObjs[normalImageDiv.tipObjectName].clear();
}

/**
  * install mouse handlers and params in div element
  * 
  */
FeaturePoint.prototype.install = function( feature, itemId, popupStr ) {
  feature.itemId = itemId;
  feature.popupStr = popupStr;
      
  feature.onmouseover = this.mouseOverHandler; 
  feature.onmouseout  = this.mouseOutHandler;
}
