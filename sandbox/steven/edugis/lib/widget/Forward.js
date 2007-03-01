/*
Author:       Steven Ottens AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Forward.js 1722 2005-10-11 13:59:38Z graphrisc $
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

		this.targetModel.setParam("historyForward");
      var nextExtent = objRef.targetModel.nextExtent;
      if(nextExtent){
        this.targetModel.setParam("historyStop");
        objRef.targetModel.extent.zoomToBox( nextExtent[0], nextExtent[1] );
        this.targetModel.setParam("historyStart");
      }
    }
  }
}


