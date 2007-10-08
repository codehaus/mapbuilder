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
        var s=(new XMLSerializer()).serializeToString(objRef.targetModel.doc);
        s=
            "<html><title>"
            +"Context"
            +"</title><body>"
            +Sarissa.escape(s)
            +"</body></html>"
        // Insert break after each tag
        s=s.replace(/&gt;/g, "&gt;<br/>")
        var popup=window.open();
        popup.document.write(s);
        return false;

       },
       CLASS_NAME: 'mbControl.Save'
  });
  return Control;
  }

}


