/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeatureInfo.js 3091 2007-08-09 12:21:54Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Functions to render and update a FeatureInfoResponse from GML.
 * @constructor
 * @base WidgetBaseXSL
 * @author Steven Ottens AT geodan nl
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function FeatureInfo(widgetNode, model) {
  WidgetBaseXSL.apply(this, new Array(widgetNode, model));

  /**
   * Set the value of an attribute from the FeatureInfoResponse.
   * @param objRef Reference to this object.
   * @param xpath Xpath reference to the attribute in the GML.
   * @param value New attribute value.
   */
  this.setAttr=function(objRef,xpath,value){
    objRef.model.setXpathValue(objRef.model,xpath,value);
  }
}
