/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");

/**
 * When this button is selected, click and drag on the MapPane to recenter the map.
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function DragPan(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  }

  /**
   * Calls the centerAt method of the context doc to recenter with the given 
   * offset
   * @param objRef      Pointer to this AoiMouseHandler object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (!objRef.enabled) return;
    alert("drag pan mouseup");
    //TBD: hide the mappane and then recenter at the new position
  }
  if (this.mouseHandler) {
    this.mouseHandler.parentWidget.addListener('mouseup',this.doAction,this);
  }
}
