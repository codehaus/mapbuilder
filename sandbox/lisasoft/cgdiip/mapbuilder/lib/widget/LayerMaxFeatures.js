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
   * @param objRef reference to this widget
   * @param layerNode the Layer node from another context doc or capabiltiies doc
   * @return none
   */
  LayerMaxFeatures.prototype.initLayer = function (objRef, layerNode) {
    // Only set maxFeatures for a layer if it not already had a maxFeatures attribute
    // We cannot use .hasAttribute, since IE6 doesn't support this
    if (layerNode.getAttribute("maxFeatures") == null) {
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
   * @param layerId the Id of Layer node 
   * @param maxFeatures optional value for maxFeatures. If not passed, the value from the model will be used
   * @return none
   */
  LayerMaxFeatures.prototype.setLayerMaxFeatures = function (layerId, maxFeatures) {
    // Check if maxFeatures parameter has been fed to this function
    // If not: fetch it from the model
    if (!maxFeatures) {
      maxFeatures = this.model.getParam('maxFeatures');
    }
    
    layerNode = this.model.getLayer(layerId);
    if (!layerNode) return false;

    // Only set maxFeatures for WFS layers: FeatureType
    if (layerNode.nodeName == "FeatureType" || layerNode.nodeName == "wmc:FeatureType") {
      layerNode.setAttribute("maxFeatures", maxFeatures);

      this.model.map.mbMapPane.refreshLayer(this.model.map.mbMapPane, layerId,{ MAXFEATURES: maxFeatures });
      this.model.callListeners("refresh");
    }
  }

  /*
   * Removes the maxFeatures attribute of a layer
   * @param layerId the Id of Layer node 
   * @return none
   */
  LayerMaxFeatures.prototype.removeLayerMaxFeatures = function (layerId) {

    layerNode = this.model.getLayer(layerId);
    if (!layerNode) return false;

    // Only set maxFeatures for WFS layers: FeatureType
    // We cannot use .hasAttribute, since IE6 doesn't support this
    if (layerNode.getAttribute("maxFeatures") != null) { 
      layerNode.removeAttribute("maxFeatures");

      // hard call to OL Map Pane
      this.model.map.mbMapPane.refreshLayer(this.model.map.mbMapPane, layerId, { MAXFEATURES: null });
      this.model.callListeners("reload");
    }
  }

  /*
   * Toggles maxFeatures on/off 
   * @param layerId the Id of Layer node 
   * @return none
   */
  LayerMaxFeatures.prototype.toggle = function (layerId) {
    layerNode = this.model.getLayer(layerId);
    if (!layerNode) return false;

    if (layerNode.getAttribute("maxFeatures") != null) {
      this.removeLayerMaxFeatures(layerId);
    } else {
      this.setLayerMaxFeatures(layerId);
    }

  }



}
