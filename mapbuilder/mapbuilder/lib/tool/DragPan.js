/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * When this button is selected, click and drag on the MapPane to recenter the map.
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function DragPan(toolNode, parentWidget) {
  var base = new ToolBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  }

  this.selectButton = function() {
    this.parentWidget.mouseWidget.tools["DragPanHandler"].enable(true);
  }

  /**
   * Calls the centerAt method of the context doc to recenter with the given 
   * offset
   * @param model       The model that this tool will update.
   * @param targetNode  The element on which the mouse event occured
   */
  this.mouseUpHandler = function(model,targetNode) {
    alert("drag pan mouseup");
    //TBD: hide the mappane and then recenter at the new position
  }

  this.parentWidget.addListener( "paint", this.init, this );
}
