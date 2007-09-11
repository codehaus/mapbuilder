/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: OWSCatSearchForm.js 2076 2006-04-11 19:48:08Z madair $
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

function FormBase(widgetNode, model) {
  WidgetBaseXSL.apply(this, new Array(widgetNode, model));

  //get bbox inforamtion from a map model
  var webServiceUrl = widgetNode.selectSingleNode("mb:webServiceUrl");
  if ( webServiceUrl ) {
    this.webServiceUrl = webServiceUrl.firstChild.nodeValue;
  }

  /**
   * Refreshes the form onblur handlers when this widget is painted.
   * @param objRef Pointer to this CurorTrack object.
   */
  this.postPaint = function(objRef) {
    var searchForm = document.getElementById(objRef.formName);
    searchForm.parentWidget = objRef;
    searchForm.onkeypress = objRef.handleKeyPress;
    searchForm.onsubmit = objRef.submitForm;
  }

  //set some properties for the form output
  this.formName = "WebServiceForm_" + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);

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
      return true;
    }
  }

  /**
   *
   * @param
   */
  this.setValue = function(xpath, value) {
    this.model.setXpathValue(this.model,xpath,value,false);
  }
}
