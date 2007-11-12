/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
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
function GetFeatureInfo(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

  /** Xsl to build a GetFeatureInfo URL */
  this.xsl=new XslProcessor(baseDir+"/tool/GetFeatureInfo.xsl");
  
  /**
   * Determine whether Query result is returned as text, HTML or GML
   * This is usually text/plain, text/html or application/vnd.ogc.gml
   */
  var infoFormat = widgetNode.selectSingleNode("mb:infoFormat");
  this.infoFormat = infoFormat ? infoFormat.firstChild.nodeValue : "application/vnd.ogc.gml";

  // Get the value for featureCount from the configfile
  this.featureCount = 1;
  var featureCount = widgetNode.selectSingleNode("mb:featureCount");
  if (featureCount) this.featureCount = featureCount.firstChild.nodeValue;

  this.cursor = "pointer"; 

  /**
   * GetFeatureInfo control
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.GetFeatureInfo',
      type: OpenLayers.Control.TYPE_TOOL,
      draw: function() {
        this.handler = new OpenLayers.Handler.Box( this,
          {done: this.zoomBox}, {keyMask: this.keyMask} );
      },
      zoomBox: function(position) {
        var objRef = this.objRef
        if (objRef.enabled) {
          var x,y;
          if (position instanceof OpenLayers.Bounds) {
            x = position.left + (position.right - position.left) / 2;
            y = position.top + (position.bottom - position.top) / 2;
          } else {
            x = position.x;
            y = position.y;
          }
          objRef.targetModel.deleteTemplates();
          var selectedLayer=objRef.targetContext.getParam("selectedLayer");
          if (selectedLayer==null) {
            var queryList=objRef.targetContext.getQueryableLayers();
          	if (queryList.length==0) {
               alert(mbGetMessage("noQueryableLayers"));
               return;
          	}
            else {
              for (var i=0; i<queryList.length; ++i) {
                var layerNode=queryList[i];
                var layerName=layerNode.firstChild.data;
                var hidden = objRef.targetContext.getHidden(layerName);
                if (hidden == 0) { //query only visible layers
                  objRef.xsl.setParameter("queryLayer", layerName);
                  objRef.xsl.setParameter("layer",layerName);
    				      objRef.xsl.setParameter("xCoord", x);
                  objRef.xsl.setParameter("yCoord", y);
                  objRef.xsl.setParameter("infoFormat", objRef.infoFormat);
                  objRef.xsl.setParameter("featureCount", objRef.featureCount);
    
                  urlNode=objRef.xsl.transformNodeToObject(objRef.targetContext.doc);
                  url=urlNode.documentElement.firstChild.nodeValue;
                  httpPayload = new Object();
      	          httpPayload.url = url;
                  httpPayload.method="get";
                  httpPayload.postData=null;
                  objRef.targetModel.newRequest(objRef.targetModel,httpPayload);
                }
              }
            }
          }
          else {
            objRef.xsl.setParameter("queryLayer", selectedLayer);
            objRef.xsl.setParameter("layer",layerName);
            objRef.xsl.setParameter("xCoord", targetNode.x);
            objRef.xsl.setParameter("yCoord", targetNode.y);
            objRef.xsl.setParameter("infoFormat", objRef.infoFormat);
            objRef.xsl.setParameter("featureCount", "1");
  
            var urlNode=objRef.xsl.transformNodeToObject(objRef.targetContext.doc);
            var url=urlNode.documentElement.firstChild.nodeValue;
  
            if (objRef.infoFormat=="text/html"){
              window.open(url,'queryWin','height=200,width=300,scrollbars=yes');
            } else {
              var httpPayload = new Object();
              httpPayload.url = url;
              httpPayload.method="get";
              httpPayload.postData=null;
              objRef.targetModel.newRequest(objRef.targetModel,httpPayload);
            }
          }
        }
      }
    });
    return Control;
  }
}