/*

License: GPL as per: http://www.gnu.org/copyleft/gpl.html

Dependancies: Context

$Id$

*/



/**

 * Implements WMS GetFeatureInfo functionality, popping up a query window when user clicks on map.

 * @constructor

 * @author Nedjo

 * @constructor

 * @requires Context

 * @param context The Web Map Context to call when changing extent.

 */

function FeatureInfo(context) {

  this.context=context;

  this.context2FeatureInfo=new XslProcessor(this.context.baseDir+"/widget/tool/Context2FeatureInfo.xml");

  /**

   * Open window with query info.

   * This function is called when user clicks map with GetFeatureInfo tool.

   */

  this.get=function(evpl){

    Sarissa.setXslParameter(

      this.context2FeatureInfo.xslDom,

      "queryLayer", "'"+this.context.queryLayer+"'");

    Sarissa.setXslParameter(

      this.context2FeatureInfo.xslDom,

      "xCoord", "'"+evpl[0]+"'");

    Sarissa.setXslParameter(

      this.context2FeatureInfo.xslDom,

      "yCoord", "'"+evpl[1]+"'");

    s=this.context2FeatureInfo.transformNode(this.context.context);



    s = s.replace(new RegExp("&amp;","g"),"&");

    openPopup(unescape(s), 300, 200);

  }

}

