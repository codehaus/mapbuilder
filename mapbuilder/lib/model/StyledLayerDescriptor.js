 /*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/ModelBase.js");

/**
 * Stores a SLD file  as defined by the
 * Open Geospatial Consortium (http://www.opengeospatial.org/).
 *
 * @constructor
 * @base ModelBase
 * @author Olivier Terral
 * @requires Sarissa
 * @param modelNode The model's XML object node from the configuration document.
 * @param parent    The parent model for the object.
 */
function StyledLayerDescriptor(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  ModelBase.apply(this, new Array(modelNode, parent));
  
  this.sld = null;
  this.namespace = "xmlns:sld='http://www.opengis.net/sld' xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder' xmlns:wmc='http://www.opengis.net/context' xmlns:wms='http://www.opengis.net/wms' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:wfs='http://www.opengis.net/wfs'";
  this.sldXPath = this.getProperty("mb:sldXPath", "/sld:StyledLayerDescriptor");

  this.getSldNode=function() {
  	return this.doc.selectSingleNode(this.sldXPath);
  }
  
  /**
   * loads the sld into an OpenLayers hash representing the sld.
   * @param objRef reference to this model.
   */
  this.loadSLD = function(objRef) {
    var format = new OpenLayers.Format.SLD();
    var sldNode = objRef.doc.selectSingleNode(objRef.sldXPath);
    var sld = format.read(sldNode, {withNamedLayer: true});
    if (sld.length > 1) {
      objRef.sld = sld[1];
    }
  }
  this.addFirstListener("loadModel", this.loadSLD, this);

}
