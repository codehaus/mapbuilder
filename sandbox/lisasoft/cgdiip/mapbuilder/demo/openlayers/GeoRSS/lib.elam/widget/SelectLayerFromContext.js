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

    // Fetch layerNode from model
    var layerNode=this.getLayerNode(layerName);

    // Add a layer by calling the addLayer event. Not quite how the MVC design
    // should work, but I'm following existing code to minimise impact.
    this.targetModel.callListeners("addLayer",layerNode);

  }

  /**
   * Fetches the layerNode from the model
   * @param layerName The name of the layer selected.
   * @return domElement
   */
  SelectLayerFromContext.prototype.getLayerNode = function(layerName) {
    return this.model.doc.selectSingleNode("(//wmc:Layer|//wmc:FeatureType)[wmc:Name ='"+layerName+"']");
  }

  /**
   * Show the layer's metadata.
   * @param layerName The name of the layer selected.
   * @param metadataDomElementId Dom element where metadata should be stored
   */
  SelectLayerFromContext.prototype.showLayerMetadata = function(layerName, metadataDomElementId) {

    // Fetch layer node from model
    var layerNode=this.getLayerNode(layerName);

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
