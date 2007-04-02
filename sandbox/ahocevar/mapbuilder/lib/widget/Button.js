/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");

/**
 * Generic Button object.
 * @base ButtonBase
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param widgetNode      The tool node from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function Button(widgetNode, model) {

  /**
   * Creates the OpenLayers control for this button.
   * This method will be called by ButtonBase when
   * MapPaneOL is ready to have buttons added.
   * The control should be defined in this method.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} instance of the OL control.
   */
  this.createControl = function(objRef) {
  	//return new OpenLayers.Control();
  }
  
  ButtonBase.apply(this, new Array(widgetNode, model));
}


