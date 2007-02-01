/*
Author:  Patrice G. Cappelaere patATcappelaere.com
Author:  Cameron Shorter cameronATshorter.net
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: VMLGraphics2.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

/**
  * Safari/FireFox 1.5 SVG Graphics
  * @param id Id for the layer.
  * @param div DIV to insert the vector shapes into.
  * @param width width.
  * @param height height.
  * @return group A VML group element to be used to insert style information into.
  */
function VMLGraphics2(id, div, width, heigth) {
  this.div    = div;
  this.width  = width;
  this.height = height;
  
  return this;
}

/**
  * Find the tag with the supplied id, or create a grouping tag if it
  * doesn't exist. For VML, the GROUP tag is returned. This tag can be used to
  * attach style information to for a group of shapes.
  * @param parentNode The node to insert the new element into.
  * @param id The id of the tag.
  * @return The tag for the supplied id or a new tag if one didn't exist before.
  */
VMLGraphics2.prototype.getGroupTag = function(parentNode,id) {
  tag = document.getElementById(id);
  if(!tag){
    //tag = document.createElement("vml:group");
    tag = document.createElement("div");
    tag.setAttribute('id', id);

    if(!parentNode)parentNode=this.div;
    parentNode.appendChild(tag);
  }
  return tag;
}

/**
  * Set thickness of drawing pen.  Should be an integer
  */
VMLGraphics2.prototype.setStrokeColor = function(x) {
  this.strokeStyle = x;  
}

VMLGraphics2.prototype.setStrokeWidth = function(x) {
  this.strokeWeight = x; 
}

VMLGraphics2.prototype.setFillColor = function(x) {
  this.fillStyle = x;
  this.strokeStyle = x; 
}

/**
  * Set the style for the provided HTML DOM element.
  * @param shape The node in the HTML DOM to apply style to.
  * @param x strokeColor.
  */
VMLGraphics2.prototype.setShapeStrokeColor = function(shape, x) {
  //alert("VMLGraphics2.setShapeStrokeColor="+x);
  shape.setAttribute("strokecolor", x);
}

/**
  * Set the style for the provided HTML DOM element.
  * @param shape The node in the HTML DOM to apply style to.
  * @param x strokeWidth.
  */
VMLGraphics2.prototype.setShapeStrokeWidth = function(shape, x) {
  shape.setAttribute("strokeweight", x);
}

/**
  * Set the style for the provided HTML DOM element.
  * @param shape The node in the HTML DOM to apply style to.
  * @param x fillColor.
  */
VMLGraphics2.prototype.setShapeFillColor = function(shape, x) {
  shape.setAttribute("fillcolor", x);
}


/**
  * Set the style for the provided HTML DOM element.
  * @param shape The node in the HTML DOM to apply style to.
  * @param x fill=none, means don't fill the shape.
  */
VMLGraphics2.prototype.setShapeFill = function(shape, x) {
  if(x=="none"){
    shape.setAttribute("filled", false);
  }else{
    shape.setAttribute("filled", true);
  }
}

/**
  * A polyline is a series of connected line segments. 
  * @param Xpoints array which specify the x coordinates of each point.
  * @param Ypoints array which specify the y coordinates of each point.
  * @param node node from the HTML DOM to insert this line into
  */
VMLGraphics2.prototype.drawPolyline = function(Xpoints, Ypoints,node) {

  var length = Xpoints.length;
  
  var points = Xpoints[0] + "," + Ypoints[0];
      
  for( var i=1; i<length; i++ ) {
    points += "," + Xpoints[i] +","+ Ypoints[i];
  }
  
  var element = document.createElement("vml:polyline");
  //TBD following lines should be able to be removed
  element.style.position="absolute";
  element.style.width= ""+this.width;
  element.style.height= ""+this.height;
  element.filled = "false";
  element.strokecolor = "#FF0000";
  element.strokeweight = "1";
  element.points = points;
  
  node.appendChild( element );
  return element;
}

/**
  * Draw a polygon.
  * @param Xpoints array which specify the x coordinates of each point.
  * @param Ypoints array which specify the y coordinates of each point.
  * @param node node from the HTML DOM to insert this line into
  */
VMLGraphics2.prototype.drawPolygon = function(Xpoints, Ypoints,node) {
  return this.drawPolyline(Xpoints,Ypoints,node);
}

VMLGraphics2.prototype.fillPolygon = function(Xpoints, Ypoints) {
  var element = this.drawPolygon( Xpoints, Ypoints );
  element.filled = "true";
  return element;
}
   
/**
  * Outline of an ellipse. Values refer to the bounding rectangle of the ellipse, 
  * X and Y give the co-ordinates of the left top corner of that rectangle rather than of its center
  */
VMLGraphics2.prototype.drawCircle=function( X, Y, radius) {
  alert("VMLGraphics2.drawCircle");
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
VMLGraphics2.prototype.fillCircle=function( X, Y, radius ) {
  var diameter= radius * 2;
  var element = document.createElement("vml:oval");
  var xOffset = X-radius;
  var yOffset = Y-radius;
  
  element.style.position= "relative";
  element.style.left    = xOffset;
  element.style.top     = yOffset;
  element.style.width   = diameter;
  element.style.height  = diameter;
  
  element.fillcolor   = "#00FF00";
  element.strokecolor = "#00FF00"; //this.strokeStyle;
  //element.fillcolor   = this.fillStyle;
  //element.strokecolor = this.fillStyle; //this.strokeStyle;
  //element.strokeweigth= "1pt";
  //element.coordsize   = "1000,1000";
  //element.coordorigin = "0 0"
  
  this.div.appendChild( element );
  return element;
}
  
/*
 *
 */ 
VMLGraphics2.prototype.drawImage = function( src, X, Y, width, height, dx, dy) {
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
  
VMLGraphics2.prototype.swapImage = function( element, src) {
	var imagedata = element.firstChild
	imagedata.src = src
}

/**
  *
  */
VMLGraphics2.prototype.paint=function() {
}
  


