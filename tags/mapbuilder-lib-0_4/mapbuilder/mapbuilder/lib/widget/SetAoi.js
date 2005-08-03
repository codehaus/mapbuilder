/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, the AOI box stays visible and no zoom happens. 
 * @constructor
 * @base ButtonBase
 * @author Mike Adair 
 * @param widgetNode The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function SetAoi(widgetNode, model) {
  // Extend ButtonBase
  var base = new ButtonBase(this, widgetNode, model);

  /**
   * The action to do on click
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    //does nothing for the moment
  }

  if (this.mouseHandler) {
    this.mouseHandler.model.addListener('mouseup',this.doAction,this);
  }

}

