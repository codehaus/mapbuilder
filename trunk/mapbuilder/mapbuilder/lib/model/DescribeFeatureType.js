/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Stores a WFS DescribeFeatureType request reponse as defined by the Open GIS Consortium
 * http://opengis.org (WFS).  
 *
 * Listener Parameters used:
 * "aoi" - ((upperLeftX,upperLeftY),(lowerRigthX,lowerRigthY)),
 *
 * @constructor
 * @base ModelBase
 * @author Mike Adair
 */
function DescribeFeatureType(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode, parent);

}

