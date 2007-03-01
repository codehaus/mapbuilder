/*
Author:       Steven Ottens AT geodan.nl
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: GeocoderForm.js,v 1.0 2005/09/20 02:37:54 madair1 Exp $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");


/**
 * Widget to display the geocoder form
 *
 * @constructor
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function GeocoderForm(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

	this.pm=widgetNode.selectSingleNode("mb:puntModel").firstChild.nodeValue;
	this.defaultModelUrl=widgetNode.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;

  this.xsl=new XslProcessor(baseDir+"/../customlib/tool/xsl/ols_request.xsl");
	
	this.init=function(objRef){
		if(!objRef.puntModel){
			objRef.puntModel=window.config.objects[objRef.pm];
		}
		
	}
	this.model.addListener("init",this.init, this);
	
	this.submitForm = function(objRef) {
 if(!objRef.puntModel.doc){
			objRef.puntModel.url=objRef.defaultModelUrl;
			// load default GML
      var httpPayload=new Object();
      httpPayload.url=objRef.defaultModelUrl;
      httpPayload.method="get";
      httpPayload.postData=null;
			objRef.puntModel.newRequest(objRef.puntModel,httpPayload);
		}
		objRef.xsl=new XslProcessor(baseDir+"/../customlib/tool/xsl/ols_request.xsl");
    objRef.geoForm = document.getElementById(this.formName);
    postcode = objRef.geoForm.postcode.value;
    straat = objRef.geoForm.straat.value;
    nummer = objRef.geoForm.nummer.value;
    plaats = objRef.geoForm.plaats.value;
    gemeente = objRef.geoForm.gemeente.value;
		if(objRef.geoForm.geocoderzoom.checked) objRef.targetModel.zoom = "goed";
		else objRef.targetModel.zoom = "fout";
		if(objRef.geoForm.geocodermark.checked) objRef.targetModel.point = "goed";
		else objRef.targetModel.point = "fout";
		objRef.targetModel.setParam("pointZoom", objRef);
		if(postcode) objRef.xsl.setParameter("postalCode", postcode);
    if(straat) objRef.xsl.setParameter("street", straat);
    if(nummer) objRef.xsl.setParameter("number", nummer);
    if(plaats) objRef.xsl.setParameter("municipalitySubdivision", plaats);
    if(gemeente) objRef.xsl.setParameter("municipality", gemeente);
		if(!gemeente && !plaats && !nummer && !straat && !postcode) {
			alert("Gaarne een of meerdere velden invullen alvorens op zoek te klikken");
						return;
			}
    objRef.requestModel = objRef.xsl.transformNodeToObject(this.model.doc);
    url = "http://geoserver.nl/geocoder/NLaddress.aspx";
    objRef.httpPayload = new Object();
    objRef.httpPayload.url = url;
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
    this.formName = "GeocoderForm_" + mbIds.getId();
  }
  this.stylesheet.setParameter("formName", this.formName);
}

