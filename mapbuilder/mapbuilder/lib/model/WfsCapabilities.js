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

  this.getServerUrl = function(requestName, method, feature) {
    var xpath = "/wfs:WFS_Capabilities/wfs:Capability/wfs:Request/"+requestName;
    if (method.toLowerCase() == "post") {
      xpath += "/wfs:DCPType/wfs:HTTP/wfs:Post";
    } else {
      xpath += "/wfs:DCPType/wfs:HTTP/wfs:Get";
    }
    return this.doc.selectSingleNode(xpath).getAttribute("onlineResource");
  }

  this.getVersion = function() {
    var xpath = "/wfs:WFS_Capabilities";
    return this.doc.selectSingleNode(xpath).getAttribute("version");
  }

  this.getMethod = function() {
    return this.method;
  }

  /**
   * get the list of source nodes from the parent document
   * @param objRef Pointer to this object.
   */
  this.getFeatureNode = function(featureName) {
    return this.doc.selectSingleNode(this.nodeSelectXpath+"[wfs:Name='"+featureName+"']");
  }

}

