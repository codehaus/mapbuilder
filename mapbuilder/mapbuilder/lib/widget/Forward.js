/*
Author:       Steven Ottens AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is pressed the map will reload with it's original extent
 * @constructor
 * @base ButtonBase
 * @author Steven Ottens AT Geodan.nl
 * @param widgetNode      The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function Forward(widgetNode, model) {
  ButtonBase.apply(this, new Array(widgetNode, model));
  
  /**
   * Replaces the current extent with the next one in history
   * @param objRef      Pointer to this object.
   */
  this.doSelect = function(selected,objRef) {
    if (selected){
      var nextExtent = objRef.targetModel.history.forward(objRef);
      if(nextExtent){
        objRef.targetModel.history.stop(objRef);
        objRef.targetModel.extent.zoomToBox( nextExtent[0], nextExtent[1] );
        objRef.targetModel.history.start(objRef);
      }
    }
  }
}


