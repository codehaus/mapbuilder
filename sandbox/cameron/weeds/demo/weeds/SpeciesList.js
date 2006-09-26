/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeatureList.js 1738 2005-10-16 19:15:14Z camerons $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Functions to select a weed species.
 * @constructor
 * @base WidgetBase
 * @author Cameron Shorter
 * @param objRef  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function SpeciesList(objRef, model) {
  WidgetBaseXSL.apply(this,new Array(objRef, model));

  /**
   * Set the value of an attribute from the SpeciesList.
   * @param objRef Reference to this object.
   * @param xpath Xpath reference to the attribute in the GML.
   * @param value New attribute value.
   */
  this.setAttr=function(objRef,xpath,value){
    objRef.model.setXpathValue(objRef.model,xpath,value);
  }
}
