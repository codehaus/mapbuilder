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
 * @param window Not supported yet, writes to the current window.
 */
function Legend(context,baseDir,window) {
  this.context=context;
  this.window=window;
  this.context2Legend=new XslProcessor(baseDir+"/legend/Context2Legend.xsl");

  /**
   * Render the legend.
   * This function should be called at startup.
   */
  this.paint=function(){
    s=this.context2Legend.transformNode(this.context.context);
    document.write(s);
  }
}
