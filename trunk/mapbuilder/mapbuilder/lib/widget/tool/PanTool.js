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
function PanTool(context,baseDir) {
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
   * Render the pan icons.
   * This function should be called at startup.
   */
  this.paint=function(){
    s="<table border='1px'><tr><td>NW</td><td>N</td><td>NE</td></tr><tr><td style=\"cursor:pointer\" onclick=\"context.panDir('w')\" onmouseover=\"this.style.backgroundColor='silver'\" onmouseout=\"this.style.backgroundColor='white'\" title=\"Pan West\">W</td><td></td><td>E</td></tr><tr><td>SW</td><td>S</td><td>SE</td></tr></table>";
    this.node.innerHTML=s;
  }
}
