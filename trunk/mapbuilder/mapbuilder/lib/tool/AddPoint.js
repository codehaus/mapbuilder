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
  this.defaultGml=toolNode.selectSingleNode("mb:defaultGml").firstChild.nodeValue;
  /** Model to update when a feature is added. */
  this.targetGmlId=toolNode.selectSingleNode("mb:targetGml").firstChild.nodeValue;
  this.targetGml=eval("config."+this.targetGmlId);

  /** Reference to GML node to update when a feature is added. */
  this.featureXlink=toolNode.selectSingleNode("mb:featureXlink").firstChild.nodeValue;

  /**
   * Add a point to the enclosing GML model.
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      feature=objRef.targetGml.doc.selectSingleNode(objRef.featureXlink);
      alert("AddPoint: feature="+feature.firstChild.nodeValue);
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
      httpPayload.url=objRef.defaultGml;
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
