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
  
  // id of the transactionResponseModel
  this.trm = widgetNode.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue

  var httpPayload = new Object({
    method: "get",
    postData: null
  });
  
  var maxFeatures = widgetNode.selectSingleNode('mb:maxFeatures');
  maxFeatures = maxFeatures ? maxFeatures.firstChild.nodeValue : 1;
  var webServiceUrl= widgetNode.selectSingleNode('mb:webServiceUrl').firstChild.nodeValue;
  webServiceUrl += webServiceUrl.indexOf("?") > -1 ? '&' : '?';
  
  // properties for the custom OL control
  this.controlProperties = new Object({
  	tolerance: widgetNode.selectSingleNode('mb:tolerance').firstChild.nodeValue,
  	typeName: widgetNode.selectSingleNode('mb:typeName').firstChild.nodeValue,
	httpPayload: httpPayload,
	maxFeatures: maxFeatures,
	webServiceUrl: webServiceUrl });
	
  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
  //TBD this does nothing with MapPaneOL yet
  this.cursor = "pointer"; 

  this.createControl = function(objRef) {
    var Control = OpenLayers.Class.create();
    Control.prototype = OpenLayers.Class.inherit( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.WfsGetFeature',
      type: OpenLayers.Control.TYPE_TOOL, // constant from OpenLayers.Control
      transactionResponseModel: window.config.objects[this.trm],
      
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
        // now create request url
        this.httpPayload.url = this.webServiceUrl+OpenLayers.Util.getParameterString({
          SERVICE: "WFS",
          VERSION: "1.0.0",
          REQUEST: "GetFeature",
          TYPENAME: this.typeName,
          MAXFEATURES: this.maxFeatures,
          BBOX: bounds.toBBOX()
        });
        this.transactionResponseModel.newRequest(this.transactionResponseModel, this.httpPayload);
      },
    });
    return new Control(this.controlProperties);
  }
}
