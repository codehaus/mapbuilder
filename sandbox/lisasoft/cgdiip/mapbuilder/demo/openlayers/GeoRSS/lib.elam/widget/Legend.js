/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Legend.js 2113 2006-06-06 20:48:01Z madair $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Functions to render and update a Legend from a Web Map Context.
 * @constructor
 * @base WidgetBaseXSL
 * @author Cameron Shorter cameronATshorter.net
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function Legend(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  this.model.addListener("deleteLayer",this.refresh, this);
  this.model.addListener("moveLayerUp",this.refresh, this);
  this.model.addListener("moveLayerDown",this.refresh, this);
  if (this.autoRefresh) this.model.addListener("addLayer",this.refresh, this);

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
    var visibleLayer = objRef.model.doc.selectSingleNode(objRef.model.nodeSelectXpath+"[@hidden='0' and @opaque='1']/wmc:Name");
    if (visibleLayer) objRef.visibleLayer = visibleLayer.firstChild.nodeValue;
  }

}

/**
 * Listener method to paint this widget
 * @param layerName  the name of the layer to highlight
 */
Legend.prototype.refresh = function(objRef, layerName) {
  objRef.paint(objRef, objRef.id);
}

/**
 * Controller method to select a layer
 * @param objRef Pointer to this object.
 * @param layer The selected layer.
 */
Legend.prototype.selectLayer = function(objRef,layer) {
  objRef.model.setParam('selectedLayer',layer);
}

/**
 * Controller method to select a layer
 * @param objRef Pointer to this object.
 * @param layer The selected layer.
 */
Legend.prototype.swapOpaqueLayer = function(layer) {
  this.model.setHidden(this.visibleLayer, true);
  this.model.setHidden(layer, false);
  this.visibleLayer = layer;
}

