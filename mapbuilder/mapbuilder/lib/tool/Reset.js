/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");

/**
 * When this button is pressed the map will reload with it's original extent
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function Reset(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  //store a copy of the original extent
  this.initExtent = function(objRef) {
    this.originalExtent = new Extent( objRef.targetModel );   
    this.originalExtent.init( objRef.originalExtent );
    this.originalExtent.SetResolution( new Array(objRef.targetModel.getWindowWidth(), objRef.targetModel.getWindowHeight()) );
  }
  this.targetModel.addListener("loadModel",this.initExtent, this);
  this.initExtent(this);

  /**
   * Calls the reset() method of the context doc to reload at with the original extent
   * @param objRef      Pointer to this AoiMouseHandler object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    var originalExtent = objRef.originalExtent;
    objRef.targetModel.extent.CenterAt( originalExtent.GetCenter(), originalExtent.res[0] );
  }
}


