/*
Author:       Cameron Shorter cameronATshorter.net, Mike Adair, Nedjo Rogers
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id:
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");

/**
 * Render GML into SVG.
 * Calls GmlCoordinates2Coord.xsl to convert GML to a simpler form.
 * Calls GmlRendererSVG.xsl to convert GML to SVG.
 * this.targetModel references the context model with
 * width/height attributes.
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GmlRendererSVG(widgetNode, model) {
  var base = new MapContainerBase(this,widgetNode,model);

  /** Output of XSL will be xhtml which will be appended to document.*/
  this.paintMethod="xsl2html";

  /** Xsl to convert GML Coordinates to Coords. */
  this.coordXsl=new XslProcessor(baseDir+"/widget/GmlCooordinates2Coord.xsl");

  /**
   * Set up XSL params and convert Gml Coordinate nodes to Gml Coords so
   * that they are easier to process by XSL.
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    objRef.model.setParam("modelStatus",mbGetMessage("preparingCoords"));
    objRef.stylesheet.setParameter("width", objRef.containerModel.getWindowWidth() );
    objRef.stylesheet.setParameter("height", objRef.containerModel.getWindowHeight() );
    bBox=objRef.containerModel.getBoundingBox();
    objRef.stylesheet.setParameter("bBoxMinX", bBox[0] );
    objRef.stylesheet.setParameter("bBoxMinY", bBox[1] );
    objRef.stylesheet.setParameter("bBoxMaxX", bBox[2] );
    objRef.stylesheet.setParameter("bBoxMaxY", bBox[3] );
    objRef.stylesheet.setParameter("color", "#FF0000" );

    objRef.resultDoc = objRef.coordXsl.transformNodeToObject(objRef.resultDoc);

  }

  /**
   * Called when the context's hidden attribute changes.
   * @param objRef This object.
   * @param layerName  The name of the layer that was toggled.
   */
  this.hiddenListener=function(objRef, layerName){
    var vis="visible";
    if(objRef.model.getHidden(layerName)) {
      vis="hidden";
    }
    var outputNode = document.getElementById(objRef.outputNodeId)
    for (var i=0; i< outputNode.childNodes.length; ++i) {
      outputNode.childNodes[i].style.visibility=vis;
    }
  }
  this.model.addListener("hidden",this.hiddenListener,this);

}
