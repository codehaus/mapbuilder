/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");

/**
 * When this button is selected, call a GetFeatureInfo request for the selected
 * layer and point clicked.
 * @constructor
 * @author Cameron Shorter cameronATshorter.net
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function Query(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty];    
  } 

  /**
   * Call a GetFeatureInfo request for the selected layer.
   * @param objRef      Pointer to this MouseHandler object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      alert("Query function not implemented yet.");
    }
  }
  if (this.mouseHandler) {
    this.mouseHandler.addListener('mouseup',this.doAction,this);
  }
}
