/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base Class for widgets.  Associates a node on the page with a stylesheet and
 * model.  All widgets must extend this base class.
 * TBD: find a way to use the .prototype property to do inheritance.
 *
 * @constructor
 * @author Mike Adair 
 * @param widgetNode The Widget's XML object node from the configuration
 * document.
 * @param model The javascript model object from the configuration
 * document that this widget belongs to.
 */
function WidgetBase(widgetNode, model) {
  if ( arguments.length > 0 ) {   //need this for .prototype?

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

    var targetGroup = widgetNode.selectSingleNode("targetWidgetGroup");
    if ( targetGroup ) this.targetGroup = targetGroup.firstChild.nodeValue;


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

      for (var i=0; i<this.paintListeners.length; i++) {
        this.paintListeners[i][0]( this.paintListeners[i][1] );
      }
    }

    /**
     * Instantiate all the child tools of this widget.
     */
    this.loadTools = function() {
      var tools = this.widgetNode.selectNodes( "tools/*" );
      for (var i=0; i<tools.length; i++ ) {
        var toolNode = tools[i];
        evalStr = "new " + toolNode.nodeName + "(toolNode, this);";
        this[toolNode.nodeName] = eval( evalStr );
      }
    }

    /** Functions to call when the widget is painted */
    this.paintListeners = new Array();

    /**
     * Add a Listener for AoiBox change.
     * @param listener The function to call when the Area Of Interest changes.
     * @param target The object which owns the listener function.
     */
    this.addPaintListener = function(listener,target) {
      this.paintListeners[this.paintListeners.length] = new Array(listener,target);
    }

    /**
     * no-op function; override in derived classes to add listeners to the model.
     */
    this.postPaintInit = function() {}
  }
}
