/*
Author:       Patrice G. Cappelaere patAtcappelaere.com
Author:       Cameron Shorter cameronATshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html
*/

/**
  * Render features based upon a SLD file.
  * @param style SLD node (as retrieved from the Context)
  */
function SldRenderer( style ) {
  this.style = style;
}

/**
  * Renders a Feature based on SLD info.
  * @param gr VectorGraphic.
  * @param coords coordinates.
  * @param node HTML DOM node to insert the shape into.
  * @param gmlType Type of shape.
  * @return shape
  */
SldRenderer.prototype.paint = function(gr, coords,node,gmlType) {
  switch(gmlType){
    case "gml:Point":
      shape=this.paintPoint(gr,coords[0],node);
      break;
    case "gml:LineString":
      shape=this.paintLine(gr,coords,node);
      break;
    case "gml:Polygon":
    case "gml:LinearRing":
    case "gml:Box":
    case "gml:Envelope":
      shape=this.paintPolygon(gr,coords,node);
      break;
  }
}

/**
  * Renders a Point based on SLD info
  * @param gr VectorGraphic
  * @param coords point
  * @param node HTML DOM node to insert the shape into.
  * @return shape
  */
SldRenderer.prototype.paintPoint = function(gr,coords,node) {
  radius=2
  shape = gr.fillCircle(coords[0],coords[1],radius,node);
  return shape;
  
/*
  var shape = null;
  var X = coords[0];
  var Y = coords[1];
  var size = 0;
  var dx = 0;
  var dy = 0;
  var height = 0;
  var width = 0;
 
  this.getStyleAttributes( "sld:PointSymbolizer");
 
 
  var sizeNode  = this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Size");
  if( sizeNode != null ) {
    size = sizeNode.firstChild.nodeValue;
    width = size;
    height = size;
  } else {
    widthNode = this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Width");
    if( widthNode != null )
      width = widthNode.firstChild.nodeValue;
        
    heightNode = this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Height");
    if( heightNode != null )
      height= heightNode.firstChild.nodeValue;
  }
  
  var displacementNode = this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Displacement");
  if( displacementNode != null ) {
    dx = parseInt(this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Displacement/sld:DisplacementX").firstChild.nodeValue);
    dy = parseInt(this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Displacement/sld:DisplacementY").firstChild.nodeValue);
  }

  var externalGraphic = this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:ExternalGraphic" );
  if( externalGraphic != null ) {
    var href    = this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:ExternalGraphic/sld:OnlineResource");
    //var format  = externalGraphic.selectSingleNode("sld:Format");
    shape  = gr.drawImage( href.attributes.getNamedItem("xlink:href").nodeValue, X, Y, width, height, dx, dy )
  } else { 
    // WellKnownGraphicItems
    var pointTypeNode = this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Mark/sld:WellKnownName")
    if( pointTypeNode != null ) {
      pointType = pointTypeNode.firstChild.nodeValue;

	    this.getStyleAttributes( "sld:PointSymbolizer/sld:Graphic/sld:Mark");
	    if( this.strokeColor != null ) 
	      gr.setStrokeColor( this.strokeColor );
	    if( this.strokeWidth != null )
	      gr.setStrokeWidth( this.strokeWidth );
	    if( this.fillColor != null )
	      gr.setFillColor( this.fillColor );
	    
	    //circle, square, triangle, cross and star
	    if( pointType == "circle" ) { 
	      shape = gr.fillCircle( X, Y, size );   
	    } else if( pointType == "square" ) {
	    } else if( pointType == "triangle" ) {
	    } else if( pointType == "cross" ) {
	    } else if( pointType == "star" ) {
	    }
    }
  }
   
  return shape;
*/
}

/**
  * Renders a Line based on SLD info.
  * @param gr VectorGraphic
  * @param coords point
  * @param node HTML DOM node to insert the shape into.
  * @return shape
  */
SldRenderer.prototype.paintLine = function(gr,coords,node) {
    //TBD SLD should not be transforming points. SLD should use the same
    // format used by the Vector Graphics and XxLayer interfaces.
    // This is an opportunity for rendering optimisation.
    //
    // TBD This function should be removed and XxLayer should call
    // VectorGraphics directly.
    var xPoints = new Array(coords.length);
    var yPoints = new Array(coords.length);
    for( var i=0; i < coords.length; i++ ) {
      point = coords[i]
      xPoints[i] = parseInt(point[0])
      yPoints[i] = parseInt(point[1])
    }
  
  this.getStyleAttributes( "sld:LineSymbolizer" );
 
  //if( this.strokeColor != null ) {
  //  gr.setStrokeColor( this.strokeColor );
  //}
  
  //if( this.strokeWidth != null ) {
  //  gr.setStrokeWidth( this.strokeWidth );
  //}
  
  var shape = gr.drawPolyline(xPoints,yPoints,node);
  return shape;
}

/**
  * Renders a Point based on SLD info
  * @param gr VectorGraphic
  * @param coords point
  * @param node HTML DOM node to insert the shape into.
  * @return shape
  */
SldRenderer.prototype.paintPolygon = function(gr,coords,node) {
  var xPoints = new Array(coords.length+1);
  var yPoints = new Array(coords.length+1);
  for( var i=0; i<coords.length; i++ ) {
    point = coords[i]
    xPoints[i] = parseInt(point[0])
    yPoints[i] = parseInt(point[1])
  }
  
  // Close the line
  xPoints[i] = xPoints[0];
  yPoints[i] = yPoints[0];
  
  this.getStyleAttributes( "sld:PolygonSymbolizer" );
  
  if( this.strokeColor != null ) {
    gr.setStrokeColor( this.strokeColor );
  }
  
  if( this.strokeWidth != null ) {
    gr.setStrokeWidth( this.strokeWidth);
  }

  if( this.fillColor != null ) {
    gr.setFillColor( this.fillColor);
  }
  
  var shape = gr.drawPolygon(xPoints, yPoints,node);
  
  return shape;
}

/**
  * Set the strokeColor, strokeWidth and fillColor for a HTML element
  * based on this SLD parameters.
  * @param gr VectorGraphic
  * @param element The HTML element to set parameters for.
  * @param gmlType Type of shape.
  */
SldRenderer.prototype.setStyle = function(gr,element,gmlType) {
  //TBD Move getStyleAttributes code into this function.
  //TBD handle gmlType properly.
  this.getStyleAttributes("tbd");
  gr.setShapeStrokeColor(element,this.strokeColor);
  gr.setShapeStrokeWidth(element,this.strokeWidth);
  gr.setShapeFillColor(element,this.fillColor);
  gr.setShapeFill(element,this.fill);
}

/**
  * Retrieves style attributes from the style descriptor
  * @param path SLD Path
  */
SldRenderer.prototype.getStyleAttributes = function( path ) {
  // Set default styles to be used if SLD doesn't specify them
  this.strokeColor="#ff0000";
  this.strokeWidth = "1";
  this.fillColor = "#00ff00";
  this.fill="none";

  if (this.style){
    var node = this.style.selectSingleNode( path + "/sld:Stroke/sld:CssParameter[@name='stroke']");
    if( node != undefined ) {
      this.strokeColor = node.firstChild.nodeValue;
    } else {
      this.strokeColor = null;
    }
    
    node = this.style.selectSingleNode(path+"/sld:Stroke/sld:CssParameter[@name='stroke-width']");
    if( node != undefined ) {
      this.strokeWidth = node.firstChild.nodeValue;
    } else {
      this.strokeWidth = null;
    }
    
    node = this.style.selectSingleNode(path+"/sld:Fill/sld:CssParameter[@name='fill']");
    if( node != undefined ) {
      this.fillColor = node.firstChild.nodeValue;
    } else {
      this.fillColor = null;
    }
  }
}
