/*
Author:       Cameron Shorter cameronATshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");

/**
 * Render GML into the WKT defined in the OGC .
 * Calls GmlCoordinates2Coord.xsl to convert GML to a simpler form.
 * Calls GmlRendererWKT.xsl to convert GML to WKT format.
 * this.targetModel references the context model with
 * width/height attributes.
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GmlRendererWKT(widgetNode, model) {
  var base = new MapContainerBase(this,widgetNode,model);

  /** Output of XSL will be javascript which will be executed when painting.*/
  this.paintMethod="xsl2js";

  /** Xsl to convert GML Coordinates to Coords. */
  this.coordXsl=new XslProcessor(baseDir+"/widget/GmlCooordinates2Coord.xsl");

  /**
   * Set up XSL params and convert Gml Coordinate nodes to Gml Coords so
   * that they are easier to process by XSL.
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
	objRef.stylesheet.setParameter('objRef','objRef');
    objRef.model.setParam("modelStatus",objRef.getMessage("preparingCoords"));
    objRef.stylesheet.setParameter("targetElement", objRef.containerModel.getWindowWidth() );
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
