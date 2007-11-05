/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
/**
 * Builds then sends a WFS GetFeature GET request based on the WMC
 * coordinates and click point.
 * @constructor
 * @base ButtonBase
 * @author Cameron Shorter
 * @param widgetNode The XML node in the Config file referencing this object.
 * @param model The Context object which this tool is associated with.
 */
function WfsGetFeature(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

  this.widgetNode = widgetNode;
  // id of the transactionResponseModel
  this.trm = widgetNode.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue
  this.httpPayload = new Object({
    method: "get",
    postData: null
  });
  var typeNameNode = widgetNode.selectSingleNode('mb:typeName');
  if (typeNameNode != null) {
    this.typeName = typeNameNode.firstChild.nodeValue;
  }
  this.maxFeatures = widgetNode.selectSingleNode('mb:maxFeatures');
  this.maxFeatures = this.maxFeatures ? this.maxFeatures.firstChild.nodeValue : 1;
  this.webServiceUrl= widgetNode.selectSingleNode('mb:webServiceUrl').firstChild.nodeValue;
  this.webServiceUrl += this.webServiceUrl.indexOf("?") > -1 ? '&' : '?';
  
  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
  this.cursor = "pointer"; 

  this.createControl = function(objRef) {
  	var transactionResponseModel = config.objects[objRef.trm];
  	
    var Control = OpenLayers.Class( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.WfsGetFeature',
      type: OpenLayers.Control.TYPE_TOOL, // constant from OpenLayers.Control
  	  tolerance: new Number(objRef.widgetNode.selectSingleNode('mb:tolerance').firstChild.nodeValue),
  	  httpPayload: objRef.httpPayload,
  	  maxFeatures: objRef.maxFeatures,
  	  webServiceUrl: objRef.webServiceUrl,
  	  transactionResponseModel: transactionResponseModel,
  	  
      draw: function() {
        this.handler = new OpenLayers.Handler.Box( this,
          {done: this.selectBox}, {keyMask: this.keyMask} );
      },
      
      selectBox: function (position) {
        var bounds, minXY, maxXY;
        if (position instanceof OpenLayers.Bounds) {
        // it's a box
          minXY = this.map.getLonLatFromPixel(
            new OpenLayers.Pixel(position.left, position.bottom));
          maxXY = this.map.getLonLatFromPixel(
            new OpenLayers.Pixel(position.right, position.top));
        } else {
        // it's a pixel
          minXY = this.map.getLonLatFromPixel(
            new OpenLayers.Pixel(position.x-this.tolerance, position.y+this.tolerance));
          maxXY = this.map.getLonLatFromPixel(
            new OpenLayers.Pixel(position.x+this.tolerance, position.y-this.tolerance));
        }
        bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat, maxXY.lon, maxXY.lat);

      var typeName = objRef.typeName;

	  
	  var adminareaLayerName = "GCCS000A06A_E:PEI,ADMINISTRATIVEAREA:Quebec,GCCS000A06A_E:NWT,GCCS000A06A_E:Manitoba";
      var roadslayerName = "ROADSEG:Manitoba,ROADSEG:NWT,ROADSEG:Quebec,ROADSEG:PEI";
      var placesLayerName = "PLACENAME:Manitoba,PLACENAME:NWT,PLACENAME:PEI,PLACENAME:Quebec";
      
	    var queryList=objRef.targetModel.getQueryableLayers();
	    if (queryList.length==0) {
	      alert(mbGetMessage("noQueryableLayers"));
	      return;
	    }
	    else {
	      typeName = "";
	      for (var i=0; i<queryList.length; ++i) {
	        var layerNode=queryList[i];
	        var layerName=layerNode.firstChild.data;
	        var hidden = objRef.targetModel.getHidden(layerName);
	        if (hidden == 0) { //query only visible layers
	          if(layerName == adminareaLayerName)
	          {
	          	 typeName = "gb:AdministrativeArea";
	          }
	          else if(layerName == roadslayerName)
	          {
	          	 typeName = "gb:RoadSegment";
	          }
	          else if(layerName == placesLayerName)
	          {
	          	 typeName = "gb:PlaceName";
	          }
	        }
	      }
	    }


      if (typeName=="") {
        alert(mbGetMessage("noQueryableLayersVisible"));
        return;
      }
      
      var typeNamesArray = typeName.split(","); 
      
        // now create request url
        this.httpPayload.url = this.webServiceUrl+OpenLayers.Util.getParameterString({
          SERVICE: "WFS",
          VERSION: "1.0.0",
          REQUEST: "GetFeature",
          TYPENAME: typeNamesArray,
          MAXFEATURES: this.maxFeatures,
          BBOX: bounds.toBBOX()
        });
        this.transactionResponseModel.newRequest(this.transactionResponseModel, this.httpPayload);
      }
    });
    return Control;
  }
}
