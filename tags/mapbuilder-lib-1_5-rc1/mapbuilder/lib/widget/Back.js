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
 * @author Steven Ottens AT geodan.nl
 * @param widgetNode      The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function Back(widgetNode, model) {
  ButtonBase.apply(this, new Array(widgetNode, model));

  /**
   * Replaces the current extent with the previous one in history
   * @param objRef      Pointer to this object.
   */
  this.doSelect = function(selected,objRef) {
    if (selected){

		this.targetModel.setParam("historyBack");
      var previousExtent = objRef.targetModel.previousExtent;
      if(previousExtent){
        this.targetModel.setParam("historyStop");
        objRef.targetModel.extent.zoomToBox( previousExtent[0], previousExtent[1] );
        this.targetModel.setParam("historyStart");
      }
    }
  }
}


