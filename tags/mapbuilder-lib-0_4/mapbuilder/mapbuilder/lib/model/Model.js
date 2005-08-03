/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

/**
 * Generic Model object for models where no specialization is required.  This is
 * just an instance of a abstract ModelBase.
 * @constructor
 * @base ModelBase
 * @author Mike Adair
 * @param modelNode The model's XML object node from the configuration document
 * @param parent Parent of this model, set to null if there is no parent.
 */
function Model(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode, parent);

}
