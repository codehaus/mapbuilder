/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * When this button is selected, click and drag on the MapPane to recenter the map.
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function ZoomOut(toolNode, parentWidget) {
  var base = new ToolBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty];    
  } 

  this.selectButton = function() {
    this.parentWidget.mouseWidget.tools["AoiMouseHandler"].enable(true);
  }

  /**
   * Calls the centerAt method of the context doc to zoom out, recentering at 
   * the mouse event coordinates.
   * TBD: set the zoomBy property as a button property in conifg
   * @param model       The model that this tool will update.
   * @param targetNode  The element on which the mouse event occured
   */
  this.mouseUpHandler = function(model,targetNode) {
    //should be aoi center?
    model.extent.CenterAt(targetNode.evxy, model.extent.res[0]*model.extent.zoomBy);
  }

  this.parentWidget.addListener( "paint", this.init, this );
}
