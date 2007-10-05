/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: SetAoi.js 3052 2007-08-01 21:25:21Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");

/**
 * Set AOI button.
 * @base ButtonBase
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param widgetNode      The tool node from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function SetAoi(widgetNode, model) {
   ButtonBase.apply(this, new Array(widgetNode, model));

  this.cursor = 'crosshair';

  /**
   * Interactive ZoomOut control.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.SetAoi',
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
          var bboxOL = bounds.toBBOX().split(',');
          var ul = new Array(bboxOL[0],bboxOL[3]);
          var lr = new Array(bboxOL[2],bboxOL[1]);
          objRef.targetContext.setParam("aoi", new Array(ul, lr));
          objRef.drawAoiBox(objRef);
        }
      }
    });
 
    // adds a listener to the context to clear the AOI box when AOI changes
    this.targetContext.addListener('aoi', this.clearAoiBox, this);

    return Control;
  }

  /**
   * Draws a bounding box around the current AOI.
   * @param objRef reference to this widget
   */
  this.drawAoiBox = function(objRef) {
    var ext = objRef.targetContext.getParam('aoi');
    var bounds = new OpenLayers.Bounds(ext[0][0], ext[1][1], ext[1][0], ext[0][1]);
    objRef.targetContext.aoiBoxLayer = new OpenLayers.Layer.Boxes('Boxes');
    objRef.targetContext.map.addLayer(objRef.targetContext.aoiBoxLayer);
    var box = new OpenLayers.Marker.Box(bounds);
    objRef.targetContext.aoiBoxLayer.addMarker(box);
  }
  
  /**
   * Clears the AOI box.
   * @param objRef reference to this widget
   */
  this.clearAoiBox = function(objRef) {
    if (objRef.targetContext.aoiBoxLayer) {
      objRef.targetContext.aoiBoxLayer.destroy();
    }  
  }
}