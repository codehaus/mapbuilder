/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: AoiBoxDHTML.js,v 1.2 2008/03/18 09:59:16 terral Exp $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to draw an Area Of Interest box of a model.  The box can be drawn with
 * the paint() method and is registered as a listener of the context AOI property.
 * This object works entirely in pixel/line coordinate space and knows nothing
 * about geography.  This widget uses DHTML methods to draw the box.  Since it
 * does not support a targetModel property, it has to be defined as a child widget
 * of the context of the map that the box should be drawn into.
 * WARNING: This widget cannot be used in maps that use button controls.
 * Button controls take care of aoi handling themselves.
 * It is designed for use in locator map setups only.
 * See also MAP-312
 * @deprecated
 * @constructor
 * @base WidgetBase
 * @param widgetNode The node for this object from the Config file.
 * @param model The model that contains this object.
 */
function AoiBoxOL(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));

  this.cursor = 'crosshair';

  /**
   * Interactive ZoomOut control.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.AoiBoxOL',
      type: OpenLayers.Control.TYPE_TOOL,

      draw: function() {
        this.handler = new OpenLayers.Handler.Box( this,
              {done: this.aoiBox}, {keyMask: this.keyMask} );
		
      },

      aoiBox: function (position) {
        if (position instanceof OpenLayers.Bounds) {
          var minXY = this.map.getLonLatFromPixel(
               new OpenLayers.Pixel(position.left, position.bottom));
          var maxXY = this.map.getLonLatFromPixel(
               new OpenLayers.Pixel(position.right, position.top));
          var bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,
               maxXY.lon, maxXY.lat);         
        }
        else{
          var XY = this.map.getLonLatFromPixel(
               new OpenLayers.Pixel(position.x, position.y));
          var bounds = new OpenLayers.Bounds(XY.lon, XY.lat,
               XY.lon,XY.lat);
        }
          var bboxOL = bounds.toBBOX().split(',');
          var ul = new Array(bboxOL[0],bboxOL[3]);
          var lr = new Array(bboxOL[2],bboxOL[1]);
          objRef.model.setParam("aoi", new Array(ul, lr));
      }
    });
 
    return Control;
  }
 
 this.init = function(objRef) {
	var Control = objRef.createControl(objRef);
	var ct=new Control();
   objRef.model.map.addControl(ct);
	ct.activate();	
  }
  
  this.model.addListener("loadModel",this.init, this); 
  /**
   * Draws a bounding box around the current AOI.
   * @param objRef reference to this widget
   */
  this.drawAoiBox = function(objRef) {
	if(objRef.model.map){
		var ext = objRef.model.getParam('aoi');
		var bounds = new OpenLayers.Bounds(ext[0][0], ext[1][1], ext[1][0], ext[0][1]);
		objRef.model.aoiBoxLayer = new OpenLayers.Layer.Boxes('Boxes');
		objRef.model.map.addLayer(objRef.model.aoiBoxLayer);
		var box = new OpenLayers.Marker.Box(bounds);
		objRef.model.aoiBoxLayer.addMarker(box);
	}
  } 
  /**
   * Clears the AOI box.
   * @param objRef reference to this widget
   */
  this.clearAoiBox = function(objRef) {
    if (objRef.model.aoiBoxLayer) {
      objRef.model.aoiBoxLayer.destroy();
    }  
  }
	
    // adds a listener to the context to clear the AOI box when AOI changes
    this.model.addListener('aoi', this.clearAoiBox, this);
    this.model.addListener('aoi', this.drawAoiBox, this);
}