/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * When this button is selected, clicks on the MapPane trigger a zoomIn to the 
 * currently set AOI.
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function ZoomIn(toolNode, parentWidget) {
  var base = new ToolBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  }

  this.selectButton = function() {
    this.parentWidget.mouseWidget.tools["AoiMouseHandler"].enable(true);
  }

  /**
   * Calls the model's ceter at method to zoom in.  If the AOI is a single point,
   * it zooms in by the zoomBy factor.
   * @param model       The model that this tool will update.
   * @param targetNode  The element on which the mouse event occured
   */
  this.mouseUpHandler = function(model,targetNode) {
    var bbox = model.getAoi();
    var ul = model.extent.GetXY( bbox[0] );
    var lr = model.extent.GetXY( bbox[1] );
    if ( ( ul[0]==lr[0] ) && ( ul[1]==lr[1] ) ) {
      model.extent.CenterAt( ul, model.extent.res[0]/model.extent.zoomBy );
    } else {
      model.extent.ZoomToBox( ul, lr );
    }
  }

  this.parentWidget.addListener( "paint", this.init, this );
}

