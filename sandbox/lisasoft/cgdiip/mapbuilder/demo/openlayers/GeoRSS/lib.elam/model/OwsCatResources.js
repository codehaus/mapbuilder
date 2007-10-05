/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: OwsCatResources.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/FeatureCollection.js");

/**
 * Generic Model object for models where no specialization is required.  This is
 * just an instance of a abstract ModelBase.
 * @constructor
 * @base FeatureCollection
 * @author Mike Adair
 * @param modelNode The model's XML object node from the configuration document
 * @param parent Parent of this model, set to null if there is no parent.
 */
function OwsCatResources(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  FeatureCollection.apply(this, new Array(modelNode, parent));

  this.namespace = "xmlns:owscat='http://www.ec.gc.ca/owscat' xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
}

/**
 * Returns the featureType node with the specified name from the list of nodes
 * selected by the nodeSelectXpath from the capabilities doc.
 * @param featureName name of the featureType to look up
 * @return the featureType node with the specified name.
 */
OwsCatResources.prototype.getFeatureNode = function(featureName) {
    return this.doc.selectSingleNode(this.nodeSelectXpath+"[owscat:name='"+featureName+"']");
}

