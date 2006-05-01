/*
Description: Display the OpenLS Geocoder response as html
Author:      Steven Ottens AT geodan.nl
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: OpenLSResponse.js,v 1.0 2004/06/25 17:59:38 steven Exp $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Render the response froma Geocoding request
 * @constructor
 * @base WidgetBaseXSL
 * @author Steven Ottens AT geodan nl
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function OpenLSResponse(widgetNode, model) {
  WidgetBaseXSL.apply(this, new Array(widgetNode, model));
}
