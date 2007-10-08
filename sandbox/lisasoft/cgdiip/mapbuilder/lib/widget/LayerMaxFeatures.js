/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Abstract.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Output the context title and abstract.
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function LayerMaxFeatures(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  // Set the model's default maxFeatures values if existent
  // unlimited when non-existent
  if (widgetNode.selectSingleNode("mb:maxFeatures")) {
    this.model.setParam('maxFeatures', widgetNode.selectSingleNode("mb:maxFeatures").firstChild.nodeValue);
  }

  /*
   * Checks whether a FeatureType should get the maxFeatures attribute 
   */
  LayerMaxFeatures.prototype.initLayer = function (objRef, layerNode) {
    //console.info('MaxFeatures addLayer');
    //console.debug(layerNode);

    // Only set maxFeatures for a layer if it not already had a maxFeatures attribute
    if (!layerNode.hasAttribute("maxFeatures")) {
      layerId = layerNode.selectSingleNode("@id").firstChild.nodeValue;

      // Failback mechanism to layer name
      if (!layerId) {
        layerId = layerNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
      }
      objRef.setLayerMaxFeatures(layerId);
    }
  }
  this.model.addFirstListener( "addLayer", this.initLayer, this ); // make sure this is called before other listeners

  /*
   * Sets the maxFeatures attribute of a layer
   */
  LayerMaxFeatures.prototype.setLayerMaxFeatures = function (layerId, maxFeatures) {
    // Check if maxFeatures parameter has been fed to this function
    // If not: fetch it from the model
    if (!maxFeatures) {
      //console.info('Getting max features from model' + layerNode.nodeName);
      maxFeatures = this.model.getParam('maxFeatures');
    }
    
    layerNode = this.model.getLayer(layerId);
    if (!layerNode) return false;

    // Only set maxFeatures for WFS layers: FeatureType
    if (layerNode.nodeName == "FeatureType" || layerNode.nodeName == "wmc:FeatureType") {
      layerNode.setAttribute("maxFeatures", maxFeatures);

      //console.info('MaxFeatures set maxFeatures: ' + layerId + " (" + layerNode.nodeName + ")");

      this.model.map.mbMapPane.refreshLayer(this.model.map.mbMapPane, layerId,{ MAXFEATURES: maxFeatures });
      this.model.callListeners("refresh");
    }
  }

  /*
   * Removes the maxFeatures attribute of a layer
   */
  LayerMaxFeatures.prototype.removeLayerMaxFeatures = function (layerId) {

    layerNode = this.model.getLayer(layerId);
    if (!layerNode) return false;

    // Only set maxFeatures for WFS layers: FeatureType
    if (layerNode && layerNode.hasAttribute("maxFeatures")) { 
      layerNode.removeAttribute("maxFeatures");

      //console.info('MaxFeatures remove maxFeatures: ' + layerId);

      // hard call to OL Map Pane
      this.model.map.mbMapPane.refreshLayer(this.model.map.mbMapPane, layerId, { MAXFEATURES: null });
      this.model.callListeners("reload");
    }
  }

  LayerMaxFeatures.prototype.refresh = function (objRef, layerNode) {

  }
  this.model.addListener( "refresh", this.refresh, this );

  /*
   * Toggles maxFeatures on/off 
   */
  LayerMaxFeatures.prototype.toggle = function (layerId) {
    //console.info('MaxFeatures toggle: ' + layerId);

    layerNode = this.model.getLayer(layerId);
    if (!layerNode) return false;

    if (layerNode.hasAttribute("maxFeatures")) {
      this.removeLayerMaxFeatures(layerId);
    } else {
      this.setLayerMaxFeatures(layerId);
    }

    //console.debug(layerNode);
    node = document.getElementById(layerId + '_Loading');
    

  }



}
