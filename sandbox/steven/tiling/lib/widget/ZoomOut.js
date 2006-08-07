/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ZoomOut.js 2133 2006-06-22 15:28:52Z steven $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, click on the map to zoom out centered at the click.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function ZoomOut(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

  /**
  Set the zoomfactor and check if it is set in de configuration file.
  */
  this.zoomFactor = 4;
  var zoomFactor = widgetNode.selectSingleNode("mb:zoomFactor");
  if (zoomFactor) this.zoomFactor = zoomFactor.firstChild.nodeValue;
  /**
   * Calls the centerAt method of the context doc to zoom out, recentering at 
   * the mouse event coordinates.
   * TBD: set the zoomFactor property as a button property in conifg
   * @param objRef      Pointer to this AoiMouseHandler object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (!objRef.enabled) return;
    var bbox = objRef.targetModel.getParam("aoi");
    var extent = objRef.targetModel.extent;
    var newRes = extent.res[0]*objRef.zoomFactor;
    extent.centerAt(bbox[0], newRes);
  }

  /**
   * Register for mouseUp events.
   * @param objRef  Pointer to this object.
   */
  this.setMouseListener = function(objRef) {
    if (objRef.mouseHandler) {
      objRef.mouseHandler.model.addListener('mouseup',objRef.doAction,objRef);
    }
  }
  this.model.addListener( "loadModel", this.setMouseListener, this );

}
