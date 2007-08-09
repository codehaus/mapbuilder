/*
Author:       Tom Kralidis
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */
function ObjectList(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  this.showDetails = function(objectType) {
    var details = config.objects.objectDetails;
    details.stylesheet.setParameter("objectType",objectType);
    details.paint(details);
  }
}
