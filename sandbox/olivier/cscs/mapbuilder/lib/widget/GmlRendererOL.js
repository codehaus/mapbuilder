/*
Author:       Andreas Hocevar andreas.hocevarATgmail.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: GmlRendererOL.js 2801 2007-05-14 06:59:10Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Render GML into HTML.
 * this.targetModel references the context model for the map
 * where the content of this widget should be rendered to.
 * If the model doc is not wfs compliant, a stylesheet
 * property has to be set for this widget. The xsl file
 * referenced in this property transforms the model doc to
 * a wfs FeatureCollection.
 * @constructor
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

  // Set this.stylesheet. This is taken from WidgetBaseXSL.js
  if ( !this.stylesheet ) {
    var styleNode = widgetNode.selectSingleNode("mb:stylesheet");
    if (styleNode ) {
      this.stylesheet = new XslProcessor(styleNode.firstChild.nodeValue,model.namespace);
    }
  }

  this.paint = function(objRef) {
    // remove and destroy layer
    if (objRef.olLayer) {
      objRef.model.setParam('gmlRendererLayer', null);
      objRef.olLayer.destroy();
      objRef.olLayer = null;
    }
    // transform the model using the xsl stylesheet if there is one,
    // otherwise just take the model doc.
    var doc = objRef.stylesheet ? objRef.stylesheet.transformNodeToObject(objRef.model.doc) : objRef.model.doc;
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
    objRef.model.setParam('gmlRendererLayer', objRef.olLayer);
  }
  this.model.addListener("refresh",this.paint, this);
  //TBD I (ahocevar) am not exactly sure why using the newModel
  // event breaks InsertFeature and DeleteFeature, but only
  // when used for the first time when no vector rendering was
  // done before on the GmlRendererLayer. I added a call for the
  // refreshGmlRenderes listeners in DeleteFeature.js and
  // InsertFeature.js, and if we listen to that event here
  // it works.
  this.model.addListener("refreshGmlRenderers",this.paint, this);

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
}
