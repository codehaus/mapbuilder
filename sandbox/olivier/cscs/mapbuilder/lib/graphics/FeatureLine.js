/*
Author:  Patrice G. Cappelaere patATcappelaere.com
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeatureLine.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/
//mapbuilder.loadScript(baseDir+"/util/wz_jsgraphics/wz_jsgraphics.js");
mapbuilder.loadScript(baseDir+"/graphics/Vectorgraphics.js");
 

/**
  * Feature Line
  * @param objRef         Object Reference
  * @param geometry       Array of X,Y point pairs 
  * @param itemId         Unique Object Item Id
  * @param title          Title for Popup
  * @param tipObjectName  TipObjectName so we can paint the popup later if more than one is used
  * @param Position       Popup Position for lines (this is tricky so let's pick a fix place)
  */
                                 
function FeatureLine(objRef, geometry, itemId, title, popupStr, tipObjectName, Position ) {
  
  //add in the normalImage
  var lineNormalDiv = document.createElement("div");
  lineNormalDiv.setAttribute("id", itemId+"_normal");
  lineNormalDiv.style.position = "absolute";
  //lineNormalDiv.style.height = "0px";
  //lineNormalDiv.style.width = "0px";
  lineNormalDiv.style.visibility = "visible";
  lineNormalDiv.style.zIndex = 300;
  lineNormalDiv.tipObjectName = tipObjectName;
  lineNormalDiv.position = Position;
  
  this.lineNormalDiv     = lineNormalDiv;
  objRef.node.appendChild( lineNormalDiv );
  
  
  var xPoints = new Array(geometry.length);
  var yPoints = new Array(geometry.length);
  for( var i=0; i<geometry.length; i++ ) {
    point = geometry[i]
    xPoints[i] = parseInt(point[0])
    yPoints[i] = parseInt(point[1])
  }
  
  var gr = new VectorGraphics(itemId+"_normal", lineNormalDiv );
  gr.setColor('red');
  
  var line = gr.drawPolyline(xPoints, yPoints);
  gr.paint();
  
  
  // install handlers
  this.install( line, itemId, popupStr );
                     
  return this;
}

/**
  * clear the point and asscoiated divs
  */
FeatureLine.prototype.clear = function( objRef ) {
  objRef.node.removeChild( this.lineNormalDiv );
}

/**
  * MouseOver Handler
  *
  * Note: "This" points to the feature
  */
FeatureLine.prototype.mouseOverHandler = function(ev) { 
  //alert( "MouseOver" );
  this.strokecolor = "yellow";
     
 // get the enclosing div to get the current position
  var lineNormalDiv = document.getElementById(this.itemId+"_normal");
  
  var objRef = window.cursorTrackObject;
  var evPL =  window.cursorTrackNode.evpl;
  var X = evPL[0];
  var Y = evPL[1];
  
  // set the popup text with stylesheet output
  var popupStr = this.popupStr;
  if( popupStr == undefined ) {
    popupStr = mbGetMessage("featureUnderConstruction");
  }
 
  toolTipObjs[lineNormalDiv.tipObjectName].paint( new Array(""+X, ""+Y, 200, this.title, popupStr ));
  
  return true; 
}

  
/*
 * Mouseout handler
 */
FeatureLine.prototype.mouseOutHandler = function(ev) {

  this.strokecolor = "red";
  
  //alert( "MouseOut" );
  var lineNormalDiv = document.getElementById(this.itemId+"_normal");
   
  // hide popup
  toolTipObjs[lineNormalDiv.tipObjectName].clear();
}

/**
  * install mouse handlers and params in div element
  * 
  */
FeatureLine.prototype.install = function( feature, itemId, popupStr ) {
  feature.itemId = itemId;
  feature.popupStr = popupStr;
      
  feature.onmouseover = this.mouseOverHandler; 
  feature.onmouseout  = this.mouseOutHandler;
}
