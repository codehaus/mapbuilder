/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Functions to render and update a Legend from a Web Map Context.
 * @constructor
 * @base WidgetBaseXSL
 * @author Cameron Shorter cameronATshorter.net
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function LegendGraphic(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  this.model.addListener("hidden",this.refresh, this);
}

/**
 * Listener method to paint this widget
 * @param layerName  the name of the layer to highlight
 */
LegendGraphic.prototype.refresh = function(objRef, layerName) {
  objRef.paint(objRef, objRef.id);
}

