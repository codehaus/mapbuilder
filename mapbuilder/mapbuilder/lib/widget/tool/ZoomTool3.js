/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
Dependancies: Context
$Id$
*/

/**
 * Draws pan images and updates Context Bounds when a user clicks on the image.
 * @constructor
 * @author Nedjo
 * @constructor
 * @requires Context
 * @param context The Web Map Context to call when changing extent.
 * @param node Node from the HTML DOM to insert Pan HTML into.
 */
function ZoomInHandler(toolNode, parentWidget) {
  this.parentWidget = parentWidget;
  this.model = parentWidget.model;
  this.modeValue = toolNode.selectSingleNode("modeValue").firstChild.nodeValue;

  parentWidget[this.modeValue] = new Object();
  parentWidget[this.modeValue].mouseup = function( model ) {
    var bbox = model.getAoi();
    var ul = model.extent.GetXY( bbox[0] );
    var lr = model.extent.GetXY( bbox[1] );
    model.extent.ZoomToBox( ul, lr );
  }

}
