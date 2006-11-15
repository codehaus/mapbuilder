/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: MoveVertex.js 2133 2006-06-22 15:28:52Z steven $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, drag a vertex to move it around
 * @constructor
 * @base ButtonBase
 * @author Steven Ottens steven.ottensATgeodan.nl
 * @param widgetNode The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function MoveVertex(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
  
  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
  this.cursor = "move";	
  /**
   * Set or unset the movepoint parameter to let WfsQueryLayer 
   * know that vertices should be moved when click-dragged
   * @param objRef   Pointer to this button.
   * @param selected Whether or not this button is selected
   */
  this.doSelect = function(selected,objRef) {
    if (selected){
			this.targetModel.setParam("movepoint",true);
    }
    else {
   		this.targetModel.setParam("movepoint",false);
    }  
  }
}
