/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");

/**
 * When this button is selected, clicks on the MapPane will add a
 * new point to a model.
 * Requires an enclosing GML model.
 * @constructor
 * @base ButtonBase
 * @author Cameron Shorter cameronATshorter.net
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function AddPoint(toolNode, parentWidget) {
  /** Other required tools. */
  this.dependancies=["MouseClickHandler"];

  // Extend ButtonBase
  var base = new ButtonBase(this, toolNode, parentWidget);

  /** Empty GML to load when this tool is selected. */
  this.defaultModelUrl=toolNode.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;
  /** Model to update when a feature is added. */
  this.targetGmlId=toolNode.selectSingleNode("mb:targetGml").firstChild.nodeValue;
  this.targetGml=eval("config."+this.targetGmlId);

  /** Reference to GML node to update when a feature is added. */
  this.featureXpath=toolNode.selectSingleNode("mb:featureXpath").firstChild.nodeValue;

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

  /**
   * Load the default GML feature sepecified in the config file.
   * @param objRef Pointer to this object.
   * @param selected True when selected.
   */
  this.doSelect = function(selected,objRef) {
    if (objRef.enabled && selected) {
      // load default GML
      var httpPayload=new Object();
      httpPayload.url=objRef.defaultModelUrl;
      httpPayload.method="get";
      httpPayload.postData=null;
      objRef.targetGml.setParam('httpPayload',httpPayload);
    }
  }

  /**
   * Register for mouseup events, called after model loads.
   * @param objRef Pointer to this object.
   */
  this.setMouseListener = function(objRef) {
    if (objRef.mouseHandler) {
      objRef.mouseHandler.addListener('mouseup',objRef.doAction,objRef);
    }
  }
  this.parentWidget.targetModel.addListener("loadModel",this.setMouseListener, this);
}
