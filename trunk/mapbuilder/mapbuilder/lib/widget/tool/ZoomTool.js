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

function ZoomTool(context,baseDir) {

  this.context=context;

  var node=makeElt("DIV");

  node.style.position="absolute";

  this.node=node;

  this.move=function(left,top) {

    this.node.style.left=left;

    this.node.style.top=top;

  }

  this.resize=function(width,height) {

    this.node.style.width=width;

    this.node.style.height=height;

  }

  /**

   * Render the zoom icons.

   * This function should be called at startup.

   */

  this.paint=function(){

    s="<a href=\"javascript:context.zoom('in')\">Zoom in</a>";

    this.node.innerHTML=s;

  }

}

