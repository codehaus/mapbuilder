/*
Author:  Patrice G. Cappelaere patATcappelaere.com
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: VMLGraphics.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

/**
  * IE VML Graphics
  */
function VMLGraphics(id, div, width, heigth) {
 
  this.div    = div;
  this.width  = width;
  this.height = height;
  
  return this;
  //return context;
}

/**
  * Set thickness of drawing pen.  Should be an integer
  */
VMLGraphics.prototype.setStrokeColor = function(x) {
  this.strokeStyle = x;  
}

VMLGraphics.prototype.setStrokeWidth = function(x) {
  this.strokeWeight = x; 
}

VMLGraphics.prototype.setFillColor = function(x) {
  this.fillStyle = x;
  this.strokeStyle = x; 
}

VMLGraphics.prototype.setShapeStrokeColor = function(shape, x) {
  shape.setAttribute("strokecolor", x);
}

VMLGraphics.prototype.setShapeStrokeWidth = function(shape, x) {
  shape.setAttribute("strokeweight", x);
}

VMLGraphics.prototype.setShapeFillColor = function(shape, x) {
  shape.setAttribute("fillcolor", x);
}


/**
  * A polyline is a series of connected line segments. 
  * Xpoints and Ypoints are arrays which specify the x and y coordinates of each point 
  */   
VMLGraphics.prototype.drawPolyline = function(Xpoints, Ypoints) {
  
  var length = Xpoints.length;
  
  var points = Xpoints[0] + "," + Ypoints[0];
      
  for( var i=1; i<length; i++ ) {
    points += "," + Xpoints[i] +","+ Ypoints[i];
  }
  
  var element = document.createElement("vml:polyline");
  element.style.position="absolute";
  element.style.width= ""+this.width;
  element.style.height= ""+this.height;
  element.filled = "false";
  element.strokecolor = this.strokeStyle;
  element.strokeweight = this.strokeWeight;
  element.points = points;
  
  this.div.appendChild( element );
  return element;
}

/**
  * A polyline is a series of connected line segments. 
  * Xpoints and Ypoints are arrays which specify the x and y coordinates of each point 
  * The polygon will be automatically closed if the first and last points are not identical. 
  */   
VMLGraphics.prototype.drawPolygon = function(Xpoints, Ypoints) {
  return this.drawPolyline( Xpoints, Ypoints );
}

VMLGraphics.prototype.fillPolygon = function(Xpoints, Ypoints) {
  var element = this.drawPolygon( Xpoints, Ypoints );
  element.filled = "true";
  return element;
}
   
/**
  * Outline of an ellipse. Values refer to the bounding rectangle of the ellipse, 
  * X and Y give the co-ordinates of the left top corner of that rectangle rather than of its center
  */
VMLGraphics.prototype.drawCircle=function( X, Y, radius) {

  var diameter= radius * 2;
  var element = document.createElement("vml:oval");
  var xOffset = X-radius;
  var yOffset = Y-radius;
  
  element.style.position="relative";
  element.style.left=xOffset;
  element.style.top=yOffset;
  element.style.width='6';//diameter;
  element.style.height='6';//diameter;
  
  //element.fillcolor   = "yellow";
  element.strokecolor = this.strokeStyle;
  element.strokeweigth= "1pt";
  //element.coordsize   = "1000,1000";
  //element.coordorigin = "0 0"
  
  this.div.appendChild( element );
  return element;
}

/**
  *
  */
VMLGraphics.prototype.fillCircle=function( X, Y, radius ) {
  var diameter= radius * 2;
  var element = document.createElement("vml:oval");
  var xOffset = X-radius;
  var yOffset = Y-radius;
  
  element.style.position= "relative";
  element.style.left    = xOffset;
  element.style.top     = yOffset;
  element.style.width   = diameter;
  element.style.height  = diameter;
  
  element.fillcolor   = this.fillStyle;
  element.strokecolor = this.fillStyle; //this.strokeStyle;
  element.strokeweigth= "1pt";
  //element.coordsize   = "1000,1000";
  //element.coordorigin = "0 0"
  
  this.div.appendChild( element );
  return element;
}
  
/**
 * Draw an image.
 */ 
VMLGraphics.prototype.drawImage = function( src, X, Y, width, height, dx, dy) {
// center the image
  var posX = X - dx;
  var posY = Y - dy;
  
  var element = document.createElement("vml:rect");
  element.style.position= "absolute";
  element.style.left    = posX;
  element.style.top     = posY;
  if( width != null )
    element.style.width   = width;
  if( height != null )
    element.style.height  = height;
  element.filled = "false";
  element.stroked= "false";
  
  var imagedata = document.createElement("vml:imagedata");
  imagedata.src = src;
  element.appendChild( imagedata );
  
  this.div.appendChild( element );
  return element;
} 
  
VMLGraphics.prototype.swapImage = function( element, src) {
	var imagedata = element.firstChild
	imagedata.src = src
}

/**
  *
  */
VMLGraphics.prototype.paint=function() {
}
  


