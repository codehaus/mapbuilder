/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base Class for widgets.  Associates a node on the page with a stylesheet and
 * model.
 *
 * @constructor
 * @author Mike Adair 
 * @constructor
 * @requires Sarissa
 * @param model         The model that this widget is associated with
 * @param id            ID of the page element where the widget will be rendered
 * @param stylesheetUrl URL for the stylesheet to process the model
 */
function WidgetBase(widgetNode, group) {
  if ( arguments.length > 0 ) {

  this.id = widgetNode.attributes.getNamedItem("id").nodeValue;
  this.node = document.getElementById( this.id );
  if( this.node==null ) {
    alert("HTML node for " + widgetNode.nodeName + " not found: id:" + this.id);
  }
  this.parentGroup = group;
  this.model = group.model;

  var styleNode = widgetNode.selectSingleNode("stylesheet");
  if ( styleNode ) this.stylesheet = new XslProcessor( config.baseDir + styleNode.firstChild.nodeValue );


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
   * Render the widget
   */
  this.paint = function() {
    this.stylesheet.setParameter("modelIndex", this.model.modelIndex );
    var s = this.stylesheet.transformNode(this.model.doc);
    this.node.innerHTML = s;
  }

  /**
   * no-op function; override in derived classes to add listeners to the model
   */
  this.addListeners = function() {}

  }

}
