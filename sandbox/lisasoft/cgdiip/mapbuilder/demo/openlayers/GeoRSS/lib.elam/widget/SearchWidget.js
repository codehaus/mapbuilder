/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: SearchWidget.js 3091 2007-08-09 12:21:54Z gjvoosten $
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

function SearchWidget(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));
 
  this.host = widgetNode.selectSingleNode("mb:host").firstChild.nodeValue; 
 
  /**
    * fake a submit Form
    */
  this.submitQuery = function( query ) {
    this.urlInputForm.defaultUrl.value = query;
    //this.submitForm();
    
    var httpPayload = new Object();
    
    httpPayload.url = this.host + "?query=" + query; 
    httpPayload.method  = this.targetModel.method;
  
    //alert(httpPayload.method+":"+httpPayload.url);
    var newUrl = this.urlInputForm.defaultUrl.value;
    if( newUrl.indexOf("?") > 0 ) {
      this.stylesheet.setParameter("defaultUrl", this.urlInputForm.defaultUrl.value);
    }
    
    this.targetModel.newRequest(this.targetModel,httpPayload);
  }
  
  /**
   * Handles submission of the form (via javascript in an <a> tag)
   */
  this.submitForm = function() {
  
    if( this.aoiFormId == undefined ) {
      // let's try to find the aoiForm
      // we need to clear all the div's first
      var forms = document.getElementsByTagName("form");
      var num = forms.length;
      
      for (var i= num-1; i>= 0; i--) {
	    var aoiFormId = new String(forms[i].getAttribute("id"));
	    //alert( "Found:"+aoiFormId+ " "+i+" of "+num );
        if( aoiFormId.indexOf("AoiForm_") >= 0 ) {
    	    this.aoiFormId = aoiFormId;
    	    //alert ("found aoiform:"+this.aoiFormId );
    	  }
      }
    }
  
    if( this.aoiFormId == undefined ) {
      alert(mbGetMessage("aoiFormNotFound"));
    }
    
    var bbox = "";
    var aoiForm = document.getElementById( this.aoiFormId );
    
    // make sure we have a bbox
    if( (aoiForm != null ) && (aoiForm.westCoord.value != "")) {
      var west	= parseFloat(aoiForm.westCoord.value);
	    var north	= parseFloat(aoiForm.northCoord.value);
	    var east	= parseFloat(aoiForm.eastCoord.value);
	    var south	= parseFloat(aoiForm.southCoord.value);
    
	    bbox = "&ULLon="+west.toPrecision(3)+"&ULLat="+north.toPrecision(3)+
	      "&LRLon="+east.toPrecision(3)+"&LRLat="+south.toPrecision(3);
    }
		
    var httpPayload = new Object();
    //httpPayload.url = this.host + "/voogle/maps?query="
    //+ escape(this.urlInputForm.defaultUrl.value)  + bbox; // + "&hitsPerPage=12";
    
    var query=this.urlInputForm.defaultUrl.value;
      
    // we need to escape user queries
    httpPayload.url     = this.host + "?query=" + escape(query) + bbox; 
    httpPayload.method  = this.targetModel.method;
	
    //alert(httpPayload.method+":"+httpPayload.url);
    this.stylesheet.setParameter("defaultUrl", query);
    
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
      return false;   //prevent the form from actually being submitted
    }
  }

  /**
   * initializes stylesheet parameters for the form
   * @param objRef Pointer to this widget object.
   */
  this.prePaint = function(objRef) {
    objRef.stylesheet.setParameter("modelTitle", objRef.targetModel.title);
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

