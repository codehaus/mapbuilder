/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");

/**
 * When this button is selected, the AOI box stays visible and no zoom happens. 
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function SetAoi(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  }

  /**
   * Calls the model's center at method to zoom in.  If the AOI is a single point,
   * it zooms in by the zoomBy factor.
   * @param objRef      Pointer to this AoiMouseHandler object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      var bbox = objRef.targetModel.getAoi();
      if ( objRef.targetModel.aoiValid) {
        var extent = objRef.targetModel.extent;
        var ul = extent.GetXY( bbox[0] );
        var lr = extent.GetXY( bbox[1] );
        if ( ( ul[0]==lr[0] ) && ( ul[1]==lr[1] ) ) {
          extent.CenterAt( ul, extent.res[0]/objRef.zoomBy );
        } else {
          extent.ZoomToBox( ul, lr );
        }
      }
    }
  }

  if (this.mouseHandler) {
    this.mouseHandler.addListener('mouseup',this.doAction,this);
  }
   */

}

