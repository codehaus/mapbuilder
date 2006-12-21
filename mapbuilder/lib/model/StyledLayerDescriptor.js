 /*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/
 
 
 /**
 * Stores a SLD file  as defined by the
 * Open GIS Conortium http://opengis.org.
 *
 * @constructor
 * @base ModelBase
 * @author Olivier Terral
 * @requires Sarissa
 * @param modelNode The model's XML object node from the configuration document.
 * @param parent    The parent model for the object.
  */
  
function StyledLayerDescriptor(modelNode, parent) {

  

// Inherit the ModelBase functions and parameters
		ModelBase.apply(this, new Array(modelNode, parent));
 
this.namespace = "xmlns:sld='http://www.opengis.net/sld' xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder' xmlns:wmc='http://www.opengis.net/context' xmlns:wms='http://www.opengis.net/wms' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:wfs='http://www.opengis.net/wfs'";
		
		this.getSldNode=function()
		{
			return this.doc.selectSingleNode("/StyledLayerDescriptor");
		
		}



}