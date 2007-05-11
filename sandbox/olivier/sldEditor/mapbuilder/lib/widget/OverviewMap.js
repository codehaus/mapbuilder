/*
Author:       Gertjan van Oosten gertjan at west dot nl
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to add an OL OverviewMap to a main map.
 * @constructor
 * @base WidgetBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function OverviewMap(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));

  var fixedWidthNode = widgetNode.selectSingleNode("mb:fixedWidth");
  if (fixedWidthNode) {
    this.fixedWidth = new Number(fixedWidthNode.firstChild.nodeValue);
  }

  this.model.addListener("refresh", this.addOverviewMap, this);
}

/**
 * Add an overview map to the map in this widget's model.
 * This uses just the base layer from the main map;
 * if the base layer is a WMS layer it uses an untiled version of this.
 * @param objRef Pointer to widget object.
 */
OverviewMap.prototype.addOverviewMap = function(objRef) {
  if (objRef.model && objRef.model.map) {
    var map = objRef.model.map;

    // Specify div for overview map.
    var options = {
      div: document.getElementById(objRef.htmlTagId)
    };
   // Check for WMS baseLayer
    var baseLayer = map.baseLayer;
    if (baseLayer != null && baseLayer instanceof OpenLayers.Layer.WMS) {
      // Use WMS.Untiled
      
      var baseLayerOptions = {
      				units:map.units,
                    projection:map.projection,
                	maxExtent:map.maxExtent,
                	maxResolution:"auto"
              };
              
      var newBase = new OpenLayers.Layer.WMS.Untiled(baseLayer.name,
                    baseLayer.url, {layers: baseLayer.params.LAYERS},baseLayerOptions);
                    
      options.layers = [newBase];
    }

    // Determine size taking aspect ratio of main map into account.
    // Note that without fixedWidth in config.xml, OL defaults to (180,90).
    if (objRef.fixedWidth) {
      var extent = map.getExtent();
      var size = new OpenLayers.Size(objRef.fixedWidth,
        objRef.fixedWidth * extent.getHeight() / extent.getWidth());
      options.size = size;
    }

    // Add the overview to the main map
    var overview = new OpenLayers.Control.OverviewMap(options);
    map.addControl(overview);
  }
}
