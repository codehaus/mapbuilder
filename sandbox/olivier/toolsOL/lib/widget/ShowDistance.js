/*
Author: imke doerge AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ShowDistance.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to display the measured distance when it measurement is enabled.
 *
 * @constructor
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function ShowDistance(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));
   
	// outputs the totalDistance value to the form element
	this.showDistance = function(objRef) {
		objRef.distForm = document.getElementById(objRef.formName);   
		var totalDistance = objRef.model.values.showDistance;
		if (totalDistance > 1000.000) { // >1000m = 1.000km
      if (totalDistance > 1000000.000) outputDistance = Math.round(totalDistance/1000)+"  km"; // >1000km
      else outputDistance = Math.round(totalDistance/100)/10+"  km";
    }
    else { outputDistance = Math.round(totalDistance)+"  m"; }
    objRef.distForm.distance.value = outputDistance;
	}

	//add a showDistance Listener to the modal
	this.model.addListener("showDistance", this.showDistance, this);

  //set some properties for the form output
	this.formName = "ShowDistance_" + mbIds.getId();
	this.stylesheet.setParameter("formName", this.formName);  
}    