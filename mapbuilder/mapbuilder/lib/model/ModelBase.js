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
function ModelBase(modelNode, parent) {
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
   * Load a Model's configuration file from url.
   * @param url Url of the configuration file.
   */
  this.loadModelDoc = function( url ){
    this.doc = Sarissa.getDomDocument();
    this.doc.async = false;
    // the following two lines are needed for IE
    this.doc.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
    this.doc.setProperty("SelectionLanguage", "XPath");

    //check to see if this is coming from a different domain, if so use the proxy URL
    if ( url.indexOf("http://")==0 ) {
      if ( config.proxyUrl ) {
        url = config.proxyUrl + url;
        //alert("external URL:" + url );
      } else {
        alert("unable to load external document:"+url+"  Set the proxyUrl property in config.");
      }
    }

    this.doc.load(url);
    if ( this.doc.parseError < 0 ) alert("error loading document: " + url);

    var docId = this.doc.documentElement.attributes.getNamedItem("id");
    if (docId) this.docId = docId.nodeValue;

    this.callListeners("loadModel");
  }

  /**
   * Paint all the widgets and initialise any tools the widget may have.
   */
  this.loadWidgets = function() {
    var widgets = this.modelNode.selectNodes("widgets/*");
    for (var j=0; j<widgets.length; j++) {
      var widgetNode = widgets[j];

      //call the widget constructor and paint
      var evalStr = "new " + widgetNode.nodeName + "(widgetNode, this);";
      var widget = eval( evalStr );
      this[widget.id] = widget;

      widget.paint();
      widget.loadTools();

      widget.callListeners( "loadWidget" );
    }
  }
}
