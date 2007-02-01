/*
Author:  Patrice G. Cappelaere patATcappelaere.com
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: CanvasGraphics.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

/**
  * Safari/FireFox 1.5 Canvas Graphics
  */
function CanvasGraphics(id, div) {
 
  this.div = div;
    
  // not sure about width and height yet
  var canvas = document.createElement("canvas");
  canvas.setAttribute("width", "800px")
  canvas.setAttribute("height", "400px");
  canvas.setAttribute("style", "position: absolute; top: 0pt; left: 0pt; width: 800px; height: 400px");
  
  div.appendChild(canvas);
  var context = canvas.getContext('2d');
    
  this.context = context;
  return this;
  //return context;
}

/**
  * Set thickness of drawing pen.  Should be an integer
  */
CanvasGraphics.prototype.setStroke = function(x) {
  this.context.strokeStyle = x;
}

/**
  * Set color of the draing pen (and fill)
  */
CanvasGraphics.prototype.setColor=function( value ) {
  
  this.context.fillStyle = value
  this.context.strokeStyle = value
} 

/**
  * A polyline is a series of connected line segments. 
  * Xpoints and Ypoints are arrays which specify the x and y coordinates of each point 
  */   
CanvasGraphics.prototype.drawPolyline = function(Xpoints, Ypoints) {

  var length = Xpoints.length;
  //alert( length );
  this.context.beginPath();
 
  this.context.moveTo( Xpoints[0], Ypoints[0] );
     
  for( var i=1; i<length; i++ ) {
    this.context.lineTo( Xpoints[i], Ypoints[i] );
  }
  
  this.context.stroke();
}

/**
  * A polyline is a series of connected line segments. 
  * Xpoints and Ypoints are arrays which specify the x and y coordinates of each point 
  * The polygon will be automatically closed if the first and last points are not identical. 
  */   
CanvasGraphics.prototype.drawPolygon = function(Xpoints, Ypoints) {
  
  this.drawPolyLine( Xpoints, Ypoints );
  this.context.closePath();
}

CanvasGraphics.prototype.fillPolygon = function(Xpoints, Ypoints) {
  this.drawPolygon( Xpoints, Ypoints );
  this.context.fill();
}
   
/**
  * Outline of an ellipse. Values refer to the bounding rectangle of the ellipse, 
  * X and Y give the co-ordinates of the left top corner of that rectangle rather than of its center
  */
CanvasGraphics.prototype.drawCircle=function( X, Y, radius) {

  this.context.beginPath();
  this.context.arc(X,Y,radius,0,Math.PI*2.0,true); 
}

/**
  *
  */
CanvasGraphics.prototype.fillCircle=function( X, Y, radius ) {
  this.drawCircle( X, Y, radius);
  this.context.fill();
}
  
/*
 *
 */
CanvasGraphics.prototype.drawImage = function( src, X, Y, width, height) {

} 
  
/**
  *
  */
CanvasGraphics.prototype.paint=function() {
}
  


