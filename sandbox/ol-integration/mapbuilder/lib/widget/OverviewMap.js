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

    // Specify div and layers for overview map.
    var options = {
      div: document.getElementById(objRef.htmlTagId),
      layers: new Array()
    };

    
    var showBaseLayer = true;
    var baseLayer = null;
    // Clone the base layer. This always has to be in the
    // overview map, otherwise OpenLayers fails to draw the
    // overview.
    if (map.baseLayer) {
      baseLayer = objRef.getClonedLayer(map.baseLayer)
      options.layers.push(baseLayer);
    }

    // Check for specifically requested layers
    if (objRef.layerNames) {
      showBaseLayer = false;
      for (var i = 0; i < objRef.layerNames.length; i++) {
        for (var j = 0; j < map.layers.length; j++) {
          if (objRef.layerNames[i] == map.layers[j].params.LAYERS) {
            // Found it, add a clone to the layer stack
            if (map.layers[j] == map.baseLayer) {
              showBaseLayer = true;
            }
            options.layers.push(objRef.getClonedLayer(map.layers[j]));
          }
        }
      }
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

    // Set visibility of base layer. If the user configured
    // no layerNames or referenced it by layerName, it is
    // shown, otherwise hidden.
    if (baseLayer) {
      baseLayer.setVisibility(showBaseLayer);
    }
  }
}

/**
 * Clone a map layer (OpenLayers.Layer subclass).
 * returns a new, untiled layer with the same options as the old one.
 * @param layer Pointer to layer object.
 */
OverviewMap.prototype.getClonedLayer = function(layer) {
  if (layer == null) {
    return null;
  }

  var layerOptions = {
    units: layer.units,
    projection: layer.projection,
    maxExtent: layer.maxExtent,
    maxResolution: "auto"
  };

  return new OpenLayers.Layer.WMS.Untiled(layer.name,
    layer.url, {layers: layer.params.LAYERS}, layerOptions);
}
