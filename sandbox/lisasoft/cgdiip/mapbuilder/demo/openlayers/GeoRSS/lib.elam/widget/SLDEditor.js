/*
Author:       Olivier Terral
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: SLDEditor.js 3091 2007-08-09 12:21:54Z gjvoosten $
*/


// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

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
  	
	this.postPaint = function(objRef) {
	    /*var objRef2 = config.objects.choixchamp;
	    config.objects.choixchamp.paint(objRef2,objRef2.id);*/
    }

	this.model.addListener("SLDChange",this.refresh, this);
	
	
	/**
   * Set the value of an attribute from the FeatureList.
   * @param objRef Reference to this object.
   * @param xpath Xpath reference to the attribute in the GML.
   * @param value New attribute value.
   */
   
  this.setAttr=function(objRef,xpath,value,attr){
 	if(attr){
 		xpath=xpath+"[@name='"+attr+"']";
    }
    objRef.model.setXpathValue(objRef.model,xpath,value);
  }
  /**
   * Open a popup for choose color value
   * @param inputId id of input where color is define 
   */
	 this.openColorWindow = function (inputId){
		var URL=new String("color.html?inputId="+inputId);
		day = new Date();
		id = day.getTime();
		eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=260,height=285,left=800,top=600');");
	}
}
