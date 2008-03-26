/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: WmsCapabilities.js,v 1.9 2005/09/20 02:40:25 madair1 Exp $
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
function OlsRespons(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  ModelBase.apply(this, new Array(modelNode, parent));

	this.point = new Boolean;
	this.zoom = new Boolean;
	
// Namespace to use when doing Xpath queries, usually set in config file.
  if (!this.namespace){
    this.namespace = "xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemalocation='http://www.opengis.net/xls' xmlns:xls='http://www.opengis.net/xls' xmlns:gml='http://www.opengis.net/gml'";
  }

  /**
   * Returns the serverUrl for the WMS request passed in with the specified
   * HTTP method from the capabilities doc.
   * @param requestName the WMS request to get the URL for
   * @param method http method for the request
   * @param feature ignored for WMS docs
   * @return URL for the specified request with the specified method
   */
  this.getNumberOfResponses = function() {
    var xpath = "/xls:GeocodeResponse/xls:GeocodeResponseList";
    return this.doc.selectSingleNode(xpath).getAttribute("numberOfGeocodedAddresses");
  }

  /**
   * Returns the version for the WMS
   * @return the WMS version
   */
  this.getListOfResponses = function() {
    var xpath = "/xls:GeocodeResponse/xls:GeocodeResponseList";
    return this.doc.selectNodes(xpath);
  }
  
  this.getStreet = function(geocodedAddress) {
}

  /**
   * @return the title of the WMS server
   */
  this.getCoordinates = function(geocodedAddress) {
    var coordSelectXpath = "gml:Point/pos";
    var coords = featureNode.selectSingleNode(coordSelectXpath);
    if (coords) {
      var point = coords.firstChild.nodeValue.split(' ');
      return point
    } else {
      return new Array(0,0);  //or some other error to return?
    }
  }
	

}

