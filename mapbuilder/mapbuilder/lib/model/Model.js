/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Stores a Web Map Context (WMC) Collection document as defined by the Open 
 * GIS Consortium http://opengis.org and extensions the the WMC.  
 * @constructor
 * @base ModelBase
 * @author Mike Adair
 * @requires Sarissa
 * @param url Url of context collection document
 */
function Model(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode, parent);

}
