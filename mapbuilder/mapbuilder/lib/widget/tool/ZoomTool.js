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

   * Zoom (reset the BoundingBox).

   * @param action What action to take ("in" or "out").

   */

  this.zoom=function(action) {

    percent=10/100;

    var srs = this.context.getSRS();

    var bbox=this.context.getBoundingBox();

    geoWidth=parseFloat(bbox[2]-bbox[0]);

    geoHeight=parseFloat(bbox[1]-bbox[3]);

    switch(action){

      case "in":

        bbox[0]=bbox[0]+(geoWidth*percent);

        bbox[2]=bbox[2]-(geoWidth*percent);

        bbox[1]=bbox[1]-(geoHeight*percent);

        bbox[3]=bbox[3]+(geoHeight*percent);

        break;

    }

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

    // this next line doesn't work (object reference lost)

    // img.addEventListener("click", this.zoom, false);

    // so temporarily hardcoding object ref, based on definition in demo page

    img.addEventListener("click", zoomTool.zoom, false);

    this.node.appendChild(img);

  }

}

