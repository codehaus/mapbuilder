/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/ModelBase.js");

/**
 * Stores a GML document as defined by the Open GIS Consortium
 * http://opengis.org and extensions the the WMC.
 *
 * @constructor
 * @base ModelBase
 * @author Cameron Shorter
 * @requires Sarissa
 * @param modelNode The model's XML object node from the configuration document.
 * @param parent Parent model, if required.
  */
function Gml2(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode, parent);
  this.namespace = "xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
}

