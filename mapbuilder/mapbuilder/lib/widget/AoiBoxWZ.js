/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
Author:       Cameron Shorter cameronATshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/
// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
mapbuilder.loadScript(baseDir+"/util/wz_jsgraphics/wz_jsgraphics.js");

/**
 * Render an Area Of Interest (AOI) Box over a map.
 * This widget extends GmlRenderer and uses GmlRenderer.xsl to build the HTML box.
 * @constructor
 * @base GmlRenderer
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function AoiBoxWZ(widgetNode, model) {
  // Inherit the MapContainerBase functions and parameters
  var base = new MapContainerBase(this,widgetNode, model);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  this.lineWidth = widgetNode.selectSingleNode("mb:lineWidth").firstChild.nodeValue;
  this.lineColor = widgetNode.selectSingleNode("mb:lineColor").firstChild.nodeValue;
  this.crossSize = widgetNode.selectSingleNode("mb:crossSize").firstChild.nodeValue;

  //this.node.style.position="absolute";
  //this.node.visibility="hidden";

  //look for this widgets output and replace if found, otherwise append it
  var tempNode = document.createElement("DIV");
  tempNode.innerHTML="<DIV/>";
  tempNode.firstChild.setAttribute("id", this.mbWidgetId);
  tempNode.firstChild.style.position="absolute";
  //tempNode.firstChild.visibility="hidden";
  var outputNode = document.getElementById( this.mbWidgetId );
  if (outputNode) {
    this.node.replaceChild(tempNode.firstChild,outputNode);
  } else {
    this.node.appendChild(tempNode.firstChild);
  }
 
  // WZ Graphics object and rendering functions.
  this.jg=new jsGraphics(this.node.id);
  this.jg.setColor(this.lineColor);
  this.jg.setColor("#00FF00");
  /*
  */

  //TBD: The following causes lines to be drawn incorrectly in Mozilla 1.71
  //this.jg.setStroke(this.lineWidth);

  /**
   * Render the widget.
   * If the box width or height is less than the cross size, then draw a cross,
   * otherwise draw a box.
   * @param objRef Pointer to this object.
   */
  this.paint = function(objRef) {
    aoiBox = objRef.model.getParam("aoi");
    if (aoiBox) {
      ul = objRef.model.extent.getPL(aoiBox[0]);
      lr = objRef.model.extent.getPL(aoiBox[1]);
      width= lr[0]-ul[0];
      height= lr[1]-ul[1];

      objRef.jg.clear();

      //check if ul=lr, then draw cross, else drawbox
      if ((width < objRef.crossSize) && (height < objRef.crossSize) ) {
        // draw cross
        x=(lr[0]+ul[0])/2;
        y=(lr[1]+ul[1])/2;
        c=objRef.crossSize/2;
        objRef.jg.drawLine(x+c,y,x-c,y);
        objRef.jg.drawLine(x,y+c,x,y-c);
      } else {
        // draw box
        //TBD the following line seems to disable the mouseup event in Mozilla
        objRef.jg.drawRect(ul[0],ul[1],width,height);
      }
      objRef.jg.paint();
    }
  }
  model.addListener("aoi",this.paint, this);
}
