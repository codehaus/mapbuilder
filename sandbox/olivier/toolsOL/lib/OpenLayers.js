/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

////
/// This blob sucks in all the files in uncompressed form for ease of use
///

OpenLayers = new Object();

OpenLayers._scriptName = ( 
    typeof(_OPENLAYERS_SFL_) == "undefined" ? "lib/OpenLayers.js" 
                                            : "OpenLayers.js" );

OpenLayers._getScriptLocation = function () {
    var scriptLocation = "";
    var SCRIPT_NAME = OpenLayers._scriptName;
 
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute('src');
        if (src) {
            var index = src.lastIndexOf(SCRIPT_NAME); 
            // is it found, at the end of the URL?
            if ((index > -1) && (index + SCRIPT_NAME.length == src.length)) {  
                scriptLocation = src.slice(0, -SCRIPT_NAME.length);
                break;
            }
        }
    }
    return scriptLocation;
}

/*
  `_OPENLAYERS_SFL_` is a flag indicating this file is being included
  in a Single File Library build of the OpenLayers Library.

  When we are *not* part of a SFL build we dynamically include the
  OpenLayers library code.

  When we *are* part of a SFL build we do not dynamically include the 
  OpenLayers library code as it will be appended at the end of this file.
*/
if (typeof(_OPENLAYERS_SFL_) == "undefined") {
    /*
      The original code appeared to use a try/catch block
      to avoid polluting the global namespace,
      we now use a anonymous function to achieve the same result.
     */
    (function() {
    var jsfiles=new Array(
        "OpenLayers/BaseTypes.js",
        "OpenLayers/Util.js",
        "Rico/Corner.js",
        "Rico/Color.js",
        "OpenLayers/Ajax.js",
        "OpenLayers/Events.js",
        "OpenLayers/Map.js",
        "OpenLayers/Layer.js",
        "OpenLayers/Icon.js",
        "OpenLayers/Marker.js",
        "OpenLayers/Tile.js",
        "OpenLayers/Feature.js",
        "OpenLayers/Tile/Image.js",
        "OpenLayers/Tile/WFS.js",
        "OpenLayers/Attributes.js",
        "OpenLayers/Attributes/GML.js",
        "OpenLayers/Layer/Image.js",
        "OpenLayers/Layer/EventPane.js",
        "OpenLayers/Layer/FixedZoomLevels.js",
        "OpenLayers/Layer/HTTPRequest.js",
        "OpenLayers/Layer/Grid.js",
        "OpenLayers/Layer/MapServer.js",
        "OpenLayers/Layer/Markers.js",
        "OpenLayers/Layer/Text.js",
        "OpenLayers/Layer/WMS.js",
        "OpenLayers/Layer/WMS/Untiled.js",
        "OpenLayers/Layer/Vector.js",
        "OpenLayers/Layer/WFS.js",
        "OpenLayers/Layer/GML.js",
         "OpenLayers/Layer/Google.js",
        "OpenLayers/Layer/WMS/Untiled.js",
        "OpenLayers/Layer/GeoRSS.js",
        "OpenLayers/Layer/Boxes.js",
        "OpenLayers/Layer/Canvas.js",
        "OpenLayers/Layer/TMS.js",
        "OpenLayers/Popup.js",
        "OpenLayers/Popup/Anchored.js",
        "OpenLayers/Popup/AnchoredBubble.js",
      "OpenLayers/MouseListener.js",
        "OpenLayers/MouseListener/AutoPan.js",
        "OpenLayers/MouseListener/MouseDefaults.js",
        "OpenLayers/MouseListener/EditingListener.js",
        "OpenLayers/MouseListener/EditingListener/Selection.js",
        "OpenLayers/MouseListener/EditingListener/DrawPoint.js",
        "OpenLayers/MouseListener/EditingListener/DrawLineString.js",
        "OpenLayers/MouseListener/EditingListener/DrawMultiLineString.js",
        "OpenLayers/MouseListener/EditingListener/DrawLinearRing.js",
        "OpenLayers/MouseListener/EditingListener/DrawPolygon.js",
        "OpenLayers/MouseListener/EditingListener/DrawMultiPolygon.js",
        "OpenLayers/MouseListener/EditingListener/MovePathPoint.js",
        "OpenLayers/MouseListener/EditingListener/AddPathPoint.js",
        "OpenLayers/MouseListener/EditingListener/RemovePathPoint.js",
        "OpenLayers/MouseListener/MeasureDistance.js",
        "OpenLayers/MouseListener/Reset.js",
        "OpenLayers/MouseListener/MeasureArea.js",
        "OpenLayers/Control.js",
        "OpenLayers/Control/Container.js",
        "OpenLayers/MouseListener/ZoomIn.js",
    	"OpenLayers/MouseListener/ZoomOut.js",
    	"OpenLayers/MouseListener/DragPan.js",
        "OpenLayers/Control/Button.js",
        "OpenLayers/Control/RadioButton.js",
        "OpenLayers/Control/ButtonBar.js",
        "OpenLayers/Control/MousePosition.js",
        "OpenLayers/Control/EditingToolBar.js",
        "OpenLayers/Control/MouseToolBar.js",
        "OpenLayers/Control/LayerSwitcher.js",
        "OpenLayers/Control/EditingAttributes.js",
        "OpenLayers/Control/EditingMode.js",
        "OpenLayers/Control/EditingMode/PointSnapping.js",
        "OpenLayers/Control/EditingMode/PointArraySnapping.js",
        "OpenLayers/Control/EditingMode/SegmentSnapping.js",
        "OpenLayers/Control/PanZoom.js",
        "OpenLayers/Control/PanZoomBar.js",
        "OpenLayers/Control/ArgParser.js",
        "OpenLayers/Control/Permalink.js",
        "OpenLayers/Geometry.js",
        "OpenLayers/Geometry/Aggregate.js",
        "OpenLayers/Geometry/Point.js",
        "OpenLayers/Geometry/Curve.js",
        "OpenLayers/Geometry/LineString.js",
        "OpenLayers/Geometry/LineSegment.js",
        "OpenLayers/Geometry/LinearRing.js",        
        "OpenLayers/Geometry/Surface.js",
        "OpenLayers/Geometry/Polygon.js",
        "OpenLayers/Geometry/Rectangle.js",
        "OpenLayers/Geometry/MultiPoint.js",
        "OpenLayers/Geometry/MultiLineString.js",
        "OpenLayers/Geometry/MultiPolygon.js",
        "OpenLayers/Renderer.js",
        "OpenLayers/Renderer/Svg.js",
        "OpenLayers/Renderer/Vml.js",
        "OpenLayers/Math.js",
        "OpenLayers/Math/Matrix.js",
        "OpenLayers/Style.js",
        "OpenLayers/Style/WebSafe.js",
        "OpenLayers/Parser.js",
        "OpenLayers/Parser/GML.js",
        "OpenLayers/Writer.js",
        "OpenLayers/Writer/WFS.js",
        "OpenLayers/Writer/GML.js"
        
    ); // ec.

    var allScriptTags = "";
    var host = OpenLayers._getScriptLocation() + "lib/";

    for (var i = 0; i < jsfiles.length; i++) {
        if (/MSIE/.test(navigator.userAgent) || /Safari/.test(navigator.userAgent)) {
            var currentScriptTag = "<script src='" + host + jsfiles[i] + "'></script>"; 
            allScriptTags += currentScriptTag;
        } else {
            var s = document.createElement("script");
            s.src = host + jsfiles[i];
            var h = document.getElementsByTagName("head").length ? 
                       document.getElementsByTagName("head")[0] : 
                       document.body;
            h.appendChild(s);
        }
    }
    if (allScriptTags) document.write(allScriptTags);
    })();
}
OpenLayers.VERSION_NUMBER="$Revision: 1721 $";
