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
   * Load a Model's configuration file from url.
   * @param objRef Pointer to this object.
   * @param url Url of the configuration file.
   */
  this.loadModelDoc = function(url,postData){
    this.url = url;
    url=getProxyPlusUrl(url);
    if (url) {
      if (postData) {
        this.doc = postLoad(url,postData);
        if (this.doc.parseError < 0){
          alert("error loading document: " + url + " - " + Sarissa.getParseErrorText(this.doc) );
        }
      } else {
        this.doc = Sarissa.getDomDocument();
        this.doc.async = false;
        this.doc.validateOnParse=false;  //IE6 SP2 parsing bug
        this.doc.load(url);
        if (this.doc.parseError < 0){
          alert("error loading document: " + url + " - " + Sarissa.getParseErrorText(this.doc) );
        }
      }
    } else {
      alert("url parameter required for loadModelDoc");
    }

    // the following two lines are needed for IE; set the namespace for selection
    this.doc.setProperty("SelectionLanguage", "XPath");
    if (this.namespace) Sarissa.setXpathNamespaces(this.doc, this.namespace);

    //this.callListeners("loadModel");
  }

  /**
   * Paint all the widgets and initialise any tools the widget may have.
   * @param objRef Pointer to this object.
   */
  this.loadWidgets = function(objRef) {
    var widgets = objRef.modelNode.selectNodes("mb:widgets/*");
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

}
