/*
Author:       Steven M. Ottens
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: ExampleList.js 1671 2005-09-20 02:37:54Z madair1 $
*/
// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Render a list of the examples
 * @constructor
 * @base WidgetBaseXSL
 * @author Steven M. Ottens
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function ExampleList(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));
}
