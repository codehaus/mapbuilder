/*

License: GPL as per: http://www.gnu.org/copyleft/gpl.html

Dependancies: Context



*/



/**

 * Draws 

 * @constructor

 * @author Nedjo

 * @requires Context

 * @param context The Web Map Context to call when changing extent.

 * @param baseDir The base mapbuilder lib directory.

 */

function ToolReceiver(context,baseDir) {

  this.context=context;

  var node=makeElt("DIV");

  width=this.context.getWindowWidth();

  height=this.context.getWindowHeight();

  node.style.width=width;

  node.style.height=height;

  node.style.zIndex=300;

  this.node=node;

  this.move=function(left,top) {

    this.node.style.left=left;

    this.node.style.top=top;

  }

  this.resize=function() {

    width=this.context.getMapWidth();

    height=this.context.getMapHeight();

    this.node.style.width=width;

    this.node.style.height=height;

  }

  /**

   * Render the pan icons.

   * This function should be called at startup.

   */

  this.paint=function(){

    s="testing...";

    this.node.innerHTML=s;

  }

  this.setListener=function() {

    this.node.addEventListener();

  }

}

