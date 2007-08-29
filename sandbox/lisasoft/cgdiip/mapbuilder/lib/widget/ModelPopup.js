/*
Author:       Cameron Shorter cameronAtshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id:$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/util/Util.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
/**
 * Widget to render a map from an OGC context document.  The layers are
 * rendered using http://openlayers.org .
 * @constructor
 * @base WidgetBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function ModelPopup(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));

  this.title="ModelPopup";
  this.popup=null;

  /**
   * Render the widget.
   * @param objRef Pointer to widget object.
   */
  ModelPopup.prototype.paint = function(objRef, refresh){
    if (objRef.model.doc && objRef.node) {
      var outputNode = document.getElementById( objRef.outputNodeId );
      var tempNode = document.createElement("DIV");
      tempNode.innerHTML =
        '<input type="button" onclick="javascript:config.objects.'
        +objRef.id
        +'.popupWindow(config.objects.'
        +objRef.id
        +')" value="View Context">';
      if( tempNode.firstChild != null ) { //Could be null!
        tempNode.firstChild.setAttribute("id", objRef.outputNodeId);
      }

      //look for this widgets output and replace if found,
      //otherwise append it
      if (outputNode) {
        objRef.node.replaceChild(tempNode.firstChild,outputNode);
      } else {
        objRef.node.appendChild(tempNode.firstChild);
      }
    }
    //objRef.popupWindow(objRef);
  }
  this.model.addListener("refresh",this.paint, this);

  /**
   * Create a popup windows showing the model as XML.
   * @param objRef Pointer to widget object.
   */
  ModelPopup.prototype.popupWindow = function(objRef){
    var s=(new XMLSerializer()).serializeToString(objRef.model.doc);
    alert("ModelPopup.popupWindow: "+s);
    s=
      "<html><title>"
      +"Context"
      +"</title><body>"
      +Sarissa.escape(s)
      +"</body></html>"
    alert(s);
    //TBD: How do we write to the window?
    var popup=window.open();
    popup.write('Put this into window');
    //objRef.popup=window.open(null,objRef.title);
    //objRef.popup.write('Put this into window');
  }
} 
