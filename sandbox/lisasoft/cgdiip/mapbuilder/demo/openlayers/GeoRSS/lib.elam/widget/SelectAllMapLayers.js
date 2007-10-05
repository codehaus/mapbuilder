/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: SelectAllMapLayers.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Link to load the WMS Capabilities doc as a context document.
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function SelectAllMapLayers(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));
}
