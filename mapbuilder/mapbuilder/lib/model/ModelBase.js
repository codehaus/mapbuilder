/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

/**
 * Base Model class to be inherited by all Model objects and provdes methods
 * and properties common to all models.
 * Stores the XML document as the .doc property of the model.
 * Inherits from the Listener class so all models are also listener objects that
 * can call registered listeners.
 * @constructor
 * @base Listener
 * @author Cameron Shorter
 * @param modelNode   The model's XML object node from the configuration document.
 * @param parentModel The model object that this model belongs to.
 */
function ModelBase(modelNode, parentModel) {
  // Inherit the Listener functions and parameters
  Listener.apply(this);

  //models are loaded asynchronously by default; 
  this.async = true;   //change to false for sync loading
  this.contentType = "text/xml";

  this.modelNode = modelNode;
  var idAttr = modelNode.attributes.getNamedItem("id");
  if (idAttr) {
    this.id = idAttr.nodeValue;
  } else {
    //auto generated unique ID assigned to this model
    this.id = "MbModel_" + mbIds.getId();
  }

  //get the human readable title for the model
  var titleNode = modelNode.selectSingleNode("mb:title");
  if (titleNode) {
    this.title = titleNode.firstChild.nodeValue;
  } else {
    this.title = this.id;
  }

  // set an empty debug property which turns of alert messages for a
  // particular model
  if(modelNode.selectSingleNode("mb:debug"))this.debug="true";

  /**
  * set the initial model URL in config.
  * the URL can also be passed in as a URL parameter by using the model ID 
  * as the parameter name (which takes precendence over the config file)
  **/
  if (window.cgiArgs[this.id]) {  
    this.url = window.cgiArgs[this.id];
  } else if (window[this.id]) {  
    this.url = window[this.id];
  } else if (modelNode.url) {  
    this.url = modelNode.url;
  } else {
    var defaultModel = modelNode.selectSingleNode("mb:defaultModelUrl");
    if (defaultModel) this.url = defaultModel.firstChild.nodeValue;
  }

  //set the method property
  var method = modelNode.selectSingleNode("mb:method");
  if (method) {
    this.method = method.firstChild.nodeValue;
  } else {
    this.method = "get";
  }

  //set the namespace property
  var namespace = modelNode.selectSingleNode("mb:namespace");
  if (namespace) {
    this.namespace = namespace.firstChild.nodeValue;
  }

  var templateAttr = modelNode.attributes.getNamedItem("template");
  if (templateAttr) {
    this.template = (templateAttr.nodeValue=="true")?true:false;
    this.modelNode.removeAttribute("template");
  }

  //get the xpath to select nodes from the parent doc
  var nodeSelectXpath = modelNode.selectSingleNode("mb:nodeSelectXpath");
  if (nodeSelectXpath) {
    this.nodeSelectXpath = nodeSelectXpath.firstChild.nodeValue;
  }

  /**
   * Get the value of a node as selected by an XPath expression.1
   * @param objRef Reference to this node.
   * @param xpath XPath of the node to update.
   * @return value of the node or null if XPath does not find a node.
   */
  this.getXpathValue=function(objRef,xpath){
    node=objRef.doc.selectSingleNode(xpath);
    if(node && node.firstChild){
      return node.firstChild.nodeValue;
    }else{
      return null;
    }
  }

  /**
   * Update the value of a node within this model's XML document.
   * Triggers a refresh event from the model.
   * @param objRef Reference to this node.
   * @param xpath Xpath of the node to update.
   * @param value Node's new value.
   * @param refresh determines if the model should be refreshed (optional).
   * @return Returns false if Xpath does not find a node.
   */
  this.setXpathValue=function(objRef,xpath,value){
    var node=objRef.doc.selectSingleNode(xpath);
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

  /**
   * Load a Model's document.  
   * This will only occur if the model.url property is set. 
   * Calling this method triggers several events:
   *   modelStatus - to indicate that the model state is changing
   *   newModel - to give widgets a chance to clear themselves before the doc is loaded
   *   loadModel - to indicate that the document is loaded successfully
   *
   * @param objRef Pointer to the model object being loaded.
   */
  this.loadModelDoc = function(objRef){
    //alert("loading:"+objRef.url);

    if (objRef.url) {
      objRef.callListeners( "newModel" );
      objRef.setParam("modelStatus","loading");

      if (objRef.contentType == "image") {
        //image models are set as a DOM image object
        objRef.doc = new Image();
        objRef.doc.src = objRef.url;
        //objRef.doc.onload = callback //TBD: for when image is loaded

      } else {
        //XML content type
        var xmlHttp = new XMLHttpRequest();
        
        var sUri = objRef.url;
        if ( sUri.indexOf("http://")==0 ) {
          if (objRef.method == "get") {
            sUri = getProxyPlusUrl(sUri);
          } else {
            sUri = config.proxyUrl;
          }
        }
        xmlHttp.open(objRef.method, sUri, objRef.async);
        if (objRef.method == "post") {
          xmlHttp.setRequestHeader("content-type",objRef.contentType);
          xmlHttp.setRequestHeader("serverUrl",objRef.url);
        }
        
        xmlHttp.onreadystatechange = function() {
          objRef.setParam("modelStatus",httpStatusMsg[xmlHttp.readyState]);
          if (xmlHttp.readyState==4) {
            if (xmlHttp.status >= 400) {   //http errors status start at 400
              var errorMsg = "error loading document: " + sUri + " - " + xmlHttp.statusText + "-" + xmlHttp.responseText;
              alert(errorMsg);
              objRef.setParam("modelStatus",errorMsg);
              return;
            } else {
              //alert(xmlHttp.getResponseHeader("Content-Type"));
              if ( null==xmlHttp.responseXML ) {
                alert( "null XML response:" + xmlHttp.responseText );
              } else {
                objRef.doc = xmlHttp.responseXML;
                //if (objRef.doc.documentElement.nodeName.search(/exception/i)>=0) {
                //  objRef.setParam("modelStatus",-1);
                //  alert("Exception:"+Sarissa.serialize(xmlHttp.responseText));
                //}
              }
              objRef.finishLoading();
            }
          }
        }

        xmlHttp.send(objRef.postData);

        if (!objRef.async) {
          if (xmlHttp.status >= 400) {   //http errors status start at 400
            var errorMsg = "error loading document: " + sUri + " - " + xmlHttp.statusText + "-" + xmlHttp.responseText;
            alert(errorMsg);
            this.objRef.setParam("modelStatus",errorMsg);
            return;
          } else {
            //alert(xmlHttp.getResponseHeader("Content-Type"));
            if ( null==xmlHttp.responseXML ) alert( "null XML response:" + xmlHttp.responseText );
            objRef.doc = xmlHttp.responseXML;
            objRef.finishLoading();
          }
        }

        //objRef.doc.validateOnParse=false;  //IE6 SP2 parsing bug
      }
    }
  }

  /**
   * Set the model's XML document using an XML object as a parameter.
   * @param objRef Pointer to this object.
   * @param newModel XML object to be inserted into the new model.
   */
  this.setModel=function(objRef,newModel){
    objRef.callListeners("newModel");
    objRef.doc=newModel;
    objRef.finishLoading();
  }

  /**
   * Common steps to be carried out after all manner of model loading
   * Called to set the namespace for XPath selections and call the loadModel
   * listeners.
   */
  this.finishLoading = function() {
    // the following two lines are needed for IE; set the namespace for selection
    if(this.doc){
      this.doc.setProperty("SelectionLanguage", "XPath");
      if(this.namespace) Sarissa.setXpathNamespaces(this.doc, this.namespace);

      // Show the newly loaded XML document
      if(this.debug) alert("Loading Model:"+this.id+" "+Sarissa.serialize(this.doc));
      this.callListeners("contextLoaded");  //PGC
      this.callListeners("loadModel");
    }
  }

  /**
   * Load XML for a model from an httpPayload object.  This will also handle
   * instantiating template models if they have the "template" attribute set.
   * To update model data, use:<br/>
   * httpPayload=new Object();<br/>
   * httpPayload.url="url" or null. If set to null, all dependant widgets
   *   will be removed from the display.<br/>
   * httpPayload.httpMethod="post" or "get"<br/>
   * httpPayload.postData=XML or null<br/>
   * @param objRef    Pointer to the model object being loaded.
   * @param httpPayload an object to fully specify the request to be made
   */
  this.newRequest = function(objRef, httpPayload){
    var model = objRef;
    // if the targetModel is a template model, then create new model object and
    // assign it an id
    if (objRef.template) {
      var parentNode = objRef.modelNode.parentNode;
      var newConfigNode = parentNode.appendChild(objRef.modelNode.ownerDocument.importNode(objRef.modelNode,true));
      newConfigNode.removeAttribute("id");  //this will get created automatically
      //set defaultModelUrl config properties
      model = objRef.createObject(newConfigNode);
      model.callListeners("init");
      if (!objRef.templates) objRef.templates = new Array();
      objRef.templates.push(model);
    }

    //set the payload in the model and issue the request
    model.url = httpPayload.url;
    if (!model.url) model.doc=null;
    model.method = httpPayload.method;
    model.postData = httpPayload.postData;
    model.loadModelDoc(model);
  }
 
 /**
   * deletes all template models and clears their widgets
   */
  this.deleteTemplates = function() {
    if (this.templates) {
      while( model=this.templates.pop() ) {
        model.setParam("newModel");
        var parentNode = this.modelNode.parentNode;
        parentNode.removeChild(model.modelNode);
      }
    }
  }

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

  /**
   * Creates all mapbuilder JavaScript objects based on the Object nodes defined
   * in the configuration file.
   * A reference to the created model is stored as a property of the config.objects
   * property using the model's ID; you can always get a reference to a mapbuilder
   * object as: "config.objects.objectId"
   * @param configNode The node from config for the model to be created
   */
  this.createObject = function(configNode) {
    var objectType = configNode.nodeName;
    var evalStr = "new " + objectType + "(configNode,this);";
    var newObject = eval( evalStr );
    if ( newObject ) {
      config.objects[newObject.id] = newObject;
      return newObject;
    } else { 
      alert("error creating object:" + objectType);
    }
  }

  /**
   * Creates all the mapbuilder objects from the config file as selected by the
   * XPath value passed in.
   * @param objectXpath The XPath for the set of nodes being created
   */
  this.loadObjects = function(objectXpath) {
    //loop through all nodes selected from config
    var configObjects = this.modelNode.selectNodes( objectXpath );
    for (var i=0; i<configObjects.length; i++ ) {
      this.createObject( configObjects[i]);
    }
  }

  /**
   * Initialization of all javascript model, widget and tool objects for this model. 
   * Calling this method triggers an init event for this model.
   * @param objRef Pointer to this object.
   */
  this.parseConfig = function(objRef) {
    objRef.loadObjects("mb:widgets/*");
    objRef.loadObjects("mb:tools/*");
    objRef.loadObjects("mb:models/*");
  }

  /**
   * Listener registered with the parent model to call refresh listeners when 
   * the model document is loaded
   * @param objRef Pointer to this object.
   */
  this.refresh = function(objRef) {
    objRef.setParam("refresh");
  }
  this.addListener("loadModel",this.refresh, this);

  /**
   * Listener registered with the parent model to call init listeners when 
   * the parent model is init'ed
   * @param objRef Pointer to this object.
   */
  this.init = function(objRef) {
    objRef.callListeners("init");
  }

  /**
   * Listener registered with the parent model to remove the doc and url 
   * of child models whenever the parent is reloaded.
   * @param objRef Pointer to this object.
   */
  this.clearModel = function(objRef) {
    objRef.doc=null;
    //objRef.url=null;
  }

  //don't load in models and widgets if this is the config doc, 
  //defer that to an explcit config.init() call in mapbuilder.js
  if (parentModel) {
    this.parentModel = parentModel;
    this.parentModel.addListener("init",this.init, this);
    this.parentModel.addListener("loadModel",this.loadModelDoc, this);
    this.parentModel.addListener("newModel", this.clearModel, this);
    this.parseConfig(this);
  }
}

//ModelBase.prototype.httpStatusMsg = ['uninitialized','loading','loaded','interactive','completed'];
var httpStatusMsg = ['uninitialized','loading','loaded','interactive','completed'];
