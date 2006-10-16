/*
Description: Display a form for OpenLS geocoding request
Author:      Steven Ottens AT geodan.nl
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: GeocoderRequest.js,v 1.0 2004/06/25 17:59:38 steven Exp $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to display the OpenLS request form
 *
 * @constructor
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function OpenLSForm(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

	this.defaultModelUrl=widgetNode.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;
	this.geocodeServerUrl=widgetNode.selectSingleNode("mb:geocodeServerUrl").firstChild.nodeValue;

  this.xsl=new XslProcessor(baseDir+"/tool/xsl/ols_GeocodeRequest.xsl");	
	/**
	* handles the submission of the form
	*/
	this.submitForm = function(objRef) {
		//Parse the form
		objRef.geoForm = document.getElementById(this.formName);
    pc = objRef.geoForm.pcValue.value;
    street = objRef.geoForm.streetValue.value;
    number = objRef.geoForm.numberValue.value;
    city = objRef.geoForm.cityValue.value;
    municipality = objRef.geoForm.municipalityValue.value;
    country = objRef.geoForm.countryValue.value;
		
		//fill the form output into the xsl
		if(pc) objRef.xsl.setParameter("postalCode", pc);
    if(street) objRef.xsl.setParameter("street", street);
    if(number) objRef.xsl.setParameter("number", number);
    if(city) objRef.xsl.setParameter("municipalitySubdivision", city);
    if(municipality) objRef.xsl.setParameter("municipality", municipality);
    if(country) objRef.xsl.setParameter("countryCode", country);
    if(!country) {
      alert('You need to specify a country code');
      return;
    }
		//no values entered, bail out
		if(!municipality && !city && !number && !street && !pc) {
			alert("Please enter at least one value, before proceeding");
			return;
		}
		
		//do the actual request
    objRef.requestModel = objRef.xsl.transformNodeToObject(this.model.doc);
    objRef.httpPayload = new Object();
    objRef.httpPayload.url = objRef.geocodeServerUrl;
    objRef.httpPayload.method="post";
    objRef.httpPayload.postData=objRef.requestModel;
    objRef.targetModel.newRequest(objRef.targetModel,objRef.httpPayload);  
  }

  //set some properties for the form output
  //allow it to have a different form name
  var formNameNode = widgetNode.selectSingleNode("mb:formName");
  if ( formNameNode ) {
    this.formName = formNameNode.firstChild.nodeValue;
  } else {
    this.formName = "OpenLSForm_" + mbIds.getId();
  }
  this.stylesheet.setParameter("formName", this.formName);
}

