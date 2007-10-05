/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ZoomOut.js 3052 2007-08-01 21:25:21Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");

/**
 * Zoom Out button.
 * @base ButtonBase
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param widgetNode      The tool node from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function ZoomOut(widgetNode, model) {
   ButtonBase.apply(this, new Array(widgetNode, model));

  this.cursor = 'crosshair';

  /**
   * Interactive ZoomOut control.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.ZoomOut',
      type: OpenLayers.Control.TYPE_TOOL,

      draw: function() {
        this.handler = new OpenLayers.Handler.Box( this,
          {done: this.zoomBox}, {keyMask: this.keyMask} );
      },

      zoomBox: function (position) {
        if (position instanceof OpenLayers.Bounds) {
          var minXY = new OpenLayers.Pixel(position.left, position.bottom);
          var maxXY = new OpenLayers.Pixel(position.right, position.top);
          var bounds = new OpenLayers.Bounds(minXY.x, minXY.y,
            maxXY.x, maxXY.y);
          var mapSize = (this.map.getSize().w+this.map.getSize().h)/2;
          var boxSize = (Math.abs(bounds.getWidth())+Math.abs(bounds.getHeight()))/2;
          var newScale = this.map.getScale()*(mapSize/boxSize);
          this.map.setCenter(bounds.getCenterLonLat());
          this.map.zoomToScale(newScale);
        } else { // it's a pixel
          this.map.setCenter(this.map.getLonLatFromPixel(position),
            this.map.getZoom() - 1);
        }
      }
    });
    return Control;
  }
}


