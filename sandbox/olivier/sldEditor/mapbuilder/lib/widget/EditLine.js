/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");

/**
 * When this button is selected, clicks on the MapPane will add a
 * new point to a line.
 * @constructor
 * @base EditButtonBase
 * @author Cameron Shorter cameronATshorter.net
 * @param widgetNode The from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function EditLine(widgetNode, model) {
  // Extend EditButtonBase
  EditButtonBase.apply(this, new Array(widgetNode, model));

  /**
   * Interactive EditLine control.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class.create();
    Control.prototype = OpenLayers.Class.inherit(OpenLayers.Control.DrawFeature, {
      // this is needed because all editing tools are of type
      // OpenLayers.Control.DrawFeature
      CLASS_NAME: 'mbEditLine'
    });
    return Control;
  }
  
  this.instantiateControl = function(objRef, Control) {
    return new Control(objRef.featureLayer, OpenLayers.Handler.Path);
  }

  /**
   * Append a line to the enclosing GML model.
   * @param objRef      Pointer to this object.
   * @param {OpenLayers.Feature} feature The line created
   * by OL.
   */
  this.setFeature = function(objRef, feature) {
    if (objRef.enabled) {
      var points = feature.geometry.components;
      var geom = '';
      for (var i in points) {
        geom += ' '+points[i].x+","+points[i].y;
      }
      sucess=objRef.targetModel.setXpathValue(
        objRef.targetModel,
        objRef.featureXpath,
        geom);
      if(!sucess){
        alert(mbGetMessage("invalidFeatureXpathEditLine", objRef.featureXpath));
      }
    }
  }
}
