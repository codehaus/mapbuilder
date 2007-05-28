/*
Author:       Patrice G. Cappelaere patAtcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: StyledLayerDescriptor.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

/**
  * @param style SLD node (as retrieved from WMC)
  */
function StyleLayerDescriptor( style ) {
  this.style = style;
}

/**
  * Basic shape hiliting
  */
StyleLayerDescriptor.prototype.hiliteShape = function( gr, shape, symbolizer) {
  this.getStyleAttributes( symbolizer);
  
  if( symbolizer == "sld:PointSymbolizer") {
    // check if we need to switch the image
    var externalGraphic = this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:ExternalGraphic" );
    if( externalGraphic != null ) {
      var href    = this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:ExternalGraphic/sld:OnlineResource");
      //var format  = externalGraphic.selectSingleNode("sld:Format");
      gr.swapImage( shape, href.attributes.getNamedItem("xlink:href").nodeValue)
      return;
    }
   }
  
  // This is for line and polygons
  // alert( "stroke:"+this.strokeColor+" width:"+this.strokeWidth+" fill:"+this.fillColor);
  if( this.strokeColor != null ) {  
    gr.setShapeStrokeColor( shape, this.strokeColor );
    //shape.stroked = "true";
  } else {
    //shape.stroked = "false"
  }
    
  if( this.strokeWidth != null ) {
    gr.setShapeStrokeWidth(shape, this.strokeWidth);
  }
    
  if( this.fillColor != undefined ) {
    gr.setShapeFillColor( shape, this.fillColor);
    //shape.filled = "true";
  } else {
    //shape.filled = "false";
  }
}

/**
  * Hilight / DeHilight Point based on a SLD.  A different SLD is used for either one.
  * @param element
  */
StyleLayerDescriptor.prototype.hilitePoint = function( gr, shape) {
  //this.getStyleAttributes( "sld:PointSymbolizer");
  this.hiliteShape( gr, shape, "sld:PointSymbolizer" );
}
  
/**
  * Renders a Point based on SLD info
  * @param gr VectorGraphic
  * @param coords point
  * @return shape
  */
StyleLayerDescriptor.prototype.paintPoint = function( gr, coords) {
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
}

/**
  * Hilight / DeHilight Line based on a SLD.  A different SLD is used for either one.
  * @param element
  */
StyleLayerDescriptor.prototype.hiliteLine = function( gr, shape) {
  //this.getStyleAttributes( "sld:LineSymbolizer" );
  this.hiliteShape( gr, shape, "sld:LineSymbolizer" )
}

/**
  * Renders a Line based on SLD info
  * @param gr VectorGraphic
  * @param coords point
  * @return shape
  */
StyleLayerDescriptor.prototype.paintLine = function( gr, coords) {
    var xPoints = new Array(coords.length);
    var yPoints = new Array(coords.length);
    for( var i=0; i < coords.length; i++ ) {
      point = coords[i]
      xPoints[i] = parseInt(point[0])
      yPoints[i] = parseInt(point[1])
    }
  
  this.getStyleAttributes( "sld:LineSymbolizer" );
 
  if( this.strokeColor != null ) {
    gr.setStrokeColor( this.strokeColor );
  }
  
  if( this.strokeWidth != null ) {
    gr.setStrokeWidth( this.strokeWidth );
  }
  
  var shape = gr.drawPolyline(xPoints, yPoints);
  return shape;
}

/**
  * Hilight / DeHilight Polygon based on a SLD.  A different SLD is used for either one.
  * @param element
  */
StyleLayerDescriptor.prototype.hilitePolygon = function( gr, shape) {
  //this.getStyleAttributes( "sld:PolygonSymbolizer" );
  this.hiliteShape( gr, shape, "sld:PolygonSymbolizer" );
}

/**
  * Renders a Point based on SLD info
  * @param gr VectorGraphic
  * @param coords point
  * @return shape
  */
StyleLayerDescriptor.prototype.paintPolygon = function( gr, coords) {
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
  
  var shape = gr.drawPolygon(xPoints, yPoints);
  
  return shape;
}

/**
  * Retrieves style attributes from the style descriptor
  * @param path SLD Path
  */
StyleLayerDescriptor.prototype.getStyleAttributes = function( path ) {
  // Set default styles to be used if SLD doesn't specify them
  this.strokeColor="#ff0000";
  this.strokeWidth = "1";
  this.fillColor = "#00ff00";

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
