/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/ModelBase.js");

/**
 * Stores a WFS DescribeFeatureType request reponse as defined by the Open GIS Consortium
 * http://opengis.org (WFS).  
 * extends ModelBase, which extends Listener.
 *
 * Listener Parameters used:
 * "aoi" - ((upperLeftX,upperLeftY),(lowerRigthX,lowerRigthY)),
 *
 * @constructor
 * @author Mike Adair
 * @see ModelBase
 * @see Listener
 */
function GetFeature(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode, parent);
  this.namespace = "xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";

}

