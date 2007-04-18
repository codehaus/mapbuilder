/*
Author:       Andreas Hocevar andreas.hocevarATgmail.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/Proj.js");

/**
 * Render GML into HTML.
 * Calls GmlCoordinates2Coord.xsl to convert GML to a simpler form.
 * Calls GmlRendererWZ.xsl to convert GML to wz_jsgraphics graphic function
 * calls.
 * this.targetModel references the context model with
 * width/height attributes.
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GmlRendererOL(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));
  
  /** OpenLayers GML layer which renders the model doc */
  this.olLayer = null;
  
  var tipWidget =  widgetNode.selectSingleNode("mb:tipWidget");
  if( tipWidget ) {
    this.model.tipWidgetId = tipWidget.firstChild.nodeValue;
  }

  this.paint = function(objRef) {
    // remove and destroy layer
    if (objRef.olLayer) {
      objRef.olLayer.destroy();
    }
    var doc = objRef.model.doc;
    // nothing to do here if there is no model doc
    // or if the model doc contains an editing template
    if (!doc || objRef.model.getParam('isTemplate') == true) {
      return;
    }
    
    // get style for features
    var style = new Object();
    var sldModelNode = widgetNode.selectSingleNode('mb:sldModel');
    if (sldModelNode) {
      var sldModel = config.objects[sldModelNode.firstChild.nodeValue];
      if (sldModel) {
        var targetMap = objRef.targetModel.map.mbMapPane;
        var sldNode = sldModel.getSldNode();
        style.point = targetMap.sld2OlStyle(targetMap, sldNode.selectSingleNode('//sld:PointSymbolizer'));
        style.line = targetMap.sld2OlStyle(targetMap, sldNode.selectSingleNode('//sld:LineSymbolizer'));
        style.polygon = targetMap.sld2OlStyle(targetMap, sldNode.selectSingleNode('//sld:PolygonSymbolizer'));
      }
    }
    // create modified OpenLayers GML layer class, which
    // uses a gml doc directly instead of loading it from
    // an URL
    var OlLayer = OpenLayers.Class.create();
    OlLayer.prototype = OpenLayers.Class.inherit(OpenLayers.Layer.GML, {
      loadGML: function() {
        if (!this.loaded) {
          var gml = this.format ? new this.format() : new OpenLayers.Format.GML();
          this.addFeatures(gml.read(doc));
          this.loaded = true
        }
      },
      preFeatureInsert: function(feature) {
        // set style before rendering the feature
        if (style) {
          if (feature.geometry.CLASS_NAME.indexOf('Point') > -1) {
            feature.style = style.point;
          }
          if (feature.geometry.CLASS_NAME.indexOf('Line') > -1) {
            feature.style = style.line;
          }
          if (feature.geometry.CLASS_NAME.indexOf('Polygon') > -1) {
            feature.style = style.polygon;
          }
        }
      }
    });
    objRef.olLayer = new OlLayer(objRef.model.id);
    objRef.targetModel.map.addLayer(objRef.olLayer);
  }
  this.model.addListener("refresh",this.paint, this);
  this.model.addListener("newModel",this.paint, this);

  /**
   * Called when the context's hidden attribute changes.
   * @param objRef This object.
   * @param layerName  The name of the layer that was toggled.
   */
  this.hiddenListener=function(objRef, layerName){
    //TBD not yet implemented
    alert('hide/unhide '+layerName);
  }
  this.model.addListener("hidden",this.hiddenListener,this);
  
  this.extractStyles = function(objRef, sldDoc) {
    var sldDoc = objRef.doc;
    alert(arguments.length);    
  }

}
