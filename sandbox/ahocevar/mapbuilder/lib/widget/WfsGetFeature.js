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
  this.tolerance= widgetNode.selectSingleNode('mb:tolerance').firstChild.nodeValue;
  this.typeName= widgetNode.selectSingleNode('mb:typeName').firstChild.nodeValue;
  this.webServiceUrl= widgetNode.selectSingleNode('mb:webServiceUrl').firstChild.nodeValue;
  this.webServiceUrl += this.webServiceUrl.indexOf("?") > -1 ? '&' : '?';
  this.httpPayload=new Object();
  this.httpPayload.method="get";
  this.httpPayload.postData=null;
  this.trm=widgetNode.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue;
  this.maxFeatures = widgetNode.selectSingleNode('mb:maxFeatures');
  this.maxFeatures = this.maxFeatures ? this.maxFeatures.firstChild.nodeValue : 1;

  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
  //TBD this does nothing with MapPaneOL yet
  this.cursor = "pointer"; 

  this.createControl = function(objRef) {
    var Control = OpenLayers.Class.create();
    Control.prototype = OpenLayers.Class.inherit( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.WfsGetFeature',
      type: OpenLayers.Control.TYPE_TOOL, // constant from OpenLayers.Control
      
      // properties from this widget
      tolerance: this.tolerance/2,
      typeName: this.typeName,
      maxFeatures: this.maxFeatures,
      webServiceUrl: this.webServiceUrl,
      httpPayload: this.httpPayload,
      trm: window.config.objects[objRef.trm],
      
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
            new OpenLayers.Pixel(position.x-this.tolerance, position.y-this.tolerance));
          maxXY = this.map.getLonLatFromPixel(
            new OpenLayers.Pixel(position.x+this.tolerance, position.y+this.tolerance));
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
        this.trm.newRequest(this.trm, this.httpPayload);
      },
    });
    return new Control();
  }
}
