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
 * @param window Not supported yet, writes to the current window.
 */
function MapPane(context,window) {
  this.context=context;
  this.window=window;
  this.wmcLayer2DhtmlLayer=new XslProcessor("../widget/mappane/WmcLayer2DhtmlLayer.xsl");

  /**
   * Create all the layers by rendering them into the current window.
   * This function should be called at startup.
   */
  this.createLayers=function() {
    s=this.wmcLayer2DhtmlLayer.transformNode(
      this.context.context,this.window);
    document.write(s);
  }
}
