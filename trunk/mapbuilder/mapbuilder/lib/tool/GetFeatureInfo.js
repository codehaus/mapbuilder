/*

License: GPL as per: http://www.gnu.org/copyleft/gpl.html

Dependancies: Context

$Id$

*/



// Ensure this object's dependancies are loaded.

mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");

mapbuilder.loadScript(baseDir+"/util/Proxy.js");



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

  this.xsl=Sarissa.getDomDocument();

  this.xsl.async=false;

  this.xsl.load(baseDir+"/tool/GetFeatureInfo.xsl");



  /** Proxy for requesting external URLs. */

  this.proxy=new Proxy();



  /** Determine whether Query result is returned as HTML or GML */

  // TBD This should be stored in the Config file.

  this.infoFormat="application/vnd.ogc.gml";

  //this.infoFormat="text/html";



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

          objRef.xsl,

          "queryLayer", "'"+queryLayer+"'");

        Sarissa.setXslParameter(

          objRef.xsl,

          "xCoord", "'"+targetNode.evpl[0]+"'");

        Sarissa.setXslParameter(

          objRef.xsl,

          "yCoord", "'"+targetNode.evpl[1]+"'");

        Sarissa.setXslParameter(

          objRef.xsl,

          "infoFormat", "'"+objRef.infoFormat+"'");



        urlNode=Sarissa.getDomDocument();

        objRef.targetModel.doc.transformNodeToObject(objRef.xsl,urlNode);



        if (objRef.infoFormat=="text/html"){

          alert("url="+url);

          window.open(url,'queryWin','height=200,width=300,scrollbars=yes');

        }else{

          url=objRef.proxy.getUrl(urlNode.documentElement.firstChild.nodeValue);

          alert("url="+url);

          // Load the Query result

          result=Sarissa.getDomDocument();

          result.async=false;

          result.load(url);

          alert("query result="+result.xml);

        }

      }

    }

  }



  if (this.mouseHandler) {

    this.mouseHandler.addListener('mouseup',this.doAction,this);

  }

}

