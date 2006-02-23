/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Parses a WFS DescribeFeatureType response to and provides a form to specify
 * filter parameters.   TBD: not yet completed.
 * This generic widget requires the config file to specify a <stylesheet>.
 * @constructor
 * @base WidgetBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function xxFilterAttributes(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);


}
