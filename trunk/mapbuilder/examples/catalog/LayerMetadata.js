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

  /**
   * Toggles the visibility of a layer's metadata
   * @param layerNode Dom element containing the OWS layer 
   * @param metadataDomElement Pointer the Dom element where the metadata should
   *                           be shown
   */
  this.paint = function(layerNode, metadataDomElement) {

    if (!metadataDomElement) {
      return;
    }

    // If clicked and metadata was visible, hide it and do nothing
    if (metadataDomElement.style.display && (metadataDomElement.style.display != "none") && (metadataDomElement.innerHTML != "")) { 
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
    //console.info((new XMLSerializer()).serializeToString(layerNode));

  }


}


