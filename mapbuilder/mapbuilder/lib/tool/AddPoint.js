/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/EditButtonBase.js");

/**
 * When this button is selected, clicks on the MapPane will add a
 * new point to a model.
 * Requires an enclosing GML model.
 * @constructor
 * @base EditButtonBase
 * @author Cameron Shorter cameronATshorter.net
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function AddPoint(toolNode, parentWidget) {
  // Extend EditButtonBase
  var base = new EditButtonBase(this, toolNode, parentWidget);

  /**
   * Add a point to the enclosing GML model.
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      point=objRef.targetModel.extent.getXY(targetNode.evpl);
      feature=objRef.targetGml.doc.selectSingleNode(objRef.featureXpath);
      feature.firstChild.nodeValue=point[0]+","+point[1];
      objRef.targetGml.setParam("refresh");
    }
  }
}
