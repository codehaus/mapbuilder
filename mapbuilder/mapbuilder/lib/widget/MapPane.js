/*
Author:       Cameron Shorter cameronAtshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html
Dependancies: Context, Sarissa, XslProcessor

$Id$
*/

/**
 * Tools to build a MapPane from a Web Map Context.
 * @constructor
 * @param context The Web Map Context to use when building this MapPane.
 * @param baseDir The base mapbuilder lib directory.
 * @param window Not supported yet, writes to the current window.
 */
function MapPane(context,baseDir,window) {
  this.context=context;
  this.window=window;
  this.wmcLayer2DhtmlLayer=new XslProcessor(baseDir+"/mappane/WmcLayer2DhtmlLayer.xsl");

  /**
   * Create all the layers by rendering them into the current window.
   * This function should be called at startup.
   */
  this.paint=function() {
    s=this.wmcLayer2DhtmlLayer.transformNode(this.context.context);
    document.write(s);
    alert(s);
  }

  /**
   * Called when the context's hidden attribute changes.
   * @param e The event sent to the listener.
   */
  this.hiddenListener=function(e){
    //alert("Legend hiddenListener called with layer="+e.layerId);
  }

  this.context.addHiddenListener(this.hiddenListener);
}
