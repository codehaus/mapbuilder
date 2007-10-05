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
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode  The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function Save(widgetNode, model) {
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
       		this.map.mbMapPane.targetModel.saveModel(this.map.mbMapPane.targetModel);  
                 
            
       },
       CLASS_NAME: 'mbControl.Save'
  });
  return Control;
  }

}


