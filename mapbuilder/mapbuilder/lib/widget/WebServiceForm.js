/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to display a form for input of parameters to generate a web service 
 * request.  This JS object handles the form submit via HTTP Get by appending 
 * a query string to the form's action URL.  The query string is created from
 * all input elements and their values.
 * The target model is then loaded from the URL created.
 * A stylehseet must be specified as a property in config for this widget.  
 * See widget/NtsForm.xsl for an example. 
 *
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function WebServiceForm(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));
  this.formElements = new Object();

  /**
   * Handles submission of the form (via javascript in an <a> tag)
   */
  this.submitForm = function() {
    this.webServiceForm = document.getElementById(this.formName);

    //create the http GET URL
    //TBD: handle POST submission
    //TBD: create filter request
    var webServiceUrl = this.webServiceForm.action + "?";
    for (var i=0; i<this.webServiceForm.elements.length; ++i) {
      var element = this.webServiceForm.elements[i];
      webServiceUrl += element.name + "=" + element.value + "&";
      this.formElements[element.name] = element.value;
    }
    if (this.debug) alert(webServiceUrl);

    var httpPayload = new Object();
    httpPayload.method = "get";
    httpPayload.url = webServiceUrl;
    this.targetModel.newRequest(this.targetModel,httpPayload);
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
      return false;
    }
  }

  /**
   * Refreshes the form onblur handlers when this widget is painted.
   * @param objRef Pointer to this object.
   */
  this.postPaint = function(objRef) {
    objRef.webServiceForm = document.getElementById(objRef.formName);
    objRef.webServiceForm.parentWidget = objRef;
    objRef.webServiceForm.onkeypress = objRef.handleKeyPress;
    //objRef.WebServiceForm.onsubmit = objRef.submitForm;
    //objRef.WebServiceForm.mapsheet.onblur = objRef.setMapsheet;
  }

  //set some properties for the form output
  this.formName = "WebServiceForm_" + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);

  /**
   * Sets value for form elements
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    for (var elementName in objRef.formElements) {
      objRef.stylesheet.setParameter(elementName, objRef.formElements[elementName]);
    }
  }


}

