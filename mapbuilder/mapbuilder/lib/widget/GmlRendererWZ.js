/*
Author:       Cameron Shorter cameronATshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");

/**
 * Render GML into HTML.
 * Calls GmlCoordinates2Coord.xsl to convert GML to a simpler form.
 * Calls GmlRendererWZ.xsl to convert GML to wz_jsgraphics graphic function
 * calls.
 * this.targetModel references the context model with
 * width/height attributes.
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GmlRendererWZ(widgetNode, model) {
  var base = new MapContainerBase(this,widgetNode,model);

  /** Output of XSL will be javascript which will be executed when painting.*/
  this.paintMethod="xsl2js";

  /** Xsl to convert Coordinates to Coords. */
  this.coordXsl=new XslProcessor(baseDir+"/widget/GmlCooordinates2Coord.xsl");

  /**
   * Set up XSL params and convert Gml Coordinate nodes to Gml Coords so
   * that they are easier to process by XSL.
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    objRef.stylesheet.setParameter("width", objRef.containerModel.getWindowWidth() );
    objRef.stylesheet.setParameter("height", objRef.containerModel.getWindowHeight() );
    bBox=objRef.containerModel.getBoundingBox();
    objRef.stylesheet.setParameter("bBoxMinX", bBox[0] );
    objRef.stylesheet.setParameter("bBoxMinY", bBox[1] );
    objRef.stylesheet.setParameter("bBoxMaxX", bBox[2] );
    objRef.stylesheet.setParameter("bBoxMaxY", bBox[3] );
    objRef.stylesheet.setParameter("color", "#FF0000" );

    objRef.resultDoc = objRef.coordXsl.transformNodeToObject(objRef.resultDoc);

    // WZ Graphics object and rendering functions.
    /*
    if (! objRef.jg) {
      objRef.jg=new jsGraphics(objRef.outputNodeId);
      objRef.jg.setColor(objRef.lineColor);
      //TBD: The following causes lines to be drawn incorrectly in Mozilla 1.71
      //objRef.jg.setStroke(objRef.lineWidth);
    }
    objRef.jg.clear();
    */
  }

  /**
   * Reset internal variables after container is redrawn due to refreshing
   * of the model.
   */
  this.refresh = function(objRef) {
    objRef.jg=null;
  }
  model.addListener("refresh",this.refresh, this);

  // Call paint() when the context changes
/*
  this.init = function(objRef) {
    objRef.targetModel.addListener("refresh",objRef.paint, objRef);
  }
  this.model.addListener("loadModel",this.init,this);
*/
}
