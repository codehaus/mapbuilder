/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base Class for widgets.  Associates a node on the page with a stylesheet and
 * model.  All widgets must extend this base class.
 * TBD: find a way to use the .prototype property to do inheritance.
 * Defines the default paint() method for all widgets which is where the 
 * stylesheet is applied to the model XML document.
 * The stylesheet URL defaults to "widget/<widgetName>.xsl" if it is not defined
 * in config file.  Set a stylesheet property containing an XSL URL in config
 * to customize the stylesheet used.
 * All stylesheets will have "modelId" and "widgetId" parameters set when called.
 *
 * @constructor
 * @author Mike Adair 
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function WidgetBase(widgetNode, model) {
  // Inherit the Listener functions and parameters
  var listener = new Listener();
  for (sProperty in listener) { 
    this[sProperty] = listener[sProperty]; 
  } 

  //set some properties
  this.id = widgetNode.attributes.getNamedItem("id").nodeValue;
  this.node = document.getElementById( this.id );
  if( this.node==null ) {
    alert("HTML node for " + widgetNode.nodeName + " not found: id:" + this.id);
  }
  this.model = model;
  this.widgetNode = widgetNode;

  // Set this.stylesheet
  // Defaults to "widget/<widgetName>.xsl" if not defined in config file.
  var styleNode = widgetNode.selectSingleNode("stylesheet");
  var styleUrl;
  if ( styleNode ) styleUrl = styleNode.firstChild.nodeValue;
  else styleUrl = baseDir+"/widget/"+widgetNode.nodeName+".xsl";
  this.stylesheet = new XslProcessor(styleUrl);

  //all stylesheets will have these properties available
  this.stylesheet.setParameter("modelId", this.model.id );
  this.stylesheet.setParameter("widgetId", this.id );

  /**
   * Move this widget to the absolute (left,top) position in the browser.
   * @param left Absolute left coordinate.
   * @param top Absolute top coordinate.
   */
  this.move = function(left,top) {
    this.node.style.left = left;
    this.node.style.top = top;
  }

  /**
   * Resize this widget.
   * @param width New width.
   * @param height New height.
   */
  this.resize = function(width,height) {
    this.node.style.width = width;
    this.node.style.height = height;
  }

  /**
   * Render the widget.
   */
  this.paint = function() {
    var s = this.stylesheet.transformNode(this.model.doc);
    this.node.innerHTML = s;
    this.callListeners("paint");
  }

  /**
   * Instantiate all the child tools of this widget.
   */
  this.loadTools = function() {
    var toolNodes = this.widgetNode.selectNodes( "tools/*" );
    for (var i=0; i<toolNodes.length; i++ ) {
      var toolNode = toolNodes[i];
      evalStr = "new " + toolNode.nodeName + "(toolNode, this);";
      this[toolNode.nodeName] = eval( evalStr );
    }
  }

  /**
   * no-op function; override in derived classes to add tool listeners to the model.
   */
  this.postPaintInit = function() {}
}
