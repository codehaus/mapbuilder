/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");

/**
 * When this button is selected, the AOI box stays visible and no zoom happens. 
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function SetAoi(toolNode, parentWidget) {
  /** Other required tools. */
  this.dependancies=["AoiMouseHandler"];

  // Extend ButtonBase
  var base = new ButtonBase(this, toolNode, parentWidget);

  /**
   * The action to do on click
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    //does nothing for the moment
  }

  if (this.mouseHandler) {
    this.mouseHandler.addListener('mouseup',this.doAction,this);
  }

}

