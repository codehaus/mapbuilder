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
 * @param parentModel The model object that this model belongs to.
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

  //get the human readable title for the model
  var titleNode = modelNode.selectSingleNode("mb:title");
  if (titleNode) {
    model.title = titleNode.firstChild.nodeValue;
  } else {
    model.title = model.id;
  }

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

  //set the method property
  var method = modelNode.selectSingleNode("mb:method");
  if (method) {
    model.method = method.firstChild.nodeValue;
  } else {
    model.method = "get";
  }

  //set the namespace property
  var namespace = modelNode.selectSingleNode("mb:namespace");
  if (namespace) {
    model.namespace = namespace.firstChild.nodeValue;
  }

  //don't load in models and widgets if this is the config doc, defer to config.init
  if (parentModel) {
    model.parentModel = parentModel;
    parentModel[model.id] = model;
  }

  //go no farther for template models
  var templateAttr = modelNode.attributes.getNamedItem("template");
  if (templateAttr) {
    model.template = (templateAttr.nodeValue=="true")?true:false;
    model.modelNode.removeAttribute("template");
    //return;
  }

  /**
   * Get the value of a node.
   * @param objRef Reference to this node.
   * @param xpath Xpath of the node to update.
   * @return value of the node or null if Xpath does not find a node.
   */
  this.getXpathValue=function(objRef,xpath){
    node=objRef.doc.selectSingleNode(xpath);
    if(node && node.firstChild){
      return node.firstChild.nodeValue;
    }else{
      return null;
    }
  }
  model.getXpathValue=this.getXpathValue;

  /**
   * Update the value of a node within this model's XML.
   * Triggers a refresh event from the model.
   * @param objRef Reference to this node.
   * @param xpath Xpath of the node to update.
   * @param value Node's new value.
   * @return Returns false if Xpath does not find a node.
   */
  this.setXpathValue=function(objRef,xpath,value){
    node=objRef.doc.selectSingleNode(xpath);
    if(node){
      if(node.firstChild){
        node.firstChild.nodeValue=value;
      }else{
        dom=Sarissa.getDomDocument();
        v=dom.createTextNode(value);
        node.appendChild(v);
      }
      objRef.setParam("refresh");
      return true;
    }else{
      return false;
    }
  }
  model.setXpathValue=this.setXpathValue;

  /**
   * Load a Model's document from a url.
   * @param modelRef Pointer to the model object being loaded.
   */
  this.loadModelDoc = function(modelRef){

    if (modelRef.url) {
      modelRef.callListeners( "newModel" );

      if (modelRef.contentType == "image") {
        modelRef.doc = new Image();
        modelRef.doc.src = modelRef.url;
      } else {
        if (modelRef.postData) {
          //http POST
          modelRef.doc = postLoad(modelRef.url,modelRef.postData);
        } else {
          //http GET
          modelRef.doc = Sarissa.getDomDocument();
          modelRef.doc.async = false;
          modelRef.doc.validateOnParse=false;  //IE6 SP2 parsing bug
          var url=getProxyPlusUrl(modelRef.url);
          modelRef.doc.load(url);
        }

        if (modelRef.doc.parseError < 0){
          var message = "error loading document: " + modelRef.url;
          if (modelRef.doc.documentElement) message += " - " +Sarissa.getParseErrorText(modelRef.doc);
          alert(message);
          return;
        }

        // the following two lines are needed for IE; set the namespace for selection
        modelRef.doc.setProperty("SelectionLanguage", "XPath");
        if (modelRef.namespace) Sarissa.setXpathNamespaces(modelRef.doc, modelRef.namespace);
      }

      //call the loadModel event
      modelRef.callListeners("loadModel");

    } else {
      //no URL means this is a template model
      //alert("url parameter required for loadModelDoc");
    }
  }
  model.loadModelDoc = this.loadModelDoc;

  /**
   * Load XML for a model from httpPayload event.
   * To update model data, use:<br/>
   * httpPayload=new Object();<br/>
   * httpPayload.url=url;<br/>
   * httpPayload.httpMethod="post" or "get"<br/>
   * httpPayload.postData=XML or null<br/>
   * this.targetModel.setParam("httpPayload", httpPayload);<br/>
   * @param modelRef    Pointer to the model object being loaded.
   * @param httpPayload an object tho fully specify the request to be made
   */
  this.newRequest = function(modelRef, httpPayload){
    modelRef.url = httpPayload.url;
    modelRef.method = httpPayload.method;
    modelRef.postData = httpPayload.postData;
    modelRef.loadModelDoc(modelRef);
  }
  model.newRequest = this.newRequest;
  model.addListener("httpPayload",model.newRequest, model);

 /**
   * save the model by posting it to the serializeUrl, which is defined as a 
   * property of config.
   * @param objRef Pointer to this object.
   */
  this.saveModel = function(objRef) {
    if (config.serializeUrl) {
      var response = postLoad(config.serializeUrl, objRef.doc);
      response.setProperty("SelectionLanguage", "XPath");
      Sarissa.setXpathNamespaces(response, "xmlns:xlink='http://www.w3.org/1999/xlink'");
      var onlineResource = response.selectSingleNode("//OnlineResource");
      var fileUrl = onlineResource.attributes.getNamedItem("xlink:href").nodeValue;
      objRef.setParam("modelSaved", fileUrl);
    } else {
      alert("serializeUrl must be specified in config to save a model");
    }
  }
  model.saveModel = this.saveModel;

  /**
   * create all the child model javascript objects for this model.
   * A reference to the created model is stored as a js property of the model
   * using the model's ID; so you can always get a reference to a widget by
   * using: "config.modelId.subModelId..."
   * Similarly, a reference to the model is added as a property of config so it 
   * is also available as "config.subModelId"
   */
  this.loadObjects = function(objectXpath) {
    //loop through all child models of this one
    var configObjects = this.modelNode.selectNodes( objectXpath );
    for (var i=0; i<configObjects.length; i++ ) {
      var configNode = configObjects[i];

      //instantiate the Model object
      var objectType = configNode.nodeName;
      var evalStr = "new " + objectType + "(configNode,this);";
      var newObject = eval( evalStr );
      if ( newObject ) {
        this[newObject.id] = newObject;
        config[newObject.id] = newObject;
      } else { 
        alert("error creating object:" + objType);
      }
    }
  }
  model.loadObjects = this.loadObjects;

  /**
   * Initialization of the javascript model and widget objects for this model. 
   * This doesn't call the document loading functions, only creates the javascript
   * objects
   * @param modelRef Pointer to this object.
   */
  model.init = function(modelRef) {
    if (!modelRef.template) {
      modelRef.loadObjects("mb:models/*");
      modelRef.loadObjects("mb:widgets/*");
      modelRef.loadObjects("mb:tools/*");
    }
  }

  //don't load in models and widgets if this is the config doc, defer to config.init
  if (parentModel && !model.template) {
    parentModel.addListener("loadModel",model.loadModelDoc, model);
    model.init(model);
  }

}
