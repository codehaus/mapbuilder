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
  var base = new ButtonBase(this, toolNode, parentWidget);

  /**
   * Add a point to the enclosing GML model.
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      alert("AddPoint: Add functionality here");
    }
  }

  /**
   * Register for mouseUp events.
   */
  this.setMouseListener = function(toolRef) {
    if (toolRef.mouseHandler) {
      toolRef.mouseHandler.addListener('mouseup',toolRef.doAction,toolRef);
    }
  }
  this.parentWidget.targetModel.addListener( "loadModel", this.setMouseListener, this );
}
