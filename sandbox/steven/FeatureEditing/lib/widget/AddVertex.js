/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: AddVertex.js 2133 2006-06-22 15:28:52Z steven $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, click on a vertex to duplicate it
 * @constructor
 * @base ButtonBase
 * @author Steven Ottens steven.ottensATgeodan.nl
 * @param widgetNode The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function AddVertex(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
  
  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
  this.cursor = "crosshair";	
  /**
   * Set or unset the addpoint parameter to let WfsQueryLayer 
   * know that vertices should be cloned when clicked
   * @param objRef   Pointer to this button.
   * @param selected Whether or not this button is selected
   */
  this.doSelect = function(selected,objRef) {
    if (selected){
			this.targetModel.setParam("addpoint",true);
    }
    else {
   		this.targetModel.setParam("addpoint",false);
    }  
  }
}