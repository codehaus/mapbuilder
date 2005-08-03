/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/ModelBase.js");

/**
 * Stores a WFS Transaction reponse as defined by the Open GIS Consortium
 * http://opengis.org (WFS).  
 * Extends ModelBase, which extends Listener.
 *
 * Listeners implemented:
 *
 * @constructor
 * @author Mike Adair
 * @param modelNode Pointer to the xml node for this model from the config file.
 * @param parent    The parent model for the object.
 */
function Transaction(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode, parent);
  this.namespace = "xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";

}

