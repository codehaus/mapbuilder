/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");

/**
 * When this button is selected, clicks on the MapPane will add a
 * new point to a line.
 * @constructor
 * @base EditButtonBase
 * @author Cameron Shorter cameronATshorter.net
 * @param toolNode      The tool node from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function EditLine(toolNode, model) {
  // Extend EditButtonBase
  var base = new EditButtonBase(this, toolNode, model);

  /**
   * Append a point to a line.
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      point=objRef.targetModel.extent.getXY(targetNode.evpl);
      old=objRef.targetGml.getXlinkValue(
        objRef.targetGml,
        objRef.featureXpath);
      sucess=objRef.targetGml.setXlinkValue(
        objRef.targetGml,
        objRef.featureXpath,
        old+" "+point[0]+","+point[1]);
      if(!sucess){
        alert("EditLine: invalid featureXpath in config: "+objRef.featureXpath);
      }
    }
  }
}
