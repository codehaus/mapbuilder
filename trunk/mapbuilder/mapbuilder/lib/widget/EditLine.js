/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

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
  var base = new ButtonBase(this, toolNode, model);

  /** Empty GML to load when this tool is selected. */
  //this.defaultModelUrl=toolNode.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;

  /** Reference to GML node to update when a feature is added. */
  this.featureXpath=toolNode.selectSingleNode("mb:featureXpath").firstChild.nodeValue;

  /**
   * Append a point to a line.
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      point=objRef.mouseHandler.model.extent.getXY(targetNode.evpl);
      old=objRef.targetModel.getXpathValue(
        objRef.targetModel,
        objRef.featureXpath);
      sucess=objRef.targetModel.setXpathValue(
        objRef.targetModel,
        objRef.featureXpath,
        old+" "+point[0]+","+point[1]);
      if(!sucess){
        alert("EditLine: invalid featureXpath in config: "+objRef.featureXpath);
      }
    }
  }
  this.setMouseListener = function(objRef) {
    if (objRef.mouseHandler) {
      objRef.mouseHandler.model.addListener('mouseup',objRef.doAction,objRef);
    }
  }
  this.targetModel.addListener( "loadModel", this.setMouseListener, this );
}
