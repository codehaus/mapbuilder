/*

License: GPL as per: http://www.gnu.org/copyleft/gpl.html

Dependancies: Context

$Id$

*/



// Ensure this object's dependancies are loaded.

mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");



/**

 * Implements WMS GetFeatureInfo functionality, popping up a query result

 * window when user clicks on map.

 * @constructor

 * @author Nedjo

 * @constructor

 * @param objRef      Pointer to this Query object.

 * @param targetNode  The node for the enclosing HTML tag for this widget.

 */

function GetFeatureInfo(toolNode, parentWidget) {

  var base = new ButtonBase(toolNode, parentWidget);

  for (sProperty in base) { 

    this[sProperty] = base[sProperty];    

  } 



  /** Xsl to build a GetFeatureInfo URL */

  this.xsl=new XslProcessor(baseDir+"/tool/GetFeatureInfo.xsl");



  /**

   * Open window with query info.

   * This function is called when user clicks map with Query tool.

   * @param objRef      Pointer to this GetFeatureInfo object.

   * @param targetNode  The node for the enclosing HTML tag for this widget.

   */

  this.doAction = function(objRef,targetNode) {

    if (objRef.enabled) {

      var queryLayer=objRef.targetModel.getParam("queryLayer");

      if (queryLayer==null) {

        alert("Query layer not selected, select a queryable layer in the Legend.");

      }

      else {

        Sarissa.setXslParameter(

          objRef.xsl.xslDom,

          "queryLayer", "'"+queryLayer+"'");

        Sarissa.setXslParameter(

          objRef.xsl.xslDom,

          "xCoord", "'"+targetNode.evpl[0]+"'");

        Sarissa.setXslParameter(

          objRef.xsl.xslDom,

          "yCoord", "'"+targetNode.evpl[1]+"'");



        s=objRef.xsl.transformNode(objRef.targetModel.doc);

        s = s.replace(new RegExp("&amp;","g"),"&");

        window.open(s,'queryWin','height=200,width=300,scrollbars=yes');

      }

    }

  }



  if (this.mouseHandler) {

    this.mouseHandler.addListener('mouseup',this.doAction,this);

  }

}

