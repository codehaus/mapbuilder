/*
Author:       Cameron Shorter cameronATshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
mapbuilder.loadScript(baseDir+"/util/wz_jsgraphics/wz_jsgraphics.js");

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
  /**
   * convert coordinates in the GML document to the SRS of the map container, 
   * if required
   * @param objRef Pointer to this object.
   */
  this.convertCoords = function(objRef) {
    var coordNodes = objRef.model.doc.selectNodes("//gml:coordinates");
    if (coordNodes.length>0) {
      var srsName = coordNodes[0].parentNode.getAttribute("srsName");
      if (srsName != objRef.containerModel.getSRS()) {  //TBD: might need better comparison test
        var sourceProj = new Proj(srsName);
        var containerProj = new Proj(objRef.containerModel.getSRS());
        for (var i=0; i<coordNodes.length; ++i) {
          var coords = coordNodes[i].firstChild.nodeValue;
          var coordsArray = coords.split(' ');
          var newCoords = '';
          for (var j=0; j<coordsArray.length; ++j) {
            var xy = coordsArray[j].split(',');
            var llTemp = sourceProj.Inverse(xy);
            xy = containerProj.Forward(llTemp);
            newCoords += xy.join(',') + ' ';
          }
          coordNodes[i].firstChild.nodeValue=newCoords;
        }
      }
    }
  }
  model.addListener("loadModel",this.convertCoords,this);

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
    objRef.stylesheet.setParameter("width", objRef.containerModel.getWindowWidth() );
    objRef.stylesheet.setParameter("height", objRef.containerModel.getWindowHeight() );
    bBox=objRef.containerModel.getBoundingBox();
    objRef.stylesheet.setParameter("bBoxMinX", bBox[0] );
    objRef.stylesheet.setParameter("bBoxMinY", bBox[1] );
    objRef.stylesheet.setParameter("bBoxMaxX", bBox[2] );
    objRef.stylesheet.setParameter("bBoxMaxY", bBox[3] );
    objRef.stylesheet.setParameter("color", "#FF0000" );

    objRef.resultDoc = objRef.coordXsl.transformNodeToObject(objRef.resultDoc);

    // Force refresh of the wz_jsgraphics handle when the widget's node
    // has been refreshed.
    if (!document.getElementById(objRef.outputNodeId)){
      objRef.jg=null;
    }
  }
}
