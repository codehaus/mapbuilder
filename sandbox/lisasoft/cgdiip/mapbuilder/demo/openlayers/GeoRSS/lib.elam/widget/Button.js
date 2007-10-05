/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Button.js 3052 2007-08-01 21:25:21Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * Generic Button object. Set the <action> property in config for
 * the controller method to be called when selected
 * @base ButtonBase
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param widgetNode      The tool node from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function Button(widgetNode, model) {
  ButtonBase.apply(this, new Array(widgetNode, model));

  /**
   * default css cursor to use when the button is selected
   */
  this.cursor = 'default';

  /**
   * Creates the OpenLayers control for this button.
   * This method will be called by ButtonBase when
   * MapPaneOL is ready to have buttons added.
   * The control should be defined in this method.
   * @type function
   * @param objRef reference to this object.
   * @return class (not instance!) of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.'+objRef.id,
      type: (objRef.buttonType == 'RadioButton') ? OpenLayers.Control.TYPE_TOOL : OpenLayers.Control.TYPE_BUTTON,
      // for button type      
      trigger: function() {
        eval('config.objects.'+objRef.action);
      },
      // for tool type (RadioButton)
      activate: function() {
        eval('config.objects.'+objRef.action);
        this.active = true;
        return true;
      }
    });
    return Control;
  }
  
  /**
   * Optional method to instantiate the control. If a
   * subclass provides this method, it will be used instead
   * of just callint new Control() in the superclass.
   * This is needed when a control has to be instantiated
   * with parameters.
   * @type OpenLayers.Control
   * @param objRef reference to this object.
   * @param {OpenLayers.Control} Control to instantiate
   * @return instance of the OL control
   */
  this.instantiateControl = function(objRef, Control) {
    // return OpenLayers.Control instance
    return new Control();
    
  }
}


