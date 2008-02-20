/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Save.js 3052 2007-08-01 21:25:21Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is pressed the targetModel is posted to the serializeUrl.
 * Also defines a listener function for the "modelSaved" event which opens 
 * the serialized document in a new browser window but only
 * if the a popupWindowName property is defined for the button in config.
 *
 * @constructor
 * @base ButtonBase
 * @author Roald de Wit (rdewit *AT* lisasoft *DOT* com 
 * @param widgetNode  The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function SaveContext(widgetNode, model) {
  ButtonBase.apply(this, new Array(widgetNode, model));

 /**
   * Save model control.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} instance of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class( OpenLayers.Control, {
    
      type: OpenLayers.Control.TYPE_BUTTON,
      
      trigger: function () {
        objRef.targetModel.addListener("modelSaved", objRef.popupContext, objRef);
        objRef.targetModel.saveModel(objRef.targetModel);
       },
       CLASS_NAME: 'mbControl.Save'
  });
  return Control;
  }

 /**
   * Open popup window with context
   * @param objRef reference to this object.
   * @return none 
   */
  this.popupContext = function(objRef) {
    url = objRef.targetModel.getParam("modelSaved");
    if (url) {
      var popup=window.open(url);
      if (!popup) {
        alert('Please allow popups in order to save the context');
      }
    } else {
      alert('Model could not be saved. Our apologies.');
    }
  }


}


