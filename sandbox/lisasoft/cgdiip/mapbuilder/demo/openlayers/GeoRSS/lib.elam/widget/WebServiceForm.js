/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: WebServiceForm.js 2998 2007-07-23 10:44:47Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
//mapbuilder.loadScript(baseDir+"/util/dojo/src/uuid/TimeBasedGenerator.js");

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
  // We might have a request stylesheet to fill for a more complex post
  var requestStylesheet = widgetNode.selectSingleNode("mb:requestStylesheet");
  if (requestStylesheet) {
    this.requestStylesheet = new XslProcessor(requestStylesheet.firstChild.nodeValue,model.namespace); 
  }
  
  var webServiceUrl = widgetNode.selectSingleNode("mb:webServiceUrl");
  if (webServiceUrl) {
    this.webServiceUrl = webServiceUrl.firstChild.nodeValue; 
  }
  
  /**
   * Handles submission of the form (via javascript in an <a> tag)
   */
  this.submitForm = function() {
    this.webServiceForm = document.getElementById(this.formName);
    if( this.webServiceForm == null ) { 
      // get it from a user div instead if present
      this.webServiceForm = document.getElementById("webServiceForm_form");
    }
    
    if( this.webServiceForm == null ) {
        
      return;
    }
    
    var httpPayload = new Object();
    httpPayload.method = this.targetModel.method;
    httpPayload.url = this.webServiceUrl;
    
    if (httpPayload.method.toLowerCase() == "get") {
      httpPayload.url = this.webServiceForm.action + "?";
      for (var i=0; i<this.webServiceForm.elements.length; ++i) {
        var element = this.webServiceForm.elements[i];
        webServiceUrl += element.name + "=" + element.value + "&";
        this.formElements[element.name] = element.value;
      }  
      
      mbDebugMessage(this, httpPayload.url);
    
      this.targetModel.newRequest(this.targetModel,httpPayload);
    
    } else { 
        // a post
        // put parameters we got in request stylesheet
      for (var i=0; i<this.webServiceForm.elements.length; ++i) {
        var element = this.webServiceForm.elements[i];
        this.formElements[element.name] = element.value;
      }  
      
      this.requestStylesheet.setParameter("resourceName", this.formElements["feature"])
      this.requestStylesheet.setParameter("fromDateField", this.formElements["fromDateField"])
      this.requestStylesheet.setParameter("toDateField", this.formElements["toDateField"])
  
      // @TODO
      // we need a new uuid if we wnat to uniquely identify new layers  
      // var uuid = dojo_uuid_TimeBasedGenerator.generate();
       
      var layer = this.requestStylesheet.transformNodeToObject(this.model.doc); 
      //layer.childNodes[0].setAttribute("id", uuid)
      if (this.debug) mbDebugMessage(this, "Transformed: "+ (new XMLSerializer()).serializeToString(layer));
           
      // extract the GetFeature out
      this.namespace = "xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
      
      Sarissa.setXpathNamespaces(layer, this.namespace);
      var getFeature = layer.selectSingleNode("//wfs:GetFeature")
      
      httpPayload.postData = (new XMLSerializer()).serializeToString( getFeature);
      
      mbDebugMessage(this, "httpPayload.postData:"+ httpPayload.postData);
      
      this.targetModel.wfsFeature = layer.childNodes[0];
      if (this.debug) mbDebugMessage(this, "wfsFeature = "+ (new XMLSerializer()).serializeToString(this.targetModel.wfsFeature));
        
      this.targetModel.newRequest(this.targetModel,httpPayload);
    }
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
    if( this.webServiceForm == null ) { 
      // get it from a user div instead if present
      this.webServiceForm = document.getElementById("webServiceForm_form");
    }
    
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

  /**
    * Setup the listener for AOI changes to be used in filter if necessary
    */
  this.setAoiParameters = function(objRef,bbox) {
    if (objRef.model) {
      var featureSRS = null;
      var containerSRS = objRef.model.getSRS();
     
      objRef.requestStylesheet.setParameter("bBoxMinX", bbox[0][0] );
      objRef.requestStylesheet.setParameter("bBoxMinY", bbox[1][1] );
      objRef.requestStylesheet.setParameter("bBoxMaxX", bbox[1][0] );
      objRef.requestStylesheet.setParameter("bBoxMaxY", bbox[0][1] );
      objRef.requestStylesheet.setParameter("srs", containerSRS );
      objRef.requestStylesheet.setParameter("width", objRef.model.getWindowWidth() );
      objRef.requestStylesheet.setParameter("height", objRef.model.getWindowHeight() );
    }
  }

  this.init = function(objRef) {
    if (objRef.model) {
      objRef.model.addListener("aoi", objRef.setAoiParameters, objRef);
      //TBD: another one for bbox
    }
  }
  
  this.model.addListener("init", this.init, this);

}

