/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: SelectFeatureType.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Presents the list of FeatureTypes from a WFS capabilities doc.
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function SelectFeatureType(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));
}
