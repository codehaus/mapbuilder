/*
Author:       Steven Ottens AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Back.js,v 1.2 2005/10/11 13:59:27 graphrisc Exp $
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
function Help(widgetNode, model) {
  ButtonBase.apply(this, new Array(widgetNode, model));

  /**
   * Replaces the current extent with the previous one in history
   * @param objRef      Pointer to this object.
   */
  this.doSelect = function(selected,objRef) {
    if (selected){
			window.open('help.html');
		}
  }
}


