/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: EditPolygon.js 3052 2007-08-01 21:25:21Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");

/**
 * When this button is selected, clicks on the MapPane will add a
 * new point to a polygon.
 * @constructor
 * @base EditButtonBase
 * @author Simon Flannery simonDOTflanneryATbigpondDOTcom
 * @sponser VPAC
 * @param widgetNode The node from the Config XML file.
 * @param model The ButtonBar widget.
 */
function EditPolygon(widgetNode, model) {
  // Extend EditButtonBase
  EditButtonBase.apply(this, new Array(widgetNode, model));

  /**
   * Interactive EditPolygon control.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class(OpenLayers.Control.DrawFeature, {
      // this is needed because all editing tools are of type
      // OpenLayers.Control.DrawFeature
      CLASS_NAME: 'mbEditPolygon'
    });
    return Control;
  }
  
  this.instantiateControl = function(objRef, Control) {
    return new Control(objRef.featureLayer, OpenLayers.Handler.Polygon);
  }

  /**
   * Write geometry to the GML feature.
   * Called when a feature is finished
   * @param objRef      Pointer to this object.
   * @param {OpenLayers.Feature} feature The polygon created
   */
  this.setFeature = function(objRef, feature) {
    if (objRef.enabled) {
      var points = feature.geometry.components[0].components;
      var geom = '';
      for (var i in points) {
        geom += ' '+points[i].x+","+points[i].y;
      }
      sucess=objRef.targetModel.setXpathValue(
        objRef.targetModel,
        objRef.featureXpath,
        geom);
      if(!sucess){
        alert(mbGetMessage("invalidFeatureXpathEditPolygon", objRef.featureXpath));
      }
    }
  }
}

