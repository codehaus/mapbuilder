/*
Author:       Cameron Shorter cameronAtshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * A widget to display a list of context docs to pick from.  This is a view of 
 * a Context Collection as specified in the OGC Context specification.
 * @constructor
 * @base WidgetBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */

function CollectionList(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

}
