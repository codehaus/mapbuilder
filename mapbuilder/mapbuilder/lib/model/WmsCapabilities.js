/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Stores a Web Map Server (WMS) Capabilities document as defined by the 
 * Open Geospatial Consortium (http://opengis.org and extensions the the WMC.  
 *
 * @constructor
 * @author Mike Adair
 * @param modelNode   The model's XML object node from the configuration document.
 * @param parentModel The model object that this widget belongs to.
 */
function WmsCapabilities(modelNode, parentModel) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode, parentModel);

  this.namespace = "xmlns:wms='http://www.opengis.net/wms'";

  this.getServerUrl = function(request) {
    var xpath = "/WMT_MS_Capabilities/Capability/Request/"+request+"/DCPType/HTTP/Get/OnlineResource";
    var node = this.doc.selectSingleNode(xpath);
    return this.doc.selectSingleNode(xpath).getAttribute("xlink:href");
  }

  this.getVersion = function() {
    var xpath = "/WMT_MS_Capabilities";
    return this.doc.selectSingleNode(xpath).getAttribute("version");
  }

  this.getServerTitle = function() {
    var xpath = "/WMT_MS_Capabilities/Service/Title";
    var node = this.doc.selectSingleNode(xpath);
    return node.firstChild.nodeValue;
  }

  this.getServiceName = function() {
    var xpath = "/WMT_MS_Capabilities/Service/Name";
    var node = this.doc.selectSingleNode(xpath);
    return node.firstChild.nodeValue;
  }

  this.loadFeature = function(featureNodeId) {
    var feature = this.featureList.getFeatureNode(featureNodeId);
    this.setParam("GetMap",feature);
  }

  this.addToContext = function(featureNodeId) {
    var feature = this.featureList.getFeatureNode(featureNodeId);
    this.setParam("AddNodeToContext",feature);
  }

}

