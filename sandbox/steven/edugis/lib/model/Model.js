/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Model.js 1672 2005-09-20 02:42:46Z madair1 $
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
  ModelBase.apply(this, new Array(modelNode, parent));

}
