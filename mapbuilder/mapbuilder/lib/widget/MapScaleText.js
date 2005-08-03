/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to display the scale of a map.  The model of this widget
 * must have an extent object associated with it which is the case when the 
 * model has a MapContanier widget.
 *
 * @constructor
 * @base WidgetBase
 * @param widgetNode  This widget's object node from the configuration document.
 * @param model       The model that this widget is a view of.
 */

function MapScaleText(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

  /**
   * Handles submission of the form (via javascript in an <a> tag or onsubmit handler)
   */
  this.submitForm = function() {
    var newScale = this.mapScaleTextForm.mapScale.value;
    this.model.extent.setScale(newScale.split(",").join(""));
    return false;   //prevent the form from actually being submitted
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
      return false
    }
  }

  /**
   * outputs the scale value to the form element
   * @param objRef Pointer to this widget object.
   */
  this.showScale = function(objRef) {
    var newScale = Math.round(objRef.model.extent.getScale());
    var parts = new Array();
    while (newScale>=1000.0) {
      var newPart = newScale/1000.0;
      newScale = Math.floor(newPart);
      var strPart = leadingZeros(Math.round((newPart-newScale)*1000).toString(),3);
      parts.unshift(strPart);
    }
    parts.unshift(newScale);
    objRef.mapScaleTextForm.mapScale.value = parts.join(",");
  }

  /**
   * adds a bbox listener on the model 
   */
  this.model.addListener("bbox", this.showScale, this);
  this.model.addListener("refresh", this.showScale, this);

  /**
   * Refreshes the form and event handlers when this widget is painted.
   * @param objRef Pointer to this CurorTrack object.
   */
  this.postPaint = function(objRef) {
    objRef.mapScaleTextForm = document.getElementById(objRef.formName);
    objRef.mapScaleTextForm.parentWidget = objRef;
    objRef.mapScaleTextForm.onkeypress = objRef.handleKeyPress;
    objRef.showScale(objRef);
  }

  //set some properties for the form output
  this.formName = "MapScaleText_" + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);
}

