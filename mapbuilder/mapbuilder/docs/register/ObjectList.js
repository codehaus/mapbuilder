/*
Author:       Tom Kralidis
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to display predefined locations (as per schema at lib/model/schemas/locations.xsd)
 * into a HTML select box. Changing a location will set the AOI of the targetModel.
 * TBD: projection coordinate conversion still to be implemented.
 * @constructor
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */


function ObjectList(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

/**
 * Change the AOI coordinates from select box choice of prefined locations
 * @param bbox the bbox value of the location keyword chosen
 * @param targetModel the model on which to set the AOI
 */
  this.showDetails = function(objectType) {
    var details = config.objects.objectDetails;
    details.stylesheet.setParameter("objectType",objectType);
    details.paint(details);
  }
}
