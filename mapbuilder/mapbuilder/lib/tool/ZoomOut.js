/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");

/**
 * When this button is selected, click and drag on the MapPane to recenter the map.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function ZoomOut(toolNode, parentWidget) {
  /** Other required tools. */
  this.dependancies=["AoiMouseHandler"];

  // Extend ButtonBase
  var base = new ButtonBase(this, toolNode, parentWidget);

  this.zoomBy = 4;//TBD: get this from config

  /**
   * Calls the centerAt method of the context doc to zoom out, recentering at 
   * the mouse event coordinates.
   * TBD: set the zoomBy property as a button property in conifg
   * @param objRef      Pointer to this AoiMouseHandler object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (!objRef.enabled) return;
    var bbox = objRef.targetModel.getParam("aoi");
    var extent = objRef.targetModel.extent;
    var newRes = extent.res[0]*objRef.zoomBy;
    extent.centerAt(bbox[0], newRes);
  }

  this.setMouseListener = function(toolRef) {
    if (toolRef.mouseHandler) {
      toolRef.mouseHandler.addListener('mouseup',toolRef.doAction,toolRef);
    }
  }
  this.parentWidget.targetModel.addListener( "loadModel", this.setMouseListener, this );

}
