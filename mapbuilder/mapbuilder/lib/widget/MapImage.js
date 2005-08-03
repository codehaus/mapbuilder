/*
Author:       Mike Adair
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");

/**
 * Widget to render a single map layer from an OGC context document.
 * TBD: not yet completed.
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function MapImage(widgetNode, model) {
  var base = new MapContainerBase(this,widgetNode,model);
  this.paintMethod = "image2html";

  /**
   * Override of widget prepaint to set the width and height of the Map layer
   * document.
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    objRef.model.doc.width = objRef.containerModel.getWindowWidth();
    objRef.model.doc.height = objRef.containerModel.getWindowHeight();
  }

}
