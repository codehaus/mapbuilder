/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base Model class to be instantiated by all Model objects.
 * loads the XML document as the doc property of the model
 * event listeners.
 * @constructor
 * @base Listener
 * @author Cameron Shorter
 * @param model       Pointer to the model instance being created
 * @param modelNode   The model's XML object node from the configuration document.
 * @param parentModel The model object that this widget belongs to.
 */
function ModelBase(model, modelNode, parentModel) {
  // Inherit the Listener functions and parameters
  var listener = new Listener(model);

  model.modelNode = modelNode;
  var idAttr = modelNode.attributes.getNamedItem("id");
  if (idAttr) {
    model.id = idAttr.nodeValue;
  } else {
    //auto generated unique ID assigned to this model
    model.id = "MbModel_" + mbIds.getId();
  }

  //go no farther for template models
  var templateAttr = modelNode.attributes.getNamedItem("template");
  if (templateAttr) {
    model.template = templateAttr.nodeValue;
    return;
  }

  /**
   * Load a Model's document from a url.
   * @param modelRef Pointer to the model object being loaded.
   */
  this.loadModelDoc = function(modelRef){

    if (modelRef.url) {
      modelRef.callListeners( "newModel" );

      if (modelRef.postData) {
        //http POST
        modelRef.doc = postLoad(modelRef.url,modelRef.postData);
        if (modelRef.doc.parseError < 0){
          alert("error loading document: " + modelRef.url + " - " + Sarissa.getParseErrorText(modelRef.doc) );
        }
      } else {
        //http GET
        modelRef.doc = Sarissa.getDomDocument();
        modelRef.doc.async = false;
        modelRef.doc.validateOnParse=false;  //IE6 SP2 parsing bug
        var url=getProxyPlusUrl(modelRef.url);
        modelRef.doc.load(url);
        if (modelRef.doc.parseError < 0){
          alert("error loading document: " + modelRef.url + " - " + Sarissa.getParseErrorText(modelRef.doc) );
        }
      }
      // the following two lines are needed for IE; set the namespace for selection
      modelRef.doc.setProperty("SelectionLanguage", "XPath");
      if (modelRef.namespace) Sarissa.setXpathNamespaces(modelRef.doc, modelRef.namespace);

      //call the loadModel event
      modelRef.callListeners("loadModel");

    } else {
      //no URL means this is a template model
      //alert("url parameter required for loadModelDoc");
    }
  }
  model.loadModelDoc = this.loadModelDoc;

  /**
   * reload this model as an httpPayload listener
   * @param modelRef    Pointer to the model object being loaded.
   * @param httpPayload an object tho fully specify the request to be made
   */
  this.newRequest = function(modelRef, httpPayload){
    modelRef.url = httpPayload.url;
    modelRef.method = httpPayload.method;
    modelRef.postData = httpPayload.postData;
    modelRef.loadModelDoc(modelRef);
    //call the refresh event listeners, at this point all sub-models/widgets/tools are intialialized
    modelRef.callListeners("refresh");
  }
  model.newRequest = this.newRequest;
  model.addListener("httpPayload",model.newRequest, model);

  /**
   * Paint all the widgets and initialise any tools the widget may have.
   * @param objRef Pointer to this object.
   */
  this.loadModels = function() {
    //loop through all child models of this one
    var models = this.modelNode.selectNodes( "mb:models/*" );
    for (var i=0; i<models.length; i++ ) {
      var modelNode = models[i];

      //instantiate the Model object
      var modelType = modelNode.nodeName;
      var evalStr = "new " + modelType + "(modelNode,this);";
      var model = eval( evalStr );
      if ( model ) {
        this[model.id] = model;
        config[model.id] = model;
      } else { 
        alert("error creating model object:" + modelType);
      }
    }
  }
  model.loadModels = this.loadModels;

  /**
   * Paint all the widgets and initialise any tools the widget may have.
   * @param objRef Pointer to this object.
   */
  this.loadWidgets = function() {
    var widgets = this.modelNode.selectNodes("mb:widgets/*");
    for (var j=0; j<widgets.length; j++) {
      var widgetNode = widgets[j];
      var widgetId = widgetNode.attributes.getNamedItem("id")
      if (widgetId) widgetId = widgetId.nodeValue;
      
      //remove widget generated content first
      var widget = null;
      if (widgetId && this[widgetId]) {
        //remove any output from this widget
        widget = this[widgetId];
        var outputNode = document.getElementById( widget.mbWidgetId );
        if (outputNode) widget.node.removeChild( outputNode );
      }

      //call the widget constructor
      var evalStr = "new " + widgetNode.nodeName + "(widgetNode, this);";
      widget = eval( evalStr );
      if (widget) {
        //store a reference and load the tools
        this[widget.id] = widget;
        widget.loadTools();
      } else {
        alert("error creating widget:" + widgetNode.nodeName);
      }
    }
  }
  model.loadWidgets = this.loadWidgets;

  //load the Model object from the initial URL in config or from a URL param.
  //the URL can also be passed in as a URL parameter by using the model ID
  //as the parameter name (this method takes precendence over the config file
  if (window.cgiArgs[model.id]) {  
    model.url = window.cgiArgs[model.id];
  } else if (window[model.id]) {  
    model.url = window[model.id];
  } else if (modelNode.url) {  
    model.url = modelNode.url;
  } else {
    var defaultModel = modelNode.selectSingleNode("mb:defaultModelUrl");
    if (defaultModel) model.url = defaultModel.firstChild.nodeValue;
  }

  model.models = new ModelList(model);

  //don't load in models and widgets if this is the config doc, defer to config.init
  //don't load template models (URL is null)
  model.init = function(modelRef) {
    if (!modelRef.template) {
      modelRef.loadModels();
      modelRef.loadWidgets();
    }
  }
  model.refresh = function(modelRef) {
    modelRef.callListeners("refresh");
  }
  //
  if (parentModel) {
    model.parentModel = parentModel;
    parentModel[model.id] = model;
    parentModel.addListener("loadModel",model.loadModelDoc, model);
    parentModel.addListener("refresh",model.refresh, model);
    model.init(model);
  }

}
