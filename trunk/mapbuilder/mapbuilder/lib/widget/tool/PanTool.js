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
 * @param baseDir The base mapbuilder lib directory.
 * @param node Node from the HTML DOM to insert Pan HTML into.
 */
function PanTool(context,baseDir,node) {
  this.context=context;
  this.node=node;

  /**
   * Render the pan icons.
   * This function should be called at startup.
   */
  this.paint=function(){
    s="Insert Pan Functions here";
    this.node.innerHTML=s;
  }
}
