/*
Author:       Cameron Shorter cameronAtshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

/**
 * Tools to build a MapPane from a Web Map Context.
 * @constructor
 * @param context The Web Map Context to use when building this MapPane.
 * @param name Variable name referencing this MapPane object
 * @param node Node from the HTML DOM to insert legend HTML into.
 * @requires Context
 * @requires Sarissa
 * @requires Util
 */
function MapPane(context, name, node) {
  this.context=context;
  this.name=name;
  if(node==null){
    node=makeElt("DIV");
    node.style.position="absolute";
  }
  this.node=node;
  this.wmcLayer2DhtmlLayer=new XslProcessor(this.context.baseDir+"/mappane/Context2MapPane.xml");
  Sarissa.setXslParameter(
    this.wmcLayer2DhtmlLayer.xslDom,
    "baseDir", "'"+this.context.baseDir+"'");
  Sarissa.setXslParameter(
    this.wmcLayer2DhtmlLayer.xslDom,
    "context", "'"+this.context.name+"'");

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

    // This method not yet functional--likely because XSL is returning incorrect object.

    // result=this.wmcLayer2DhtmlLayer.transformNodeToObject(this.context.context);
    // this.node.appendChild(result.documentElement);

    //  So, in meantime, return string instead...
    s=this.wmcLayer2DhtmlLayer.transformNode(this.context.context);
    this.node.innerHTML=s;

    this.setClip();
   }

   /**
    * TBD: Comment me.
    */
   this.setClip=function(){
     width=this.context.getWindowWidth();
     height=this.context.getWindowHeight();
     this.node.style.clip="rect(0," + width + "," + height + ",0)";
   }

   /**
    * TBD: Comment me.
    */
   this.moveImages=function(left,top){
    images=this.node.firstChild.getElementsByTagName("img");
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
    document.getElementById(e.layerIndex).style.visibility=vis;
  }

  this.context.addHiddenListener(this.hiddenListener);


  /**
   * Called when the context's boundingBox attribute changes.
   * @param e The event sent to the listener.
   */
  this.boundingBoxChangeListener=function(target){
    target.paint();
  }

  this.context.addBoundingBoxChangeListener(this.boundingBoxChangeListener,this);
}
