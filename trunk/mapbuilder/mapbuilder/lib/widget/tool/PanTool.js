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
      case "w":
        bbox[0]=(bbox[0])-(geoWidth*percent);
        bbox[2]=(bbox[2])-(geoWidth*percent);
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
    s="<table border='1px'><tr><td>NW</td><td>N</td><td>NE</td></tr><tr><td style=\"cursor:pointer\" onclick=\"panTool.panDir('w')\" onmouseover=\"this.style.backgroundColor='silver'\" onmouseout=\"this.style.backgroundColor='white'\" title=\"Pan West\">W</td><td></td><td>E</td></tr><tr><td>SW</td><td>S</td><td>SE</td></tr></table>";
    this.node.innerHTML=s;
  }
}
