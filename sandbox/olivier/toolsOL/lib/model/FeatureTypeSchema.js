/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeatureTypeSchema.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

/**
 * Stores a WFS DescribeFeatureType request reponse as defined by the Open GIS Consortium
 * http://opengis.org (WFS).  
 *
 * @constructor
 * @base ModelBase
 * @author Mike Adair
 * @param modelNode Pointer to the xml node for this model from the config file.
 * @param parent    The parent model for the object.
 */
function FeatureTypeSchema(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  ModelBase.apply(this, new Array(modelNode, parent));
}

