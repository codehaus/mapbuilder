/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id: LayerControl.js 2096 2006-04-26 17:31:22Z madair $
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
  
    /*var layerId = config.objects.mainMapWidget.oLlayers[layerName].id;
    var previewImage = document.getElementById("previewImage");
    
    var child=previewImage.lastChild;
	while (child)
  	{
  		previewImage.removeChild(child);
  		child=child.previousSibling;
  	}
  	this.map=this.targetModel.map;
    var layer = document.getElementById("mainMapContainer_OpenLayers_ViewPort").cloneNode(true);
 
    layer.style.width=150;
    layer.style.height=150;
    layer.style.zindex=0;
    layer.style.id=layer.style.id+"_pi";
    //   alert(layer.style.width);
    if (previewImage){ previewImage.firstChild.firstChild.appendChild(layer);
  }*/
}
  /**
   * Listener method to paint this widget
   * @param layerName  the name of the layer to highlight
   */
  this.refresh = function(objRef, layerName) {
    objRef.paint(objRef, objRef.id);
  }

  /**
   * not working yet
   * @param layerName  the name of the layer to highlight
   */
  this.showLayerMetadata = function(layerName) {
    var metadataWidget = config.objects.layerMetadata;
    if (metadataWidget) {
      metadataWidget.stylesheet.setParameter("featureName",layerName);
      metadataWidget.node = document.getElementById(metadataWidget.htmlTagId);
      metadataWidget.paint(metadataWidget);
    }
  }

  this.model.addListener("deleteLayer",this.refresh, this);
  this.model.addListener("moveLayerUp",this.refresh, this);
  this.model.addListener("moveLayerDown",this.refresh, this);
  if (this.autoRefresh) this.model.addListener("addLayer",this.refresh, this);
}
