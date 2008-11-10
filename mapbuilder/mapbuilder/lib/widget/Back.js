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
   * Interactive ZoomOut control.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} instance of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class( OpenLayers.Control, {
      type: OpenLayers.Control.TYPE_BUTTON,
      
      trigger: function() {
              var objRef = this.objRef;
              objRef.targetModel.setParam("historyBack");
              var previousExtent = objRef.targetModel.previousExtent;
              if(previousExtent){
                objRef.targetModel.setParam("historyStop");
                this.map.setCenter(previousExtent.center);
                this.map.zoomToScale(previousExtent.scale);
                objRef.targetModel.setParam("historyStart");
              }
      },
      
      CLASS_NAME: 'mbControl.Back'
    });
    return Control;
  }
}


