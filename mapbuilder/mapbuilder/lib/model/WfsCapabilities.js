/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Stores a Web Feature (WFS) Capabilities document as defined by the 
 * Open Geospatial Consortium (http://opengis.org and extensions the the WMC.  
 *
 * @constructor
 * @author Mike Adair
 * @param modelNode   The model's XML object node from the configuration document.
 * @param parentModel The model object that this widget belongs to.
 */
function WfsCapabilities(modelNode, parentModel) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode, parentModel);

  this.namespace = "xmlns:wfs='http://www.opengis.net/wfs'";

  this.getServerUrl = function(feature, request) {
    var xpath = "/wfs:WFS_Capabilities/wfs:Capability/wfs:Request/wfs:"+request+"/wfs:DCPType/wfs:HTTP/wfs:Get";
    return feature.selectSingleNode(xpath).getAttribute("onlineResource");
  }

  this.getMethod = function(feature) {
    return this.method;
  }

  this.loadFeature = function(featureNodeId) {
    var feature = this.featureList.getFeatureNode(featureNodeId);
    this.setParam("GetFeature",feature);
  }

  this.filterFeature = function(featureNodeId) {
    var feature = this.featureList.getFeatureNode(featureNodeId);
    this.setParam("DescribeFeatureType",feature);
  }

}

