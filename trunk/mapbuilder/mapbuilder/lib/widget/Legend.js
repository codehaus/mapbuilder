/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
Dependancies: Sarissa (XML utilities).
$Id$
*/

/**
 * Functions to render and update a Legend from a Web Map Context.
 * @constructor
 * @author Cameron Shorter cameronATshorter.net
 * @constructor
 * @param context The Web Map Context which contains the state of this legend.
 * @param baseDir The base mapbuilder lib directory.
 * @param node Node from the HTML DOM to insert legend HTML into.
 */
function Legend(context,baseDir,node) {
  this.context=context;
  this.node=node;
  this.context2Legend=new XslProcessor(baseDir+"/legend/Context2Legend.xml");

  /**
   * Render the legend.
   * This function should be called at startup.
   */
  this.paint=function(){
    s=this.context2Legend.transformNode(this.context.context);
    this.node.innerHTML=s;
  }

  /**
   * Called when the context's hidden attribute changes.
   * @param e The event sent to the listener.
   */
  this.hiddenListener=function(e){
    //alert("MapPane hiddenListener called with layer="+e.layerId);
  }

  this.context.addHiddenListener(this.hiddenListener);
}
