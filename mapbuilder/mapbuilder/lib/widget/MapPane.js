/*
Author:       Cameron Shorter cameronAtshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

/**
 * Tools to build a MapPane from a Web Map Context.
 * @constructor
 * @param context The Web Map Context to use when building this MapPane.
 * @param baseDir The base mapbuilder lib directory.
 * @param node Node from the HTML DOM to insert legend HTML into.
 * @requires Context, Sarissa, Util
 */
function MapPane(context,baseDir,node) {
  this.context=context;
  this.node=node;
  this.wmcLayer2DhtmlLayer=new XslProcessor(baseDir+"/mappane/WmcLayer2DhtmlLayer.xml");
  Sarissa.setXslParameter(
    this.wmcLayer2DhtmlLayer.xslDom,
    "baseDir", "'"+baseDir+"'");

  /**
   * Create all the layers by rendering them into the current window.
   * This function should be called at startup.
   */
  this.paint=function() {
    // Set the coordinates of the mapImage for the xsl
    Sarissa.setXslParameter(
      this.wmcLayer2DhtmlLayer.xslDom,
      "left",
      String(getAbsX(this.node)-1));
    Sarissa.setXslParameter(
      this.wmcLayer2DhtmlLayer.xslDom,
      "top",
      String(getAbsY(this.node)-1));

    s=this.wmcLayer2DhtmlLayer.transformNode(this.context.context);
    this.node.innerHTML=s;
   }

  /**
   * Called when the context's hidden attribute changes.
   * @param e The event sent to the listener.
   */
  this.hiddenListener=function(e){
    var vis="visible";
    if (e.hidden) {
      vis="hidden";
    }
    document.getElementById(e.layerId).style.visibility=vis;
  }

  this.context.addHiddenListener(this.hiddenListener);
}
