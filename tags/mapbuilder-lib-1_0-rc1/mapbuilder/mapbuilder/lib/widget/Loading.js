/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * This widget can be used to insert a message while the Mapbuilder
 * javascript is loading.  The message is removed once Mapbuilder
 * javascript is loaded.  In the main HTML file, insert something like:<br/>
 * &lt;div id="loading"&gt;&lt;p&gt;Loading Program&lt;/p&gt;&lt;/div&gt;.
 * @constructor
 * @base WidgetBase
 * @author Cameron Shorter
 * @param widgetNode The widget's XML object node from the configuration document.
 * @param model The model object that this widget belongs to.
 */
function Loading(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));

  /**
   * Remove the contents of the HTML tag for this widget.
   * @param objRef Reference to this object.
   */
  this.paint= function(objRef) {
    while (objRef.node.childNodes.length>0) {
      objRef.node.removeChild(objRef.node.childNodes[0]);
    }
  }
  this.model.addListener("refresh",this.paint, this);
}
