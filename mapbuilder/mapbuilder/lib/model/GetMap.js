/*
Author:       Mike Adair  mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
//mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget which generates a WFS query from it's parent document
 * @constructor
 * @base WidgetBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GetMap(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode, parent);
  this.namespace = "xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";

  this.prePaint = function(objRef) {
    objRef.stylesheet.setParameter("width", objRef.containerModel.getWindowWidth() );
    objRef.stylesheet.setParameter("height", objRef.containerModel.getWindowHeight() );
    bBox=objRef.containerModel.getBoundingBox();
    var bboxStr = bBox[0]+","+bBox[1]+","+bBox[2]+","+bBox[3];
    objRef.stylesheet.setParameter("bbox", bboxStr );
    objRef.stylesheet.setParameter("srs", objRef.containerModel.getSRS() );
    objRef.stylesheet.setParameter("version", objRef.model.getVersion(objRef.featureNode) );
    objRef.stylesheet.setParameter("baseUrl", objRef.model.getServerUrl("GetMap") );
    objRef.stylesheet.setParameter("mbId", objRef.featureNode.getAttribute("id") );
    objRef.resultDoc = objRef.featureNode;
  }

  /**
   * Render the widget.  Equivalent function to paint.
   * @param objRef Pointer to this object.
   */
  this.loadLayer = function(objRef, feature) {
    objRef.featureNode = feature;
    objRef.paint(objRef);
  }
  this.addListener("GetMap", this.loadLayer, this);

}

