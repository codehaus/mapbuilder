/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Functions to render and update a Legend from a Web Map Context.
 * @constructor
 * @base WidgetBase
 * @author Cameron Shorter cameronATshorter.net
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function LayerControl(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

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

  this.highlightLayer = function(layerName) {
    var layerId = this.model.id + "_" + "mainMapWidget" + "_" + layerName;
    var previewImage = document.getElementById("previewImage");
    var layer = document.getElementById(layerId);
    previewImage.src = layer.firstChild.src;
  }

  this.showLayerMetadata = function(layerName) {
    var metadataWidget = config.objects.layerMetadata;
    metadataWidget.stylesheet.setParameter("featureName",layerName);
    metadataWidget.node = document.getElementById(metadataWidget.htmlTagId);
    metadataWidget.paint(metadataWidget);
  }

}
