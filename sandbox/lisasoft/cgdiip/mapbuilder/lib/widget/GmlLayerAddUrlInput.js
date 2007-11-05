/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: ModelUrlInput.js 3091 2007-08-09 12:21:54Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to display the a form to input any model's URL and load the new URL 
 * as the model's document
 *
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  This widget's object node from the configuration document.
 * @param model       The model that this widget is a view of.
 */

function GmlLayerAddUrlInput(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  //a default value to be used in the form
  var defaultUrl = widgetNode.selectSingleNode("mb:defaultUrl");
  if (defaultUrl) {
    this.defaultUrl = defaultUrl.firstChild.nodeValue;
  }

  /**
   * Handles submission of the form (via javascript in an <a> tag)
   */
  this.submitForm = function() {
    gmlUrl = this.urlInputForm.defaultUrl.value;

   var xmlContextlayerString = "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"no\"?>" +
   "<FeatureType id=\"" + gmlUrl + "\" hidden=\"1\" xmlns=\"http://www.opengis.net/context\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" >"+
   "<Server service=\"OGC:GML\" version=\"3.0.0\" title=\"Local\">" +
   "<OnlineResource method=\"GET\" xlink:type=\"simple\" xlink:href=\"" + gmlUrl +"\"/>" +
   "</Server>" +
   "<Name>" + gmlUrl + "</Name>" +
   "<Title>New GML Layer</Title>" +
   "<Abstract></Abstract>" +
   "<SRS>EPSG:4326</SRS>" +
   "</FeatureType>";
    
	var oDomDoc = Sarissa.getDomDocument();  
	var xmlString = "rootmy xml!/root";  
	oDomDoc = (new DOMParser()).parseFromString(xmlContextlayerString, "text/xml"); 
    
    this.targetModel.callListeners("addLayer",oDomDoc);
  }

  /**
   * handles keypress events to filter out everything except "enter".  
   * Pressing the "enter" key will trigger a form submit
   * @param event  the event object passed in for Mozilla; IE uses window.event
   */
  this.handleKeyPress = function(event) {
    var keycode;
    var target;
    if (event){
      //Mozilla
      keycode=event.which;
      target=event.currentTarget;
    }else{
      //IE
      keycode=window.event.keyCode;
      target=window.event.srcElement.form;
    }

    if (keycode == 13) {    //enter key
      target.parentWidget.submitForm();
    return false;   //prevent the form from actually being submitted
    }
  }

  /**
   * initializes stylesheet parameters for the form
   * @param objRef Pointer to this widget object.
   */
  this.prePaint = function(objRef) {
    objRef.stylesheet.setParameter("modelTitle", "URL:");
    if (!objRef.defaultUrl) objRef.defaultUrl = objRef.targetModel.url;
    objRef.stylesheet.setParameter("defaultUrl", objRef.defaultUrl);
  }

  /**
   * Refreshes the form and event handlers when this widget is painted.
   * @param objRef Pointer to this CurorTrack object.
   */
  this.postPaint = function(objRef) {
    objRef.urlInputForm = document.getElementById(objRef.formName);
    objRef.urlInputForm.parentWidget = objRef;
    objRef.urlInputForm.onkeypress = objRef.handleKeyPress;
    //objRef.WebServiceForm.onsubmit = objRef.submitForm;
    //objRef.WebServiceForm.mapsheet.onblur = objRef.setMapsheet;
  }

  //set some properties for the form output
  this.formName = "urlInputForm_" + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);
}

