/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to allow control of layer odering, visibility, deletion
 * @constructor
 * @base WidgetBaseXSL
 * @author adair
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function LayerControl(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  /**
   * Override of widget prepaint to set some stylesheet parameters including 
   * featureName (for OWS Context) and hidden attribute.
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    if (objRef.model.featureName) {
      objRef.stylesheet.setParameter("featureName", objRef.model.featureName );
      objRef.stylesheet.setParameter("hidden", objRef.model.getHidden(objRef.model.featureName).toString() );
    }
  }

  /**
   * Displays a layer in a preview pane when mouse is over the table row
   * @param layerName  the name of the layer to highlight
   */
  this.highlightLayer = function(layerName) {
    var layerId = this.model.id + "_" + "mainMapWidget" + "_" + layerName;
    var previewImage = document.getElementById("previewImage");
    var layer = document.getElementById(layerId);
    if (previewImage) previewImage.src = layer.firstChild.src;
  }

  /**
   * not working yet
   * @param layerName  the name of the layer to highlight
   */
  this.showLayerMetadata = function(layerName) {
    var metadataWidget = config.objects.layerMetadata;
    metadataWidget.stylesheet.setParameter("featureName",layerName);
    metadataWidget.node = document.getElementById(metadataWidget.htmlTagId);
    metadataWidget.paint(metadataWidget);
  }

  this.model.addListener("deleteLayer",this.paint, this);
  this.model.addListener("moveLayerUp",this.paint, this);
  this.model.addListener("moveLayerDown",this.paint, this);
  this.model.addListener("addLayer",this.paint, this);
}
