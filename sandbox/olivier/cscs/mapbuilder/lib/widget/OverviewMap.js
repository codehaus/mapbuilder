/*
Author:       Gertjan van Oosten gertjan at west dot nl
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: OverviewMap.js 2819 2007-05-24 13:52:18Z gjvoosten $
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

  var widthNode = widgetNode.selectSingleNode("mb:width");
  if (widthNode) {
    this.width = new Number(widthNode.firstChild.nodeValue);
  }

  var heightNode = widgetNode.selectSingleNode("mb:height");
  if (heightNode) {
    this.height = new Number(heightNode.firstChild.nodeValue);
  }

  var layersNode = widgetNode.selectSingleNode("mb:layers");
  if (layersNode) {
    this.layerNames = new Array();
    var layers = layersNode.childNodes;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].firstChild) {
        this.layerNames.push(layers[i].firstChild.nodeValue);
      }
    }
  }

  this.model.addListener("refresh", this.addOverviewMap, this);
}

/**
 * Add an overview map to the map in this widget's model.
 * If layers have been specified in the config, clone these layers for the
 * overview map, otherwise just use the base layer from the main map.
 * If any of the layers to use are WMS layers it uses an untiled version of them.
 * @param objRef Pointer to widget object.
 */
OverviewMap.prototype.addOverviewMap = function(objRef) {
  if (objRef.model && objRef.model.map) {
    var map = objRef.model.map;

    // Specify div for overview map.
    var options = {
      div: document.getElementById(objRef.htmlTagId)
    };

    // Check for specifically requested layers
    if (objRef.layerNames) {
      options.layers = new Array();
      for (var i = 0; i < objRef.layerNames.length; i++) {
        for (var j = 0; j < map.layers.length; j++) {
          if (objRef.layerNames[i] == map.layers[j].params.LAYERS) {
            // Found it, add a clone to the layer stack
            options.layers.push(objRef.getClonedLayer(map.layers[j]));
          }
        }
      }
    }

    // If no layers yet, clone base layer
    if ((!options.layers || options.layers.length == 0) && map.baseLayer != null) {
      options.layers = [objRef.getClonedLayer(map.baseLayer)];
    }

    // Determine size:
    // - if width and height are both set, use these as the size;
    // - if only width or height is set, take aspect ratio of main map into account;
    // - otherwise, OL defaults to (180,90).
    var extent = map.getExtent();
    if (objRef.width && objRef.height) {
      options.size = new OpenLayers.Size(objRef.width, objRef.height);
    }
    else if (objRef.width) {
      options.size = new OpenLayers.Size(
        objRef.width,
        objRef.width * extent.getHeight() / extent.getWidth());
    }
    else if (objRef.height) {
      options.size = new OpenLayers.Size(
        objRef.height * extent.getWidth() / extent.getHeight(),
        objRef.height);
    }

    // Add the overview to the main map
    map.addControl(new OpenLayers.Control.OverviewMap(options));
  }
}

/**
 * Clone a map layer (OpenLayers.Layer subclass).
 * If the layer is an WMS layer it returns an untiled version of it.
 * @param layer Pointer to layer object.
 */
OverviewMap.prototype.getClonedLayer = function(layer) {
  if (layer == null) {
    return null;
  }

  if (layer instanceof OpenLayers.Layer.WMS) {
    // WMS layer, use WMS.Untiled
    var layerOptions = {
      units: layer.units,
      projection: layer.projection,
      maxExtent: layer.maxExtent,
      maxResolution: "auto"
    };

    return new OpenLayers.Layer.WMS.Untiled(layer.name,
      layer.url, {layers: layer.params.LAYERS}, layerOptions);
  }
  else {
    return layer.clone();
  }
}
