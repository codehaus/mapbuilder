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

  this.getServerUrl = function(requestName, method, feature) {
    var xpath = "/WMT_MS_Capabilities/Capability/Request/"+requestName;
    if (method.toLowerCase() == "post") {
      xpath += "/DCPType/HTTP/Post/OnlineResource";
    } else {
      xpath += "/DCPType/HTTP/Get/OnlineResource";
    }
    return this.doc.selectSingleNode(xpath).getAttribute("onlineResource");
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

  /**
   * get the list of source nodes from the parent document
   * @param objRef Pointer to this object.
   */
  this.getFeatureNode = function(featureName) {
    return this.doc.selectSingleNode(this.nodeSelectXpath+"[Name='"+featureName+"']");
  }

  this.addToContext = function(featureName) {
    var feature = this.getFeatureNode(featureName);
    this.setParam("AddNodeToContext",feature);
  }

}

