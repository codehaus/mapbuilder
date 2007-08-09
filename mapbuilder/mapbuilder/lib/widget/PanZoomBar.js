/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ZoomIn.js 2680 2007-04-07 21:04:16Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * PanZoomBar  - drag, zoom, zoomBar wheelMouse and keyboard events 
 * @constructor
 * @base WidgetBase
 * @author Olivier Terral olivier.terralAtgeomatys.fr
 * @param widgetNode The widget node from the Config XML file.
 * @param model The model for this widget
 */
function PanZoomBar(widgetNode, model) {
  // Extend ButtonBase
  WidgetBase.apply(this, new Array(widgetNode, model));

  this.cursor = 'crosshair';

  this.init = function(objRef) {
   objRef.model.map.addControl(new OpenLayers.Control.PanZoomBar());
   objRef.model.map.addControl(new OpenLayers.Control.MouseDefaults());
   objRef.model.map.addControl(new OpenLayers.Control.KeyboardDefaults());
  }
  
  this.model.addListener("refresh",this.init, this); 
}

