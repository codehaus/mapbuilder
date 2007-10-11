/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Abstract.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Output the context title and abstract.
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function Abstract(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));
}