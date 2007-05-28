/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: EditPoint.js 2691 2007-04-09 09:34:50Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");

/**
 * When this button is selected, clicks on the MapPane will add a
 * new point to a model.
 * Requires an enclosing GML model.
 * @constructor
 * @base EditButtonBase
 * @author Cameron Shorter cameronATshorter.net
 * @param widgetNode The node from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function EditPoint(widgetNode, model) {
  // Extend EditButtonBase
  EditButtonBase.apply(this, new Array(widgetNode, model));

  /**
   * Interactive EditPoint control.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class.create();
    Control.prototype = OpenLayers.Class.inherit(OpenLayers.Control.DrawFeature, {
      // this is needed because all editing tools are of type
      // OpenLayers.Control.DrawFeature
      CLASS_NAME: 'mbEditPoint'
    });
    return Control;
  }
  
  this.instantiateControl = function(objRef, Control) {
    return new Control(objRef.featureLayer, OpenLayers.Handler.Point);
  }

  /**
   * Add a point to the enclosing GML model.
   * @param objRef      Pointer to this object.
   * @param {OpenLayers.Feature} feature the feature
   * created by OL.
   */
  this.setFeature = function(objRef, feature) {
    if (objRef.enabled) {
      sucess=objRef.targetModel.setXpathValue(
        objRef.targetModel,
        objRef.featureXpath,feature.geometry.x+","+feature.geometry.y);
      if(!sucess){
        alert(mbGetMessage("invalidFeatureXpathEditPoint", objRef.featureXpath));
      }
    }
  }  
}
