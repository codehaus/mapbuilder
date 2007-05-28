/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: DragPan.js 2680 2007-04-07 21:04:16Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, dragging in the map moves the map extent.
 * @constructor
 * @base ButtonBase
 * @author Andreas HocevarATgmail.com
 * @param widgetNode The widget node from the Config XML file.
 * @param model The model for this widget
 */
function DragPan(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
  
  this.createControl = function(objRef) {
  	return OpenLayers.Control.DragPan;
  }
  
  this.cursor = 'move'; 
}

