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
function DragPan(toolNode, parentWidget) {
  var base = new ButtonBase(this, toolNode, parentWidget);

  /**
   * Calls the centerAt method of the context doc to recenter to its AOI
   * @param objRef      Pointer to this DragPan tool object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      var bbox = objRef.targetModel.getParam("aoi");
      if ( objRef.targetModel.getParam("aoi")!=null) {
        var extent = objRef.targetModel.extent;
        var ul = bbox[0];
        var lr = bbox[1];
        if ( ( ul[0]==lr[0] ) && ( ul[1]==lr[1] ) ) {
          extent.centerAt( ul, extent.res[0]/objRef.zoomBy );
        } else {
          extent.zoomToBox( ul, lr );
        }
      }
    }
  }

  if (this.mouseHandler) {
    this.mouseHandler.addListener('mouseup',this.doAction,this);
  }
}
