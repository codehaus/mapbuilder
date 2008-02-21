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
   * @param layerId The id of the layer selected.
   */
  this.addLayer = function(layerId) {

    // Fetch layerNode from model and clone it 
    var layerNode=this.model.getLayer(layerId).cloneNode(true);

    //Add layerNode to the target model
    this.targetModel.setParam("addLayer",layerNode);

  }

   /**
   * Show the layer's metadata.
   * @param layerId The id of the layer selected.
   * @param metadataDomElementId Dom element where metadata should be stored
   */
  this.showLayerMetadata = function(layerId, metadataDomElementId) {

    // Fetch layer node from model
    var layerNode=this.model.getLayer(layerId);

    // Exit if metadata widget could not be found (failsafe) 
    var metadataWidget = config.objects.layerMetadata;
    if (!metadataWidget) {
      return false;
    }

    // Find DOM element for metadata
    var metadataDomElement = document.getElementById(metadataDomElementId); 

    // Call the metadata widget with the layer node and the metadata Dom Element
    metadataWidget.paint(layerNode, metadataDomElement);
 
  }
}
