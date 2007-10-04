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

  /**
   * Adds a widget to a layer for limiting the features of a layer
   * @param 
   * @param 
   */
  this.paint = function(layerNode, metadataDomElement) {

    // If clicked and metadata was visible, hide it and do nothing
    if ((metadataDomElement.style.display != "none") && (metadataDomElement.innerHTML != "")) { 
      metadataDomElement.style.display = "none";
      return false;
    }

    // add the layerNode as a parameter to the XSL
    this.stylesheet.setParameter("layerNode", layerNode);

    // create meta HTML
    var metadataHtml = this.stylesheet.transformNodeToString(this.model.doc);

    // insert the metadata HTML in the designated Dom Element 
    metadataDomElement.innerHTML = metadataHtml;

    // make it visible 
    metadataDomElement.style.display = "block";

    // debug info. TBD: remove
    if (console && console.info) console.info((new XMLSerializer()).serializeToString(layerNode));

  }

  /*
   * Checks whether a FeatureType should get the maxFeatures attribute 
   */
  LayerMaxFeatures.prototype.initLayer = function (objRef, layerNode) {
    console.info('MaxFeatures addLayer');
    console.debug(layerNode);

    // Only set maxFeatures for a layer if it not already had a maxFeatures attribute
    if (!layerNode.hasAttribute("maxFeatures")) {
      objRef.setLayerMaxFeatures(layerNode);
    }
  }
  this.model.addFirstListener( "addLayer", this.initLayer, this ); // make sure this is called before other listeners

  /*
   * Sets the maxFeatures attribute of a layer
   */
  LayerMaxFeatures.prototype.setLayerMaxFeatures = function (layerNode, maxFeatures) {
    // Check if maxFeatures parameter has been fed to this function
    // If not: fetch it from the model
    if (!maxFeatures) {
      console.info('Getting max features from model' + layerNode.nodeName);
      maxFeatures = this.model.getParam('maxFeatures');
    }
    
    // Only set maxFeatures for WFS layers: FeatureType
    if (layerNode.nodeName == "FeatureType" || layerNode.nodeName == "wmc:FeatureType") {
      layerNode.setAttribute("maxFeatures", maxFeatures);
      //this.model.callListeners("refreshLayer", layerNode.selectSingleNode("wmc:Name").firstChild.nodeValue, ["MAXFEATURES", maxFeatures]);
      layerName = layerNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
    console.info('MaxFeatures set maxFeatures: ' + layerName + " (" + layerNode.nodeName + ")");

      this.model.map.mbMapPane.refreshLayer(this.model.map.mbMapPane, layerName,{ MAXFEATURES: maxFeatures });
      this.model.callListeners("refresh");
    }
  }

  /*
   * Removes the maxFeatures attribute of a layer
   */
  LayerMaxFeatures.prototype.removeLayerMaxFeatures = function (layerNode) {
    // Only set maxFeatures for WFS layers: FeatureType
    if (layerNode && layerNode.hasAttribute("maxFeatures")) { 
      layerNode.removeAttribute("maxFeatures");
      layerName = layerNode.selectSingleNode("wmc:Name").firstChild.nodeValue;

    console.info('MaxFeatures remove maxFeatures: ' + layerName);

      // hard call to OL Map Pane
      this.model.map.mbMapPane.refreshLayer(this.model.map.mbMapPane, layerName, { MAXFEATURES: null });
      this.model.callListeners("refresh");
    }
  }

  LayerMaxFeatures.prototype.refresh = function (objRef, layerNode) {
    console.info('MaxFeatures refresh');

  }
  this.model.addListener( "refresh", this.refresh, this );

  /*
   * Toggles maxFeatures on/off 
   */
  LayerMaxFeatures.prototype.toggle = function (layerId) {
    console.info('MaxFeatures toggle: ' + layerId);

    // Find the layerNode in the model
    layerNode = this.model.getLayer(layerId);

    // Exit if layerNode cannot be found
    if (!layerNode) return false;

    if (layerNode.hasAttribute("maxFeatures")) {
      this.removeLayerMaxFeatures(layerNode);
    } else {
      this.setLayerMaxFeatures(layerNode);
    }

    console.debug(layerNode);
    node = document.getElementById(layerId + '_Loading');
    

  }



}
