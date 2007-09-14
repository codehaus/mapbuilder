/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Enable the seletion of a layer in an OWS Context document so that it can
 * be inserted into another Context.
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function SelectLayerFromContext(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  /**
   * Copy a layer from this model's context to the targetModel's context.
   * @param layerName The name of the layer selected.
   */
  SelectLayerFromContext.prototype.addLayer = function(layerName) {
    var layerNode=this.model.doc.selectSingleNode("(//wmc:Layer|//wmc:FeatureType)[wmc:Name ='"+layerName+"']");
    this.targetModel.addLayer(this.targetModel,layerNode);
  }

  /**
   * Show the layer's metadata.
   * @param layerName The name of the layer selected.
   */
  SelectLayerFromContext.prototype.showLayerMetadata = function(layerName) {
    alert("SelectLayerFromContext.prototype.showLayerMetadata("+layerName+")");
  }
}
