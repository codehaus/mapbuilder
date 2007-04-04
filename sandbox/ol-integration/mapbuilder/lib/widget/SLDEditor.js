/*
Author:       Olivier Terral
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/


// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to create a SLD file or inserts it into Web Map Context  v.
 * 
 * @constructor
 * @base WidgetBaseXSL
 * @param parent This widget's object node from the configuration document.
 * @param modelNode The model that this widget is a view of.
 */



function SLDEditor(modelNode, parent) {
// Inherit the ModelBase functions and parameters
 	WidgetBaseXSL.apply(this, new Array(modelNode, parent));
 	

	/**
   * Listener method to paint this widget
   * @param layerName  the name of the layer to highlight
   */
   
  	this.refresh = function(objRef, layerName) {
  		objRef.stylesheet.setParameter("layerName", layerName );
    	objRef.paint(objRef, objRef.id);
  	}
 
	this.model.addListener("SLDChange",this.refresh, this);
	
	
	/**
   * Set the value of an attribute from the FeatureList.
   * @param objRef Reference to this object.
   * @param xpath Xpath reference to the attribute in the GML.
   * @param value New attribute value.
   */
   
  this.setAttr=function(objRef,xpath,value,attr){


 	if(attr)
 	{
 		xpath=xpath+"[@name='"+attr+"']";

    }
   
    objRef.model.setXpathValue(objRef.model,xpath,value);

  }
	
}
