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

 * @param name Variable name referencing this MapPane object

 * @param node Node from the HTML DOM to insert Pan HTML into.

 */

function PanTool(context, name, node) {

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

   * Pan (reset the BoundingBox) in a specified direction.

   * @param dir The direction to pan in.

   * @param percent Percentage to pan (of Window width).

   */

  this.panDir=function(dir, percent) {

    if(percent == null){

      percent=10;

    }

    percent=percent/100;

    var srs = this.context.getSRS();

    var bbox=this.context.getBoundingBox();

    geoWidth=parseFloat(bbox[2]-bbox[0]);

    geoHeight=parseFloat(bbox[1]-bbox[3]);

    switch(dir){

      case "nw":

        bbox[1]=(bbox[1])+(geoWidth*percent);

        bbox[3]=(bbox[3])+(geoWidth*percent);

        bbox[0]=(bbox[0])-(geoWidth*percent);

        bbox[2]=(bbox[2])-(geoWidth*percent);

        break;

      case "ne":

        bbox[1]=(bbox[1])+(geoWidth*percent);

        bbox[3]=(bbox[3])+(geoWidth*percent);

        bbox[0]=(bbox[0])+(geoWidth*percent);

        bbox[2]=(bbox[2])+(geoWidth*percent);

        break;

      case "n":

        bbox[1]=(bbox[1])+(geoWidth*percent);

        bbox[3]=(bbox[3])+(geoWidth*percent);

        break;

      case "sw":

        bbox[1]=(bbox[1])-(geoWidth*percent);

        bbox[3]=(bbox[3])-(geoWidth*percent);

        bbox[0]=(bbox[0])-(geoWidth*percent);

        bbox[2]=(bbox[2])-(geoWidth*percent);

        break;

      case "se":

        bbox[1]=(bbox[1])-(geoWidth*percent);

        bbox[3]=(bbox[3])-(geoWidth*percent);

        bbox[0]=(bbox[0])+(geoWidth*percent);

        bbox[2]=(bbox[2])+(geoWidth*percent);

        break;

      case "s":

        bbox[1]=(bbox[1])-(geoWidth*percent);

        bbox[3]=(bbox[3])-(geoWidth*percent);

        break;

      case "w":

        bbox[0]=(bbox[0])-(geoWidth*percent);

        bbox[2]=(bbox[2])-(geoWidth*percent);

        break;

      case "e":

        bbox[0]=(bbox[0])+(geoWidth*percent);

        bbox[2]=(bbox[2])+(geoWidth*percent);

        break;

      default:

        break;

    }

    if(srs == "EPSG:4326") {

      if(bbox[0]<-180) {

        bbox[2]=bbox[2]-(bbox[0]+180);

        bbox[0]=-180;

      }

    }

    this.context.setBoundingBox(bbox);

  }



  /**

   * Render the pan icons.

   * This function should be called at startup.

   */

  this.paint=function(){

    s="<table border='1px'><tr>";

    s=s+"<td style=\"cursor:pointer\" onclick=\"panTool.panDir('nw')\" onmouseover=\"this.style.backgroundColor='silver'\" onmouseout=\"this.style.backgroundColor='white'\" title=\"Pan NorthWest\">NW</td>";

    s=s+"<td style=\"cursor:pointer\" onclick=\"panTool.panDir('n')\" onmouseover=\"this.style.backgroundColor='silver'\" onmouseout=\"this.style.backgroundColor='white'\" title=\"Pan North\">N</td>";

    s=s+"<td style=\"cursor:pointer\" onclick=\"panTool.panDir('ne')\" onmouseover=\"this.style.backgroundColor='silver'\" onmouseout=\"this.style.backgroundColor='white'\" title=\"Pan NorthEast\">NE</td>";

    s=s+"</tr><tr>";

    s=s+"<td style=\"cursor:pointer\" onclick=\"panTool.panDir('w')\" onmouseover=\"this.style.backgroundColor='silver'\" onmouseout=\"this.style.backgroundColor='white'\" title=\"Pan West\">W</td>";

    s=s+"<td></td>";

    s=s+"<td style=\"cursor:pointer\" onclick=\"panTool.panDir('e')\" onmouseover=\"this.style.backgroundColor='silver'\" onmouseout=\"this.style.backgroundColor='white'\" title=\"Pan East\">E</td>";

    s=s+"</tr><tr>";

    s=s+"<td style=\"cursor:pointer\" onclick=\"panTool.panDir('sw')\" onmouseover=\"this.style.backgroundColor='silver'\" onmouseout=\"this.style.backgroundColor='white'\" title=\"Pan SouthWat\">SW</td>";

    s=s+"<td style=\"cursor:pointer\" onclick=\"panTool.panDir('s')\" onmouseover=\"this.style.backgroundColor='silver'\" onmouseout=\"this.style.backgroundColor='white'\" title=\"Pan South\">S</td>";

    s=s+"<td style=\"cursor:pointer\" onclick=\"panTool.panDir('se')\" onmouseover=\"this.style.backgroundColor='silver'\" onmouseout=\"this.style.backgroundColor='white'\" title=\"Pan SouthEast\">SE</td>";

    s=s+"</tr></table>";

    this.node.innerHTML=s;

  }

}

