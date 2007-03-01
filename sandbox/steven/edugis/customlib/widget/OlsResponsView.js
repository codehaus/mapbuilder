/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: OlsResponsView.js,v 1.0 2005/09/21 08:22:13 graphrisc Exp $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Functions to render and update a FeatureInfoResponse from GML.
 * @constructor
 * @base WidgetBase
 * @author Steven Ottens AT geodan nl
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function OlsResponsView(widgetNode, model) {
  WidgetBaseXSL.apply(this, new Array(widgetNode, model));

this.pm=widgetNode.selectSingleNode("mb:puntModel").firstChild.nodeValue;
 this.stylesheet.setParameter("puntModelId", this.puntModel );
  /** Empty GML to load when this tool is selected. */
  this.defaultModelUrl=widgetNode.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;

  /** Reference to GML node to update when a feature is added. */
  this.featureXpath=widgetNode.selectSingleNode("mb:featureXpath").firstChild.nodeValue;
	
	this.loadParameters = function(objRef){
	objRef.stylesheet.setParameter("zoom", objRef.model.zoom );
	objRef.stylesheet.setParameter("mark", objRef.model.point );
	}
	this.model.addListener("pointZoom", this.loadParameters, this);

	
  /**
   * Set the value of an attribute from the FeatureInfoResponse.
   * @param objRef Reference to this object.
   * @param xpath Xpath reference to the attribute in the GML.
   * @param value New attribute value.
   */
  this.setAttr=function(objRef,xpath,value){
    objRef.model.setXpathValue(objRef.model,xpath,value);
			 }

	this.addPoint = function(objRef, x, y){
		if(!objRef.puntModel){
	objRef.puntModel=window.config.objects[objRef.pm];
	}
 
		
		old=objRef.puntModel.getXpathValue(objRef.puntModel,objRef.featureXpath);
		if(!old) old="";
		old=x+","+y + " " + old;
	 sucess=objRef.puntModel.setXpathValue(
        objRef.puntModel,
        objRef.featureXpath,old);
      if(!sucess){
        alert("EditPoint: invalid featureXpath in config: "+objRef.featureXpath);
      }
	}
}
