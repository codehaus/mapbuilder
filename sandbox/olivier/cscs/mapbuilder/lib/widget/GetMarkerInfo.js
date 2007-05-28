/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: GetMarkerInfo.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, no zoom happens. 
 * @constructor
 * @base ButtonBase
 * @author Patrice G Cappelaere
 * @param widgetNode The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function GetMarkerInfo(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

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

