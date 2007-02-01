/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: LayerProperty.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Parse DescribeFeatureType response.
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function LayerProperty(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));
}
