/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is pressed the map will reload with it's original extent
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode      The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function Reset(widgetNode, model) {
  ButtonBase.apply(this, new Array(widgetNode, model));

  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
  this.cursor = "default"; 

  /**
   * Store a copy of the original extent locally as a loadModel event listener.
   * @param objRef Pointer to this object.
   */
  this.initExtent = function(objRef) {
    objRef.originalExtent = new Extent( objRef.targetModel );   
    objRef.originalExtent.init( objRef.originalExtent );
    objRef.originalExtent.setResolution( new Array(objRef.targetModel.getWindowWidth(), objRef.targetModel.getWindowHeight()) );
  }

  /**
   * Set the loadModel listener in response to init event
   * @param objRef Pointer to this object.
   */
  this.initReset = function(objRef) {
    objRef.targetModel.addListener("loadModel",objRef.initExtent, objRef);
  }
  this.model.addListener("init",this.initReset, this);


  /**
   * Calls the reset() method of the context doc to reload at with the original extent
   * @param objRef      Pointer to this AoiMouseHandler object.
   */
  this.doSelect = function(selected,objRef) {
    if (selected){
      var originalExtent = objRef.originalExtent;
      objRef.targetModel.extent.centerAt( originalExtent.getCenter(), originalExtent.res[0] );
    }
  }
}

