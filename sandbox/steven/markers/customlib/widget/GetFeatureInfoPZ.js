/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id: GetFeatureInfoPZ.js 2937 2007-06-27 22:45:30Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
/**
 * Implements WMS GetFeatureInfo functionality, popping up a query result
 * window when user rightclicks on a map. It is to be used in combination with 
 * the PanZoomBar widget. Also you need to set the panZoom parameter to true for 
 * the context in your configuration.
 * @constructor
 * @base ButtonBase
 * @author Nedjo
 * @constructor
 * @param toolNode The XML node in the Config file referencing this object.
 * @param model The widget object which this tool is associated with.
 */
function GetFeatureInfoPZ(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

  /** Xsl to build a GetFeatureInfo URL */
  this.xsl=new XslProcessor(baseDir+"/tool/xsl/wms_GetFeatureInfo.xsl");
  
  /** Determine whether Query result is returned as HTML or GML */
  // TBD This should be stored in the Config file.
  this.infoFormat="application/vnd.ogc.gml";
  //this.infoFormat="text/plain";
  //this.infoFormat="text/html";
 /**
   * tolerance in pixels around the click point for WFS:GetFeature
   * default is 3
   */
  this.tolerance = parseFloat(this.getProperty("mb:tolerance", 3));
  // Get the value for featureCount from the configfile
  this.featureCount = 1;
  var featureCount = widgetNode.selectSingleNode("mb:featureCount");
  if (featureCount) this.featureCount = featureCount.firstChild.nodeValue;

  this.cursor = "pointer"; 
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.GetFeatureInfo',
      type: OpenLayers.Control.TYPE_TOOL,
      objRef: objRef });
      return Control;
    }
  

  /**
   * GetFeatureInfo control
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
   this.getFeatureInfo = function(objRef,e) {

     var targetContext = objRef.widgetNode.selectSingleNode("mb:targetContext");
    if (targetContext) {
      objRef.targetContext = window.config.objects[targetContext.firstChild.nodeValue];
      if ( !objRef.targetModel ) {
        alert(mbGetMessage("noTargetContext", targetContext.firstChild.nodeValue, objRef.id));
      }
    } else {
      objRef.targetContext = objRef.targetModel;
    }
         

    objRef.targetModel.evpl = [e.xy.x, e.xy.y];
          objRef.targetModel.deleteTemplates();
           var selectedLayer=objRef.targetContext.getParam("selectedLayer");
          if (selectedLayer==null) {
            var queryList=objRef.targetContext.getQueryableLayers();
            if (queryList.length==0) {
               alert(mbGetMessage("noQueryableLayers"));
               return;
            }
            else {
               //TODO dynamix
    var lonlat = config.objects.mainMap.map.getLonLatFromPixel(new OpenLayers.Pixel(e.xy.x,e.xy.y));
    var popup = new OpenLayers.Popup.AnchoredBubble(); 
    var contentHTML= '<div class="PopupContainer"><div class="PopupHeader">Info</div><div class="PopupContent"><div id="featurePopup"></div></div></div>';
    
         //new XMLSerializer().serializeToString('').replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");
    popup.initialize(null, lonlat, new OpenLayers.Size(210,130), contentHTML, true, true); 
    popup.setBackgroundColor('#f90');
    popup.setBorder('solid 1px black');
    var quadrant = config.objects.mainMap.map.getExtent().determineQuadrant(lonlat);
    var lonOffset = quadrant.charAt(1) == 'r' ? -5 : 5;
    var latOffset = quadrant.charAt(0) == 't' ? 5 : -5;
    popup.anchor = { size: new OpenLayers.Size(0,0), offset: new OpenLayers.Pixel(lonOffset, latOffset)};    
 
 
    config.objects.mainMap.map.addPopup(popup, true);
    
    var llPx = e.xy.add(-objRef.tolerance, objRef.tolerance);
    var urPx = e.xy.add(objRef.tolerance, -objRef.tolerance);
    
    var ll = objRef.targetContext.map.getLonLatFromPixel(llPx);
    var ur = objRef.targetContext.map.getLonLatFromPixel(urPx);
    
              for (var i=0; i<queryList.length; ++i) {
                var layerNode = queryList[i];
                
                // Get the name of the layer
                var layerName = Mapbuilder.getProperty(layerNode, "wmc:Name", "");
                if (layerName == "hoogtes") queryLayerName="hoogte";
                else queryLayerName=layerName;
             // Get the layerId. Fallback to layerName if non-existent
                var layerId = layerNode.getAttribute("id") || layerName;

                var hidden = objRef.targetContext.getHidden(layerId);
                if (hidden == 0) { //query only visible layers
                  objRef.xsl.setParameter("queryLayer", queryLayerName);
                  objRef.xsl.setParameter("layer",layerName);
                  objRef.xsl.setParameter("bBoxMinX", ll.lon);
                  objRef.xsl.setParameter("bBoxMinY", ll.lat);
                  objRef.xsl.setParameter("bBoxMaxX", ur.lon);
                  objRef.xsl.setParameter("bBoxMaxY", ur.lat);
                  objRef.xsl.setParameter("srs", 'epsg:900913');
                  objRef.xsl.setParameter("width", '6');
                  objRef.xsl.setParameter("height", '6');
                  objRef.xsl.setParameter("version", '1.1.0');
                  
 //                 objRef.xsl.setParameter("xCoord", x);
   //               objRef.xsl.setParameter("yCoord", y);
                  objRef.xsl.setParameter("infoFormat", objRef.infoFormat);
                  objRef.xsl.setParameter("featureCount", objRef.featureCount);
    
                  urlNode=objRef.xsl.transformNodeToObject(objRef.targetContext.doc);
                  url=getNodeValue(urlNode.documentElement);
                  url = url.replace('tilecache.py','cgi-bin/edugis/mapserv.cgi');
                  httpPayload = new Object();
                  httpPayload.url = url;
                  httpPayload.method="get";
                  httpPayload.postData=null;
                  objRef.targetModel.newRequest(objRef.targetModel,httpPayload);
                  
 //                 
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
        this.model.addListener("rightMouseup",this.getFeatureInfo, this );
}