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
function ZoomTool(widgetNode) {
  var base = new WidgetBase(widgetNode);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  this.zoomBy = 4; //TBD: get this from config

  this.handleEvent=function(evt){
    switch(returnTarget(evt).getAttribute("id")){
      case 'zoomIn':
        this.zoomIn(evt);
        break;
    }
  }

  /**
   * Zoom in (reset the BoundingBox).
   */
  this.zoomIn=function() {
    var extent = this.model.extent;
    this.model.extent.CenterAt(extent.GetCenter(), extent.res[0]/this.zoomBy);
  }
  /**
   * Render the zoom icons.
   * This function should be called at startup.
   * or generate this from a stylesheet
   */
  this.paint=function() {
    img=document.createElement("img");
    img.style.cursor="pointer";
    img.setAttribute("src", config.skinDir+"/images/zoomIn.gif");
    img.setAttribute("id", "zoomIn");
    img.onclick = this.zoomIn;
    //img.ownerObj=this;
    //addEvent(img, "click", handleEventWithObject);
    this.node.appendChild(img);
    
  }
}


