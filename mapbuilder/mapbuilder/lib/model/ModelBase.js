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
 * @param objRef       Pointer to the model instance being created
 * @param modelNode   The model's XML object node from the configuration document.
 * @param parentModel The model object that this model belongs to.
 */
function ModelBase(objRef, modelNode, parentModel) {
  // Inherit the Listener functions and parameters
  var listener = new Listener(objRef);

  //models are loaded asynchronously by default; 
  objRef.async = true;   //change to false for sync loading
  objRef.contentType = "text/xml";

  objRef.modelNode = modelNode;
  var idAttr = modelNode.attributes.getNamedItem("id");
  if (idAttr) {
    objRef.id = idAttr.nodeValue;
  } else {
    //auto generated unique ID assigned to this model
    objRef.id = "MbModel_" + mbIds.getId();
  }

  //get the human readable title for the model
  var titleNode = modelNode.selectSingleNode("mb:title");
  if (titleNode) {
    objRef.title = titleNode.firstChild.nodeValue;
  } else {
    objRef.title = objRef.id;
  }

  // set an empty debug property which turns of alert messages for a
  // particular model
  if(modelNode.selectSingleNode("mb:debug"))objRef.debug="true";

  /**
  * set the initial model URL in config.
  * the URL can also be passed in as a URL parameter by using the model ID 
  * as the parameter name (which takes precendence over the config file)
  **/
  if (window.cgiArgs[objRef.id]) {  
    objRef.url = window.cgiArgs[objRef.id];
  } else if (window[objRef.id]) {  
    objRef.url = window[objRef.id];
  } else if (modelNode.url) {  
    objRef.url = modelNode.url;
  } else {
    var defaultModel = modelNode.selectSingleNode("mb:defaultModelUrl");
    if (defaultModel) objRef.url = defaultModel.firstChild.nodeValue;
  }

  //set the method property
  var method = modelNode.selectSingleNode("mb:method");
  if (method) {
    objRef.method = method.firstChild.nodeValue;
  } else {
    objRef.method = "get";
  }

  //set the namespace property
  var namespace = modelNode.selectSingleNode("mb:namespace");
  if (namespace) {
    objRef.namespace = namespace.firstChild.nodeValue;
  }

  var templateAttr = modelNode.attributes.getNamedItem("template");
  if (templateAttr) {
    objRef.template = (templateAttr.nodeValue=="true")?true:false;
    objRef.modelNode.removeAttribute("template");
  }

  //get the xpath to select nodes from the parent doc
  var nodeSelectXpath = modelNode.selectSingleNode("mb:nodeSelectXpath");
  if (nodeSelectXpath) {
    objRef.nodeSelectXpath = nodeSelectXpath.firstChild.nodeValue;
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
  objRef.getXpathValue=this.getXpathValue;

  /**
   * Update the value of a node within this model's XML document.
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
  objRef.setXpathValue=this.setXpathValue;

  /**
   * Load a Model's document.  
   * This will only occur if the model.url property is set. 
   * Calling this method triggers several events:
   *   modelStatus - to indicate that the model state is changing
   *   newModel - to give widgetrs a chance to clear themselves before the doc is loaded
   *   loadModel - to indicate that the document is loaded successfully
   *   refresh - to indicate that widgets should be refreshed
   *
   * @param objRef Pointer to the model object being loaded.
   */
  this.loadModelDoc = function(objRef){
    objRef.setParam("modelStatus","loading");

    objRef.callListeners( "newModel" );
    if (objRef.url) {

      if (objRef.contentType == "image") {
        //image models are set as a DOM image object
        objRef.doc = new Image();
        objRef.doc.src = objRef.url;
        //objRef.doc.onload = callback //TBD: for when image is loaded

      } else {
        //XML content type

        //PatC deprecated with Sarissa 0.9.6.1
        //var xmlHttp = Sarissa.getXmlHttpRequest();
        var xmlHttp = new XMLHttpRequest(); // PatC
        
        var sUri = objRef.url;
        if ( sUri.indexOf("http://")==0 ) {
          if (objRef.method == "get") {
            sUri = getProxyPlusUrl(sUri);
          } else {
            xmlHttp.setRequestHeader("content-type",objRef.contentType);
            xmlHttp.setRequestHeader("serverUrl",sUri);
            sUri = config.proxyUrl;
          }
        }
        xmlHttp.open(objRef.method, sUri, objRef.async);
        
        xmlHttp.onreadystatechange = function() {
          objRef.setParam("modelStatus",xmlHttp.readyState);
          if (xmlHttp.readyState==4) {
            if (xmlHttp.status >= 400) {   //http errors status start at 400
              alert("error loading document: " + sUri + " - " + xmlHttp.statusText + "-" + xmlHttp.responseText );
              objRef.setParam("modelStatus",-1);
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
            alert("error loading document: " + sUri + " - " + xmlHttp.statusText + "-" + xmlHttp.responseText );
            this.objRef.setParam("modelStatus",-1);
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
    } else {
      //no URL means this is a template model
      //alert("url parameter required for loadModelDoc");
    }
  }
  objRef.loadModelDoc = this.loadModelDoc;

  /**
   * Common steps to be carried out after all manner of model loading
   * Called to set the namespace for XPath selections and call the loadModel
   * listeners.
   */
  this.finishLoading = function() {
    // the following two lines are needed for IE; set the namespace for selection
    this.doc.setProperty("SelectionLanguage", "XPath");
    if (this.namespace) Sarissa.setXpathNamespaces(this.doc, this.namespace);
    this.callListeners("loadModel");
  }
  objRef.finishLoading = this.finishLoading;

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
    // if the targetModel is a template model, then create new model object and
    // assign it an id
    if (objRef.template) {
      var parentNode = objRef.modelNode.parentNode;
      var newConfigNode = parentNode.appendChild(objRef.modelNode.ownerDocument.importNode(objRef.modelNode,true));
      newConfigNode.removeAttribute("id");  //this will get created automatically
      //set defaultModelUrl config properties
      objRef = objRef.createObject(newConfigNode);
    }

    //set the payload in the model and issue the request
    objRef.url = httpPayload.url;
    if (!objRef.url){
      objRef.doc=null;
    }
    objRef.method = httpPayload.method;
    objRef.postData = httpPayload.postData;
    objRef.loadModelDoc(objRef);
  }
  objRef.newRequest = this.newRequest;

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
  objRef.saveModel = this.saveModel;

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
      alert("error creating object:" + objType);
    }
  }
  objRef.createObject = this.createObject;

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
  objRef.loadObjects = this.loadObjects;

  /**
   * Initialization of all javascript model, widget and tool objects for this model. 
   * Calling this method triggers an init event for this model.
   * @param objRef Pointer to this object.
   */
  objRef.init = function(objRef) {
    objRef.loadObjects("mb:widgets/*");
    objRef.loadObjects("mb:tools/*");
    objRef.loadObjects("mb:models/*");
    objRef.callListeners("init");
  }

  /**
   * Listener registered with the parent model to call refresh listeners when 
   * the model document is loaded
   * @param objRef Pointer to this object.
   */
  objRef.refresh = function(objRef) {
    objRef.callListeners("refresh");
  }
  objRef.addListener("loadModel",objRef.refresh, objRef);

  /**
   * Listener registered with the parent model to remove the doc and url 
   * of child models whenever the parent is reloaded.
   * @param objRef Pointer to this object.
   */
  objRef.clearModel = function(objRef) {
    objRef.doc=null;
    objRef.url=null;
  }

  if (parentModel) objRef.init(objRef);

  //don't load in models and widgets if this is the config doc, 
  //defer that to an explcit config.init() call in mapbuilder.js
  if (parentModel && !objRef.template) {
    objRef.parentModel = parentModel;
    parentModel.addListener("loadModel",objRef.loadModelDoc, objRef);
    parentModel.addListener("newModel", objRef.clearModel, objRef);
  }
}
