/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: MapScaleText.js 2782 2007-05-10 22:58:21Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to display the scale of a map.  The model of this widget
 * must have an extent object associated with it which is the case when the 
 * model has a MapContanier widget.
 *
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  This widget's object node from the configuration document.
 * @param model       The model that this widget is a view of.
 */

function MapScaleText(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  /**
   * Handles submission of the form (via javascript in an <a> tag or onsubmit handler)
   */
  this.submitForm = function() {
    var newScale = this.mapScaleTextForm.mapScale.value;
    this.model.map.zoomToScale(newScale.split(",").join(""));
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
    if (objRef.mapScaleTextForm) {
      var newScale = Math.round(objRef.model.map.getScale());
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
  }

  /**
   * adds a bbox listener on the model 
   */
  this.model.addListener("bbox", this.showScale, this);
  this.model.addListener("refresh", this.showScale, this);

  /**
   * Called just before paint to set the map scale as stylesheet param
   * @param objRef pointer to this object.
   */
  this.prePaint = function(objRef) {
    var mapScale = objRef.model.extent.getScale();
    this.stylesheet.setParameter("mapScale", mapScale );
  }

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

