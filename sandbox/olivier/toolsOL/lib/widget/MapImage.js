/*
Author:       Mike Adair
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: MapImage.js 1671 2005-09-20 02:37:54Z madair1 $
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
  WidgetBase.apply(this,new Array(widgetNode, model));

  this.paint = function(objRef) {
   if (objRef.model.doc && objRef.node) {

      objRef.prePaint(objRef);

      //confirm inputs

      //set to output to a temporary node
      //hack to get by doc parsing problem in IE
      //the firstChild of tempNode will be the root element output by the stylesheet
      var outputNode = document.getElementById( objRef.outputNodeId );
      var tempNode = document.createElement("DIV");

      //here the model document is an image
      tempNode.style.position="absolute";
      tempNode.style.top=0;
      tempNode.style.left=0;
      tempNode.appendChild(objRef.model.doc);   //!!doc is an IMG object
      tempNode.setAttribute("id", objRef.outputNodeId);

      //look for this widgets output and replace if found,
      //otherwise append it
      if (outputNode) {
        objRef.node.replaceChild(tempNode,outputNode);
      } else {
        objRef.node.appendChild(tempNode);
      }

      objRef.postPaint(objRef);
    }
  }
  this.model.addListener("refresh",this.paint, this);

  MapContainerBase.apply(this,new Array(widgetNode, model));

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
