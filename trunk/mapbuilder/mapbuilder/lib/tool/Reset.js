/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");

/**
 * When this button is pressed the map will reload with it's original extent
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function Reset(toolNode, parentWidget) {
  var base = new ButtonBase(this, toolNode, parentWidget);

  this.targetModel = this.parentWidget.targetModel;

  /**
   * Store a copy of the original extent locally.
   * @param objRef Pointer to this object.
   */
  this.initExtent = function(objRef) {
    objRef.originalExtent = new Extent( objRef.targetModel );   
    objRef.originalExtent.init( objRef.originalExtent );
    objRef.originalExtent.setResolution( new Array(objRef.targetModel.getWindowWidth(), objRef.targetModel.getWindowHeight()) );
  }
  this.targetModel.addListener("loadModel",this.initExtent, this);

  /**
   * Calls the reset() method of the context doc to reload at with the original extent
   * @param objRef      Pointer to this AoiMouseHandler object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    var originalExtent = objRef.originalExtent;
    objRef.targetModel.extent.centerAt( originalExtent.getCenter(), originalExtent.res[0] );
  }
}


