/*
Author:       Cameron Shorter
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Render the response from a WFS request.
 * @constructor
 * @base WidgetBaseXSL
 * @author Cameron Shorter
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function TransactionResponse(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));
}
