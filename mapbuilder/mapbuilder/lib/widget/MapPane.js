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

  this.move=function(left,top) {
    this.node.style.left=left;
    this.node.style.top=top;
  }
  this.resize=function(width,height) {
    this.node.style.width=width;
    this.node.style.height=height;
  }

  /**
   * Create all the layers by rendering them into the current window.
   * This function should be called at startup.
   */
  this.paint=function() {
    // Set the coordinates of the mapImage for the xsl
// These calls disabled here since shouldn't offset
// from absolutely positioned containing div
//    Sarissa.setXslParameter(
//      this.wmcLayer2DhtmlLayer.xslDom,
//      "left",
//      String(getAbsX(this.node)-1));
//    Sarissa.setXslParameter(
//     this.wmcLayer2DhtmlLayer.xslDom,
//      "top",
//      String(getAbsY(this.node)-1));

//  This method not yet functional--likely because XSL is returning incorrect
//  object.

//    result=this.wmcLayer2DhtmlLayer.transformNodeToObject(this.context.context);
//    this.node.appendChild(result);

//  So, in meantime, return string instead...
    s=this.wmcLayer2DhtmlLayer.transformNode(this.context.context);
    this.node.innerHTML=s;

    this.setClip();
   }
   this.setClip=function(){
     width=this.context.context.getWindowWidth();
     height=this.context.context.getWindowHeight();
     this.node.style.clip="rect(0," + width + "," + height + ",0)";
   }
   this.moveImages=function(left,top){
    images=this.node.firstChild.getElementsByTagName("IMG");
    for(i=0;i<images.length;i++){
      img=images.item(i);
      img.style.left=left;
      img.style.top=top;
    }
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
