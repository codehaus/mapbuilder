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

  var width = this.getProperty("mb:width");
  if (width) {
    this.width = new Number(width);
  }
  var height = this.getProperty("mb:height");
  if (height) {
    this.height = new Number(height);
  }
  var minRatio = this.getProperty("mb:minRatio");
  if (minRatio) {
    this.minRatio = new Number(minRatio);
  }
  var maxRatio = this.getProperty("mb:maxRatio");
  if (maxRatio) {
    this.maxRatio = new Number(maxRatio);
  }
  
  var numZoomLevels = this.getProperty("mb:numZoomLevels");
  if(numZoomLevels) {
    this.numZoomLevels = parseInt(numZoomLevels);
  }

  var layersNode = widgetNode.selectSingleNode("mb:layers");
  if (layersNode) {
    this.layerNames = new Array();
    var layers = layersNode.childNodes;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].firstChild) {
        this.layerNames.push(getNodeValue(layers[i]));
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
    
    /** reference to the OpenLayers OverviewMap control */
    this.control = null

    // Specify div and layers for overview map.
    var options = {
      div: objRef.getNode(),
      objRef: this,
      destroy: function() {
        OpenLayers.Control.OverviewMap.prototype.destroy.apply(this, arguments);
        this.div = null;
        objRef.control = null;
        objRef = null;
      },
      layers: new Array()
    };
    
    if (objRef.minRatio) options.minRatio = objRef.minRatio;
    if (objRef.maxRatio) options.maxRatio = objRef.maxRatio;
    if (objRef.numZoomLevels) options.mapOptions = {numZoomLevels: objRef.numZoomLevels};

    // Clone the base layer. This is not really the OpenLayers base layer, but
    // the lowest layer in the Mapbuilder layers stack.
    if (!objRef.layerNames) {
      for (var i in map.mbMapPane.oLlayers) {
        var oLlayer = map.mbMapPane.oLlayers[i];
        if (oLlayer) {
          var baseLayer = objRef.getClonedLayer(oLlayer, true);
          options.layers.push(baseLayer);
          break;
        } 
      }
    }

    // Check for specifically requested layers
    var isBaseLayer = true;
    if (objRef.layerNames) {
      for (var i = 0; i < objRef.layerNames.length; i++) {
        var oLlayer = map.mbMapPane.getLayer(map.mbMapPane, objRef.layerNames[i]);
        if (oLlayer) {
          options.layers.push(objRef.getClonedLayer(oLlayer, isBaseLayer));
          isBaseLayer = false;
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
    if (!objRef.control) {
      objRef.control = new OpenLayers.Control.OverviewMap(options);
      if(objRef.control.mapOptions)
        objRef.control.mapOptions.theme = null;
      else
        objRef.control.mapOptions = {theme: null};
      map.addControl(objRef.control);
    }

    // make all layers visible
    for (var i=0; i<options.layers.length; i++) {
      options.layers[i].setVisibility(true);
    }
  }
}

/**
 * Clone a map layer (OpenLayers.Layer subclass).
 * If the layer is a WMS layer it returns an untiled version of it.
 * @param layer Pointer to layer object.
 * @param isBaseLayer {Boolean} optional parameter: should the layer become
 * baselayer on the overview map?
 */
OverviewMap.prototype.getClonedLayer = function(layer, isBaseLayer) {
  if (layer == null) {
    return null;
  }
  
  isBaseLayer = isBaseLayer ? true : false;

  if (layer instanceof OpenLayers.Layer.WMS) {
    // make an untiled wms layer, with ratio 1
    var layerOptions = {
      units: layer.units,
      projection: layer.projection,
      maxExtent: layer.maxExtent,
      maxResolution: "auto",
      ratio: 1,
      singleTile: true,
      isBaseLayer: isBaseLayer
    };

    return new OpenLayers.Layer.WMS(layer.name,
      layer.url, {
        layers: layer.params.LAYERS,
        format: layer.params.FORMAT,
        transparent: layer.params.TRANSPARENT,
        sld: layer.params.SLD,
        sld_body: layer.params.SLD_BODY,
        styles: layer.params.STYLES
      }, layerOptions);
  }
  else if (layer instanceof OpenLayers.Layer.WMTS) {
    // make a wmts layer, with ratio 1
    var layerOptions = {
      units: layer.units,
      projection: layer.projection,
      maxExtent: layer.maxExtent,
      maxResolution: "auto",
      ratio: 1,
      isBaseLayer: isBaseLayer
    };
      
    // set all properties of OpenLayers.Layer.WMTS
    layerOptions.name = layer.name;
    layerOptions.requestEncoding = layer.requestEncoding;
    layerOptions.url = layer.url;
    layerOptions.layer = layer.name;
    layerOptions.matrixSet = layer.matrixSet;
    layerOptions.style = layer.style;
    layerOptions.format = layer.format;
    layerOptions.tileOrigin = layer.tileOrigin;
    layerOptions.tileFullExtent = layer.tileFullExtent;
    layerOptions.formatSuffix = layer.formatSuffix;
    layerOptions.matrixIds = layer.matrixIds;
    layerOptions.dimensions = layer.dimensions;
    layerOptions.params = layer.params;
    layerOptions.zoomOffset = layer.zoomOffset;
    layerOptions.serverResolutions = layer.serverResolutions;

    // set some additional properties from OpenLayers.Layer.Grid and OpenLayers.Layer
    layerOptions.displayOutsideMaxExtent = layer.displayOutsideMaxExtent;
    layerOptions.transitionEffect = layer.transitionEffect;

    return new OpenLayers.Layer.WMTS(layerOptions);
  }
  else {
    // take the layer as-is and clone it
    var clonedLayer = layer.clone();
    clonedLayer.setVisibility(true);
    return clonedLayer;
  }
}
  
