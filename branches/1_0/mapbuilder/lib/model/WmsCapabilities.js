/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

/**
 * Stores a Web Map Server (WMS) Capabilities document as defined by the 
 * Open Geospatial Consortium (http://opengis.org and extensions the the WMC.  
 *
 * @constructor
 * @author Mike Adair
 * @param modelNode   The model's XML object node from the configuration document.
 * @param parent The model object that this widget belongs to.
 */
function WmsCapabilities(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  ModelBase.apply(this, new Array(modelNode, parent));

  this.namespace = "xmlns:wms='http://www.opengis.net/wms' xmlns:xlink='http://www.w3.org/1999/xlink'";

  /**
   * Returns the serverUrl for the WMS request passed in with the specified
   * HTTP method from the capabilities doc.
   * @param requestName the WMS request to get the URL for
   * @param method http method for the request
   * @param feature ignored for WMS docs
   * @return URL for the specified request with the specified method
   */
  this.getServerUrl = function(requestName, method, feature) {
    var version = this.getVersion();
    if (version == "1.0.0") {
      requestName = requestName.substring(3);  //strip of "Get" part of request name
      var xpath = "/WMT_MS_Capabilities/Capability/Request/"+requestName;
      if (method.toLowerCase() == "post") {
        xpath += "/DCPType/HTTP/Post";
      } else {
        xpath += "/DCPType/HTTP/Get";
      }
      return this.doc.selectSingleNode(xpath).getAttribute("onlineResource");
    } else {
      var xpath = "/WMT_MS_Capabilities/Capability/Request/"+requestName;
      if (method.toLowerCase() == "post") {
        xpath += "/DCPType/HTTP/Post/OnlineResource";
      } else {
        xpath += "/DCPType/HTTP/Get/OnlineResource";
      }
      return this.doc.selectSingleNode(xpath).getAttribute("xlink:href");
    }
  }

  /**
   * Returns the version for the WMS
   * @return the WMS version
   */
  this.getVersion = function() {
    var xpath = "/WMT_MS_Capabilities";
    return this.doc.selectSingleNode(xpath).getAttribute("version");
  }

  /**
   * @return the title of the WMS server
   */
  this.getServerTitle = function() {
    var xpath = "/WMT_MS_Capabilities/Service/Title";
    var node = this.doc.selectSingleNode(xpath);
    return node.firstChild.nodeValue;
  }

  /**
   * @return the first image format listed
   */
  this.getImageFormat = function() {
    var version = this.getVersion();
    if (version == "1.0.0") {
      var xpath = "/WMT_MS_Capabilities/Capability/Request/Map/Format";  //strip of "Get" part of request name
      var node = this.doc.selectSingleNode(xpath);
      return "image/"+node.firstChild.localName.toLowerCase();
    } else {
      var xpath = "/WMT_MS_Capabilities/Capability/Request/GetMap/Format";
      var node = this.doc.selectSingleNode(xpath);
      return node.firstChild.nodeValue;
    }
  }

  /**
   * @return the name of the WMS server
   */
  this.getServiceName = function() {
    var xpath = "/WMT_MS_Capabilities/Service/Name";
    var node = this.doc.selectSingleNode(xpath);
    return node.firstChild.nodeValue;
  }

  /**
   * Returns the Layer node with the specified name from the list of nodes
   * selected by the nodeSelectXpath from the capabilities doc.
   * @param featureName name of the featureType to look up
   * @return the Layer node with the specified name.
   */
  this.getFeatureNode = function(featureName) {
    return this.doc.selectSingleNode(this.nodeSelectXpath+"[Name='"+featureName+"']");
  }

}

