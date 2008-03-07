/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Abstract.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependencies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Show a layer's metadata
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */


function LayerMetadata(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  this.model.setParam("layerMetadata", true);
  /**
   * Toggles the visibility of a layer's metadata
   * @param layerNode Dom element containing the OWS layer 
   * @param domNode Pointer the Dom element where the metadata should
   *                           be shown
   */
  this.paint = function(objRef, params) {

    var layerNode = objRef.model.getLayer(params.layerId);
    var domNode = document.getElementById(params.domNodeId);

    if (!domNode || !layerNode) {
      return;
    }

    // If clicked and metadata was visible, hide it and do nothing
    if (domNode.style.display && (domNode.style.display != "none") && (domNode.innerHTML != "")) { 
      domNode.style.display = "none";
      return false;
    }

    // add the layerNode as a parameter to the XSL
    objRef.stylesheet.setParameter("layerNode", layerNode);

    // create meta HTML
    var metadataHtml = objRef.stylesheet.transformNodeToString(objRef.model.doc);

    // insert the metadata HTML in the designated Dom Element 
    domNode.innerHTML = metadataHtml;

    // make it visible 
    domNode.style.display = "block";

    // debug info. TBD: remove
    //console.info((new XMLSerializer()).serializeToString(layerNode));

  }
  this.model.addListener("layerMetadata", this.paint, this);

}


