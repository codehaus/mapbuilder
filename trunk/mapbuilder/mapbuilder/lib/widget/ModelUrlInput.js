/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to display the a form to input any model's URL and load the new URL 
 * as the model's document
 *
 * @constructor
 *
 * @param widgetNode  This widget's object node from the configuration document.
 * @param model       The model that this widget is a view of.
 */

function ModelUrlInput(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

  /**
   * Handles submission of the form (via javascript in an <a> tag)
   */
  this.submitForm = function() {
    var httpPayload = new Object();
    httpPayload.url = this.urlInputForm.modelUrl.value;
    var httpMethod = this.urlInputForm.httpMethod;
    for (var i=0; i<httpMethod.length; ++i) {   //loop through radio buttons
      if (httpMethod[i].checked) {
        httpPayload.method = httpMethod[i].value;
        if (httpPayload.method.toLowerCase() == "post") {
          httpPayload.postData = null; //TBD get this from somewhere? or not allow post?
          if (this.debug) alert("postData:"+httpPayload.postData.xml);
        } else {
          httpPayload.postData = null;
        }
        break;
      }
    }
    
    this.model.setParam("httpPayload", httpPayload);
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
    }
  }

  /**
   * initializes the widget values in the form
   * @param objRef Pointer to this widget object.
   */
  this.init = function(objRef) {
    objRef.stylesheet.setParameter("modelUrl", objRef.model.url);
  }
  this.model.addListener('newModel', this.init, this);

  /**
   * Refreshes the form and event handlers when this widget is painted.
   * @param objRef Pointer to this CurorTrack object.
   */
  this.paintHandler = function(objRef) {
    objRef.urlInputForm = document.getElementById(objRef.formName);
    objRef.urlInputForm.parentWidget = objRef;
    objRef.urlInputForm.onkeypress = objRef.handleKeyPress;
    //objRef.WebServiceForm.onsubmit = objRef.submitForm;
    //objRef.WebServiceForm.mapsheet.onblur = objRef.setMapsheet;
  }
  this.addListener('paint', this.paintHandler, this);

  //set some properties for the form output
  this.formName = "urlInputForm_";// + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);
}

