/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
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
 * @param widgetNode The from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function EditLine_1(widgetNode, model) {
  // Extend EditButtonBase
  var base = new ButtonBase(this, widgetNode, model);

  /** Reference to GML node to update when a feature is added. */
  this.featureXpath=widgetNode.selectSingleNode("mb:featureXpath").firstChild.nodeValue;

  /**
   * Append a point to a line.
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      point=objRef.targetModel.containerModel.extent.getXY(targetNode.evpl);
      old=objRef.targetModel.getXpathValue(
        objRef.targetModel,
        objRef.targetModel.nodeSelectXpath+objRef.featureXpath);
      if(!old){old=""};
      sucess=objRef.targetModel.setXpathValue(
        objRef.targetModel,
        objRef.targetModel.nodeSelectXpath+objRef.featureXpath,
        old+" "+point[0]+","+point[1]);
      if(!sucess){
        alert("EditLine: invalid featureXpath in config: "+objRef.targetModel.nodeSelectXpath+objRef.featureXpath);
      }
    }
  }

  /**
   * Register for mouseUp events.
   * @param objRef  Pointer to this object.
   */
  this.setMouseListener = function(objRef) {
    if (objRef.targetModel.containerModel) {
      objRef.targetModel.containerModel.addListener('mouseup',objRef.doAction,objRef);
    }
  }
  config.addListener( "loadModel", this.setMouseListener, this );
}
