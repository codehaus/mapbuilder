/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to display a list of web services from a registry.
 * TBD: not compelted yet.
 *
 * @constructor
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function ServiceRegistryList(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

  /**
   * Handles submission of the form (via javascript in an <a> tag)
   */
  this.submitForm = function() {
    alert("submitForm");

    //create the http GET URL
    //TBD: handle POST submission
    //TBD: create filter request
    var webServiceUrl = this.webServiceForm.action + "?";
    for (var i=0; i<this.webServiceForm.elements.length; ++i) {
      var element = this.webServiceForm.elements[i];
      webServiceUrl += element.name + "=" + element.value + "&";
    }
    alert(webServiceUrl);
    config.loadModel( this.targetModel.id, webServiceUrl);
  }

  /**
   * Refreshes the form onblur handlers when this widget is painted.
   * @param objRef Pointer to this CurorTrack object.
   */
  this.postPaint = function(objRef) {
    objRef.webServiceForm = document.getElementById(objRef.formName);
    //objRef.WebServiceForm.onsubmit = objRef.submitForm;
    //objRef.WebServiceForm.mapsheet.onblur = objRef.setMapsheet;
  }

  //set some properties for the form output
  this.formName = "WebServiceForm_";// + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);
}

