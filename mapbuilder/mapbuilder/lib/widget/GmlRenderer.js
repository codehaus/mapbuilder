/*
Author:       Cameron Shorter cameronATshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Render GML into HTML.  this.targetModel references the context model with
 * width/height attributes.
 * @constructor
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GmlRenderer(widgetNode, model) {
  // Inherit the WidgetBase functions and parameters
  var base = new WidgetBase(widgetNode, model,"absolute");
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  }

  /** Xsl to convert Coordinates to Coords. */
  this.coordXsl=new XslProcessor(baseDir+"/widget/GmlCooordinates2Coord.xsl");

  //this.node.style.position="relative";
  //this.node.style.width=this.model.getWindowWidth();
  //this.node.style.height=this.model.getWindowHeight();

  /**
   * Set up XSL params and convert Gml Coordinate nodes to Gml Coords so that they
   * are easier to process by XSL.
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    objRef.stylesheet.setParameter("width", objRef.targetModel.getWindowWidth() );
    objRef.stylesheet.setParameter("height", objRef.targetModel.getWindowHeight() );
    bBox=objRef.targetModel.getBoundingBox();
    objRef.stylesheet.setParameter("bBoxMinX", bBox[0] );
    objRef.stylesheet.setParameter("bBoxMinY", bBox[1] );
    objRef.stylesheet.setParameter("bBoxMaxX", bBox[2] );
    objRef.stylesheet.setParameter("bBoxMaxY", bBox[3] );

    objRef.resultDoc = objRef.coordXsl.transformNodeToObject(objRef.resultDoc);
  }

  // Call paint() when the context changes
  this.targetModel.addListener("boundingBox",this.paint, this);
}
