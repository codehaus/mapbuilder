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

function ZoomTool(context, name, node) {

  this.context=context;

  this.name=name;

  if(node==null){

    node=makeElt("DIV");

    node.style.position="absolute";

  }

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

   * Zoom in (reset the BoundingBox).

   */

  this.zoomIn=function() {

    percent=20/100;

    bbox=this.context.getBoundingBox();

    geoWidth=parseFloat(bbox[2]-bbox[0]);

    geoHeight=parseFloat(bbox[1]-bbox[3]);

    bbox[0]=bbox[0]+(geoWidth*percent);

    bbox[2]=bbox[2]-(geoWidth*percent);

    bbox[1]=bbox[1]-(geoHeight*percent);

    bbox[3]=bbox[3]+(geoHeight*percent);

    this.context.setBoundingBox(bbox);

  }

  /**

   * Render the zoom icons.

   * This function should be called at startup.

   */

  this.paint=function(){

    img=document.createElement("img");

    img.style.cursor="pointer";

    img.setAttribute("src", this.context.skin+"images/zoomIn.gif");

    // next line not working, so using setAttribute instead...

    // img.addEventListener("click", eval(this.name+".zoomIn"), false);

    img.setAttribute("onclick",this.name+".zoomIn();");

    this.node.appendChild(img);

  }

}

