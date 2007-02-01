/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: EditPoint.js 2511 2007-01-05 11:55:23Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");

/**
 * When this button is selected, clicks on the MapPane will add a
 * new point to a model.
 * Requires an enclosing GML model.
 * @constructor
 * @base EditButtonBase
 * @author Cameron Shorter cameronATshorter.net
 * @param widgetNode The node from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function EditPoint(widgetNode, model) {
  // Extend EditButtonBase
  EditButtonBase.apply(this, new Array(widgetNode, model));

  /**
   * Add a point to the enclosing GML model.
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      point=objRef.mouseHandler.model.extent.getXY(targetNode.evpl);
      sucess=objRef.targetModel.setXpathValue(
        objRef.targetModel,
        objRef.featureXpath,point[0]+","+point[1]);
      if(!sucess){
        alert(mbGetMessage("invalidFeatureXpathEditPoint", objRef.featureXpath));
      }
    }
  }
}
