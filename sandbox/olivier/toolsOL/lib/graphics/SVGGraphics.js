/*
Author:  Patrice G. Cappelaere patATcappelaere.com
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: SVGGraphics.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Many thanks to Robert Coup <robert.coup@onetrackmind.co.nz>

mapbuilder.loadScript(baseDir+"/util/Util.js");

/**
  * Safari/FireFox 1.5 SVG Graphics
  */
function SVGGraphics(id, div, width, height) {
 
  //this.div = div;
  // we can only have one svg root element in a page to get the mouseovers to work
  var svg = document.getElementById('svg_element');
  if( svg == null ) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', "svg_element" );
    svg.setAttribute('width', width );
    svg.setAttribute('height', height );
    //svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height );
    if( div != null )
      div.appendChild( svg );
  }
  
  this.svg = svg;
  
  return this;
}

/**
  * Set thickness of drawing pen.  Should be an integer
  */
SVGGraphics.prototype.setStrokeColor = function(x) {
  this.strokeStyle = x;
}

SVGGraphics.prototype.setStrokeWidth = function(x) {
  this.strokeWeight = x;
}

SVGGraphics.prototype.setFillColor = function(x) {
  this.fillStyle = x;
}

SVGGraphics.prototype.setShapeStrokeColor = function(shape, x) {
  shape.setAttribute("stroke", x);
}

SVGGraphics.prototype.setShapeStrokeWidth = function(shape, x) {
  shape.setAttribute("stroke-width", x);
}

SVGGraphics.prototype.setShapeFillColor = function(shape, x) {
  shape.fill = x;
}


/**
  * A polyline is a series of connected line segments. 
  * Xpoints and Ypoints are arrays which specify the x and y coordinates of each point 
  */   
SVGGraphics.prototype.drawPolyline = function(Xpoints, Ypoints) {
  
  var length = Xpoints.length;
  
  var pts = Xpoints[0] + "," + Ypoints[0];
      
  for( var i=1; i<length; i++ ) {
    pts += "," + Xpoints[i] +","+ Ypoints[i];
  }
  
  var element = document.createElementNS('http://www.w3.org/2000/svg', "polyline");
 
  element.setAttribute("points", pts);
  
  if( this.strokeStyle )
    element.setAttribute("stroke", this.strokeStyle);
  
  element.setAttribute("fill", 'none' ); //this.fillStyle);
 
  this.svg.appendChild( element );
  return element;
}

/**
  * A polyline is a series of connected line segments. 
  * Xpoints and Ypoints are arrays which specify the x and y coordinates of each point 
  * The polygon will be automatically closed if the first and last points are not identical. 
  */   
SVGGraphics.prototype.drawPolygon = function(Xpoints, Ypoints) {
  var element =  this.drawPolyline( Xpoints, Ypoints );
  return element;
}

SVGGraphics.prototype.fillPolygon = function(Xpoints, Ypoints) {
  this.drawPolygon( Xpoints, Ypoints );
  this.fill();
}
   
/**
  * Outline of an ellipse. Values refer to the bounding rectangle of the ellipse, 
  * X and Y give the co-ordinates of the left top corner of that rectangle rather than of its center
  */
SVGGraphics.prototype.drawCircle=function( X, Y, radius) {
}

/**
  *
  */
SVGGraphics.prototype.fillCircle=function( X, Y, radius ) {
  
  var element = document.createElementNS('http://www.w3.org/2000/svg', "circle" );
  element.setAttribute("cx", X)
  element.setAttribute("cy", Y)
  element.setAttribute("r", radius)
  
  if( this.strokeStyle )
    element.setAttribute("stroke", this.strokeStyle);
  
  if( this.fillStyle )
    element.setAttribute("fill", this.fillStyle)

  this.svg.appendChild( element );
  return element;
}
  
/**
  *
  */
SVGGraphics.prototype.drawImage = function( src, X, Y, width, height, dx, dy) {
  
  var element = document.createElementNS('http://www.w3.org/2000/svg', "image");
    
  element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src)
 
  // center the image
  var posX = X - dx;
  var posY = Y - dy;
    
  //alert( "dx:"+dx + " dy:"+dy)
 
  element.setAttribute("x", posX);
  element.setAttribute("y", posY);
  
  if( width != 0 )
    element.setAttribute("width", width);
  
  if( height != 0 )
    element.setAttribute("height", height);
  
  this.svg.appendChild( element );
  return element;
} 
  
SVGGraphics.prototype.swapImage = function( element, src ) {
  element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src)
}
  
  
/**
  *
  */
SVGGraphics.prototype.paint=function() {
}
  


