/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");

/**
 * Implements WMS GetFeatureInfo functionality, popping up a query result
 * window when user clicks on map.
 * @constructor
 * @base ButtonBase
 * @author Nedjo
 * @constructor
 * @param toolNode The XML node in the Config file referencing this object.
 * @param model The widget object which this tool is associated with.
 */
function GetFeatureInfo(toolNode, model) {
  // Extend ButtonBase
  var base = new ButtonBase(this, toolNode, model);

  /** Xsl to build a GetFeatureInfo URL */
  this.xsl=new XslProcessor(baseDir+"/tool/GetFeatureInfo.xsl");
  
  /** Determine whether Query result is returned as HTML or GML */
  // TBD This should be stored in the Config file.
  //this.infoFormat="application/vnd.ogc.gml";
  this.infoFormat="text/html";

  /**
   * Open window with query info.
   * This function is called when user clicks map with Query tool.
   * @param objRef      Pointer to this GetFeatureInfo object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */

  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      var selectedLayer=objRef.context.getParam("selectedLayer");
      if (selectedLayer==null) {
        alert("Query layer not selected, select a queryable layer in the Legend.");
      }
      else {
        objRef.xsl.setParameter("queryLayer", selectedLayer);
        objRef.xsl.setParameter("xCoord", targetNode.evpl[0]);
        objRef.xsl.setParameter("yCoord", targetNode.evpl[1]);
        objRef.xsl.setParameter("infoFormat", objRef.infoFormat);
        objRef.xsl.setParameter("featureCount", "1");

        urlNode=objRef.xsl.transformNodeToObject(objRef.context.doc);
        url=urlNode.documentElement.firstChild.nodeValue;
        //alert("GetFeatureInfo: url="+url);

        if (objRef.infoFormat=="text/html"){
          window.open(url,'queryWin','height=200,width=300,scrollbars=yes');
        }
      }
    }
  }

  /**
   * Register for mouseUp events.
   * @param objRef  Pointer to this object.
   */
  this.setMouseListener = function(objRef) {
    if (objRef.mouseHandler) {
      objRef.mouseHandler.model.addListener('mouseup',objRef.doAction,objRef);
    }
    objRef.context=objRef.widgetNode.selectSingleNode("mb:context");
    if (objRef.context){
      objRef.context=eval("config.objects."+objRef.context.firstChild.nodeValue);
    }
  }
  config.addListener( "loadModel", this.setMouseListener, this );
}
