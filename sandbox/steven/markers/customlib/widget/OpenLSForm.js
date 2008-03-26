/*
Description: Display a form for OpenLS geocoding request
Author:      Steven Ottens AT geodan.nl
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: OpenLSForm.js 3879 2008-02-27 14:20:29Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to display the OpenLS request form
 *
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function OpenLSForm(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  this.defaultModelUrl=this.getProperty("mb:defaultModelUrl");
  this.geocodeServerUrl=this.getProperty("mb:geocodeServerUrl");

  this.xsl=new XslProcessor(baseDir+"/tool/xsl/ols_GeocodeRequest.xsl");	
  /**
  * handles the submission of the form
  */
  this.submitForm = function(objRef) {
    //Parse the form
    var geoForm = document.getElementById(this.formName);
    pc = geoForm.pcValue.value;
  if(pc=="Postcode")pc=null;
    street = geoForm.streetValue.value;
  if(street=="Straat")street=null;
    number = geoForm.numberValue.value;
  if(number=="Nummer")number=null;
    city = geoForm.cityValue.value;
  if(city=="Plaats")city=null;
    municipality = geoForm.municipalityValue.value;
  if(municipality=="Gemeente")municipality=null;
    country =geoForm.countryValue.value;
    
    //fill the form output into the xsl
    if(pc) objRef.xsl.setParameter("postalCode", pc);
    if(street) objRef.xsl.setParameter("street", street);
    if(number) objRef.xsl.setParameter("number", number);
    if(city) objRef.xsl.setParameter("municipalitySubdivision", city);
    if(municipality) objRef.xsl.setParameter("municipality", municipality);
    if(country) objRef.xsl.setParameter("countryCode", country);
    if(!country) {
      alert(mbGetMessage("noCountryCode"));
      return;
    }
    //no values entered, bail out
    if(!municipality && !city && !number && !street && !pc) {
      alert(mbGetMessage("atLeastOneValue"));
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
  this.formName = this.getProperty("mb:formName", "OpenLSForm_" + mbIds.getId());
  this.stylesheet.setParameter("formName", this.formName);
}

