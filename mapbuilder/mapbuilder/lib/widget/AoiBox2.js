/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
Author:       Cameron Shorter cameronATshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/
// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/util/wz_jsgraphics/wz_jsgraphics.js");

/**
 * Render an Area Of Interest (AOI) Box over a map.
 * @constructor
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function AoiBox2(widgetNode, model) {
  // Inherit the WidgetBase functions and parameters
  var base = new WidgetBase(widgetNode, model,"absolute");
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 
  this.lineWidth = widgetNode.selectSingleNode("lineWidth").firstChild.nodeValue;
  this.lineColor = widgetNode.selectSingleNode("lineColor").firstChild.nodeValue;
  this.crossSize = widgetNode.selectSingleNode("crossSize").firstChild.nodeValue;

  this.node.style.position="absolute";
  this.node.visibility="hidden";
  this.node.style.height="250px";
  //this.node.style.top=this.node.parentNode.offsetTop;
  //this.node.style.left=this.node.parentNode.offsetLeft;
  //alert("node.parent.parent="+this.node.parentNode.parentNode.xml);

  /** WZ Graphics object and rendering functions. */
  this.jg=new jsGraphics(this.node.id);
  this.jg.setColor(this.lineColor);
  //this.jg.setStroke(this.lineWidth);

  /**
   * Render the widget.
   * @param objRef Pointer to this object.
   */
  this.paint = function(objRef) {
    objRef.jg.drawRect(0,0,120,55);
    objRef.jg.paint();
  }
}
