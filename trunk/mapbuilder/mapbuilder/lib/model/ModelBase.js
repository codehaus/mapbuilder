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

  this.loadModelDoc = function( url ){
    this.doc = Sarissa.getDomDocument();
    this.doc.async = false;
    // the following two lines are needed for IE
    this.doc.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
    this.doc.setProperty("SelectionLanguage", "XPath");
    this.doc.load(url);
    if ( this.doc.parseError < 0 ) alert("error loading document: " + url);

    var docId = this.doc.documentElement.attributes.getNamedItem("id");
    if (docId) this.docId = docId.nodeValue;
  }

  this.loadWidgets = function() {
    var widgets = this.modelNode.selectNodes("widgets/*");
    for (var j=0; j<widgets.length; j++) {
      var widgetNode = widgets[j];

      //call the widget constructor and paint
      var evalStr = "new " + widgetNode.nodeName + "(widgetNode, this);";
      //alert("eval: model.loadWidgets:" + evalStr);
      var widget = eval( evalStr );

      widget.loadTools();
      widget.paint();
      //this has to be called after widgets are painted
      //I'd like to get rid of this, they should be handled as paintListeners
      widget.addListeners();
      this[widgetNode.nodeName] = widget;

      this.callListeners( "loadWidget" );
    }
  }
}
