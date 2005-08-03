/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/tool/WebServiceAction.js");

/**
 * Functions to render and update a FeatureList from GML.
 * @constructor
 * @base WidgetBase
 * @requires WebServiceAction
 * @author Cameron Shorter
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function FeatureList(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

  /** Tool which processes form key presses. */
  this.webServiceAction=new WebServiceAction();

  /**
   * Call WebServiceAction.processAction() which processes a button press.
   * Note, when EditButton is selected, EditButton set params in the model
   * which are required by WebServiceAction.
   * @param objRef Reference to this object.
   * @param button Button name.
   */
  this.processButton=function(objRef,button){
    objRef.webServiceAction.processAction(
      objRef.webServiceAction,objRef.model,button);
  }

  /**
   * Set the value of an attribute from the FeatureList.
   * @param objRef Reference to this object.
   * @param xpath Xpath reference to the attribute in the GML.
   * @param value New attribute value.
   */
  this.setAttr=function(objRef,xpath,value){
    objRef.model.setXpathValue(objRef.model,xpath,value);
  }
}
