/*
Author:  Patrice G. Cappelaere patATcappelaere.com
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: SVGGraphics2.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Many thanks to Robert Coup <robert.coup@onetrackmind.co.nz>

mapbuilder.loadScript(baseDir+"/util/Util.js");

/**
  * Safari/FireFox 1.5 SVG Graphics
  * @param id Id for the layer.
  * @param div DIV to insert the vector shapes into.
  * @param width width.
  * @param height height.
  */
function SVGGraphics2(id, div, width, height) {
 
  var svg = document.getElementById(id+'svg');
  if( svg == null ) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', id+"svg" );
    svg.setAttribute('width', width );
    svg.setAttribute('height', height );
    if( div != null )
      div.appendChild( svg );
  }
  this.svg = svg;
  return this;
}

/**
  * Find the tag with the supplied id, or create a grouping tag if it
  * doesn't exist. For SVG, the G tag is returned. This tag can be used to
  * attach style information to for a group of shapes.
  * @param parentNode The node to insert the new element into.
  * @param id The id of the tag.
  * @return The tag for the supplied id or a new tag if one didn't exist before.
  */
SVGGraphics2.prototype.getGroupTag = function(parentNode,id) {
  tag = document.getElementById(id);
  if(!tag){
    tag = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tag.setAttribute('id', id);

    if(!parentNode)parentNode=this.svg;
    parentNode.appendChild(tag);
  }
  return tag;
}

/**
  * Set thickness of drawing pen.  Should be an integer
  * @deprecated
  */
SVGGraphics2.prototype.setStrokeColor = function(x) {
  //this.strokeStyle = x;
}

/**
  * @deprecated
  */
SVGGraphics2.prototype.setStrokeWidth = function(x) {
  //this.strokeWeight = x;
}

/**
  * @deprecated
  */
SVGGraphics2.prototype.setFillColor = function(x) {
  //this.fillStyle = x;
}

/**
  * Set the style for the provided HTML DOM element.
  * @param shape The node in the HTML DOM to apply style to.
  * @param x strokeColor.
  */
SVGGraphics2.prototype.setShapeStrokeColor = function(shape, x) {
  //shape.setAttributeNS("http://www.w3.org/2000/svg", "stroke", x);
  shape.setAttribute("stroke", x);
}

/**
  * Set the style for the provided HTML DOM element.
  * @param shape The node in the HTML DOM to apply style to.
  * @param x strokeWidth.
  */
SVGGraphics2.prototype.setShapeStrokeWidth = function(shape, x) {
  //shape.setAttributeNS("http://www.w3.org/2000/svg", "stroke-width", x);
  shape.setAttribute("stroke-width", x);
}

/**
  * Set the style for the provided HTML DOM element.
  * @param shape The node in the HTML DOM to apply style to.
  * @param x fillColor.
  */
SVGGraphics2.prototype.setShapeFillColor = function(shape, x) {
  //shape.setAttributeNS("http://www.w3.org/2000/svg", "fillColor", x);
  shape.setAttribute("fillColor", x);
}

/**
  * Set the style for the provided HTML DOM element.
  * @param shape The node in the HTML DOM to apply style to.
  * @param x fill=none, means don't fill the shape.
  */
SVGGraphics2.prototype.setShapeFill = function(shape, x) {
  //shape.setAttributeNS("http://www.w3.org/2000/svg", "fill", x);
  shape.setAttribute("fill", x);
}


/**
  * A polyline is a series of connected line segments. 
  * @param Xpoints array which specify the x coordinates of each point 
  * @param Ypoints array which specify the y coordinates of each point 
  * @param node node from the HTML DOM to insert this line into
  */   
SVGGraphics2.prototype.drawPolyline = function(Xpoints, Ypoints, node) {
  
  var length = Xpoints.length;
  
  var pts = Xpoints[0] + "," + Ypoints[0];
      
  for( var i=1; i<length; i++ ) {
    pts += "," + Xpoints[i] +","+ Ypoints[i];
  }
  
  var element = document.createElementNS('http://www.w3.org/2000/svg', "polyline");
 
  element.setAttribute("points", pts);
  
  //element.setAttribute("fill", 'none' ); //this.fillStyle);
 
  //if( this.strokeStyle )
  //  element.setAttribute("stroke", "blue");
  
  node.appendChild( element );
  return element;
}

/**
  * A polyline is a series of connected line segments. 
  * Xpoints and Ypoints are arrays which specify the x and y coordinates of each point 
  * The polygon will be automatically closed if the first and last points are not identical. 
  * @param Xpoints array which specify the x coordinates of each point 
  * @param Ypoints array which specify the y coordinates of each point 
  * @param node node from the HTML DOM to insert this line into
  */   
SVGGraphics2.prototype.drawPolygon = function(Xpoints, Ypoints,node) {
  var element =  this.drawPolyline(Xpoints,Ypoints,node);
  return element;
}

SVGGraphics2.prototype.fillPolygon = function(Xpoints, Ypoints) {
  this.drawPolygon( Xpoints, Ypoints );
  this.fill();
}
   
/**
  * Outline of an ellipse. Values refer to the bounding rectangle of the ellipse, 
  * X and Y give the co-ordinates of the left top corner of that rectangle rather than of its center
  */
SVGGraphics2.prototype.drawCircle=function( X, Y, radius) {
}

/**
  * Render a filled circle.
  * @param Xpoints array which specify the x coordinates of each point 
  * @param Ypoints array which specify the y coordinates of each point 
  * @param node node from the HTML DOM to insert this line into
  */
SVGGraphics2.prototype.fillCircle=function(X,Y,radius,node) {
  
  var element = document.createElementNS('http://www.w3.org/2000/svg', "circle" );
  element.setAttribute("cx", X)
  element.setAttribute("cy", Y)
  element.setAttribute("r", radius)
  
  //if( this.strokeStyle )
  //  element.setAttribute("stroke", this.strokeStyle);
  
  //if( this.fillStyle )
  //  element.setAttribute("fill", this.fillStyle)

  node.appendChild( element );
  return element;
}
  
/**
  *
  */
SVGGraphics2.prototype.drawImage = function( src, X, Y, width, height, dx, dy) {
  
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
  
SVGGraphics2.prototype.swapImage = function( element, src ) {
  element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src)
}
  
  
/**
  *
  */
SVGGraphics2.prototype.paint=function() {
}
  


