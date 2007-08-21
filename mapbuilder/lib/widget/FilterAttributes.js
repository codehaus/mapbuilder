/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Parses a WFS DescribeFeatureType response to and provides a form to specify
 * filter parameters.
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function FilterAttributes(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));
}
