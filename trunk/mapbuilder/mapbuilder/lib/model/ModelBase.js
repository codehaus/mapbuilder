/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base Model class to be instantiated by all Model objects.
 * loads the XML document as the doc property of the model
 * event listeners.  ModelBase extends Listener.
 * @constructor
 * @author Cameron Shorter
 * @see Listener
 */
function ModelBase(modelNode) {
  // Inherit the Listener functions and parameters
  var listener = new Listener();
  for (sProperty in listener) { 
    this[sProperty] = listener[sProperty]; 
  } 

  //calling ModelBase with no params skips this section
  if (modelNode) {
    this.id = modelNode.attributes.getNamedItem("id").nodeValue;
    this.modelNode = modelNode;
  }

  /**
   * Load a Model's configuration file from an XML node.
   * @param node Xml node which contains the configuration file.
   */
  this.loadModelNode = function(node){
    this.doc=node;
    var docId = this.doc.documentElement.attributes.getNamedItem("id");
    if (docId) this.docId = docId.nodeValue;
    this.callListeners("loadModel");
  }

  /**
   * Load a Model's configuration file from url.
   * @param objRef Pointer to this object.
   * @param url Url of the configuration file.
   */
  this.loadModelDoc = function(objRef,url){
    var xml;
    xml = Sarissa.getDomDocument();
    xml.async = false;

    // the following two lines are needed for IE; set the namespace for selection
    // in config
    xml.setProperty("SelectionLanguage", "XPath");
    if (this.namespace) Sarissa.setXpathNamespaces(xml, this.namespace);
    xml.validateOnParse=false;

    url=objRef.getProxyPlusUrl(url);
    if (url) {
      //xml = loadSync(url);
      xml.load(url);
      if (xml.parseError < 0){
        alert("error loading document: " + url + " - " + Sarissa.getParseErrorText(xml) );
      } else {
        this.loadModelNode(xml);
      }
    }
  }

  /**
   * Paint all the widgets and initialise any tools the widget may have.
   * @param objRef Pointer to this object.
   */
  this.loadWidgets = function(objRef) {
    var widgets = objRef.modelNode.selectNodes("widgets/*");
    for (var j=0; j<widgets.length; j++) {
      var widgetNode = widgets[j];
      var widgetId = widgetNode.attributes.getNamedItem("id")
      if (widgetId) widgetId = widgetId.nodeValue;
      
      //remove widget generated content first
      var widget = null;
      if (widgetId && objRef[widgetId]) {
        //remove any output from this widget
        widget = objRef[widgetId];
        var outputNode = document.getElementById( widget.mbWidgetId );
        if (outputNode) widget.node.removeChild( outputNode );
      }

      //call the widget constructor
      var evalStr = "new " + widgetNode.nodeName + "(widgetNode, objRef);";
      widget = eval( evalStr );
      if (widget) {
        //paint the widget and load the tools
        objRef[widget.id] = widget;
        widget.paint(widget);
        widget.loadTools();
      } else {
        alert("error creating widget:" + widgetNode.nodeName);
      }

    }
  }

  /**
   * If URL is local, then return URL unchanged,
   * else return URL of http://proxy?url=URL , or null if proxy not defined.
   * @param url Url of the file to access.
   * @return Url of the proxy and service in the form http://host/proxy?url=service
   */
  this.getProxyPlusUrl=function(url) {
    if ( url.indexOf("http://")==0 ) {
      if ( config.proxyUrl ) {
        url=config.proxyUrl+escape(url).replace(/\+/g, '%2C').replace(/\"/g,'%22').replace(/\'/g, '%27');
      } else {
        alert("unable to load external document:"+url+"  Set the proxyUrl property in config.");
        url=null;
      }
    }
    return url;
  }
}
