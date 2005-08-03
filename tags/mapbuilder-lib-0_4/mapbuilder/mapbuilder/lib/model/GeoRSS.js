/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

/**
 * Stores a GML Feature or FeatureCollection as defined by the
 * Open GIS Conortium http://opengis.org.
 *
 * @constructor
 * @base ModelBase
 * @author Cameron Shorter
 * @requires Sarissa
 * @param modelNode The model's XML object node from the configuration document.
 * @param parent    The parent model for the object.
  */
function GeoRSS(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode, parent);

  /**
   * convert coordinates in the GML document to the SRS of the map container, 
   * if required.  The coordinate values are replaced in the GML document.
   * @param objRef Pointer to this object.
   */
  this.initItems = function(objRef) {
    var items = objRef.doc.selectNodes("rdf:RDF/rss:item");
    for (var i=0; i<items.length; ++i) {
      var item = items[i];
      item.setAttribute("id", "RSS_Item_"+mbIds.getId());
      //convert to GML?
    }
  }
  this.addFirstListener("loadModel",this.initItems,this);

  /**
   * Returns the list of nodes selected by the nodeSelectpath
   * @return list of nodes selected 
   */
  this.getFeatureNodes = function() {
    return this.doc.selectNodes(this.nodeSelectXpath);
  }

  /**
   * Returns a label for a node in the feature list
   * @param featureNode the feature node to selectfrom
   * @return a label for this feature
   */
  this.getFeatureName = function(featureNode) {
    var labelNode = featureNode.selectSingleNode("rss:title");
    return labelNode?labelNode.firstChild.nodeValue:"No RSS title";
  }

  /**
   * Returns an ID value for a node in the feature list
   * @param featureNode the feature node to selectfrom
   * @return ID for this feature
   */
  this.getFeatureId = function(featureNode) {
    return featureNode.getAttribute("id")?featureNode.getAttribute("id"):"no_id";
  }

  /**
   * Returns a point geometry for the feature
   * @param featureNode the feature node to select from
   * @return the geometric point for the node
   */
  this.getFeaturePoint = function(featureNode) {
    if (featureNode.selectSingleNode("geo:long")) {
      var pointX = featureNode.selectSingleNode("geo:long").firstChild.nodeValue;
      var pointY = featureNode.selectSingleNode("geo:lat").firstChild.nodeValue;
      return new Array(pointX, pointY);
    } else {
      return new Array(0,0);  //or some other error to return?
    }
  }



}

