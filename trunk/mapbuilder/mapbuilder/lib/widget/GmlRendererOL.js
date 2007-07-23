/*
Author:       Andreas Hocevar andreas.hocevarATgmail.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/GmlRendererBase.js");

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
  GmlRendererBase.apply(this,new Array(widgetNode, model));
  
  /** OpenLayers GML layer which renders the model doc */
  this.olLayer = null;
  
  /**
   * Style object for default renderer styling of features.
   * This holds one style for each OpenLayers feature class
   */
  this.defaultStyle = null;

  /**
   * Style object for default renderer styling of features.
   * This holds one style for each OpenLayers feature class
   */
  this.selectStyle = null;
    
  /**
   * Features that shall not be drawn
   */
  this.hiddenFeatures = new Array();
  
  // replacement for deprecated MapContainerBase
  this.containerNodeId = this.htmlTagId;
  model.containerModel = this.targetModel;
  
  // Set this.stylesheet. This is taken from WidgetBaseXSL.js
  if ( !this.stylesheet ) {
    var styleNode = widgetNode.selectSingleNode("mb:stylesheet");
    if (styleNode) {
      this.stylesheet = new XslProcessor(styleNode.firstChild.nodeValue,model.namespace);
      this.stylesheet.setParameter("proxyUrl", config.proxyUrl);
    }
  }

  // set the hover cursor.
  var hoverCursorNode = widgetNode.selectSingleNode('mb:hoverCursor');
  this.hoverCursor = hoverCursorNode ? hoverCursorNode.firstChild.nodeValue : 'pointer';

  this.paint = function(objRef) {
    if (objRef.targetModel.map) {
      // remove and destroy layer
      if (objRef.olLayer) {
        objRef.model.setParam('gmlRendererLayer', null);
        if (objRef.targetModel.map == objRef.map) {
          objRef.olLayer.destroy();
          objRef.olLayer = null;
        }
      }
      // transform the model using the xsl stylesheet if there is one,
      // otherwise just take the model doc.
      var doc = objRef.stylesheet ? objRef.stylesheet.transformNodeToObject(objRef.model.doc) : objRef.model.doc;
      // nothing to do here if there is no model doc
      if (!doc) {
        return;
      }

      // keep a reference to the map we created the layer for
      objRef.map = objRef.targetModel.map;
      
      // add own model to array of configurations
      var models = [objRef.model];
      // get configurations from source models, if any
      if (objRef.model.CLASS_NAME == 'MergeModel') {
        for (var i in objRef.model.models) {
          models.push(objRef.model.models[i]);
        }
      }
      // store configurations for each source model
      for (var i = 0; i < models.length; i++) {
        var widgetConfig = config.objects[models[i].id].config ? config.objects[models[i].id].config[objRef.id] : null;
        if (!widgetConfig) {
          widgetConfig = objRef.config;
        }
        if (widgetConfig.sldModelNode) {
          var sldModel = config.objects[widgetConfig.sldModelNode.firstChild.nodeValue];
          if (sldModel) {
            sldModel.addListener("loadModel", objRef.paint, objRef);
            if (sldModel.doc) {
              widgetConfig.defaultStyle = new Object();
              widgetConfig.selectStyle = new Object();
              var sldNode = sldModel.getSldNode();
              var sldXPath = "sld:UserStyle[sld:Name=";
              var wmcXPath = "wmc:Style[wmc:Name=";
              var defaultPointNode = "//sld:UserStyle[sld:Name='"+widgetConfig.defaultStyleName+"']//sld:PointSymbolizer";
              var defaultLineNode = "//sld:UserStyle[sld:Name='"+widgetConfig.defaultStyleName+"']//sld:LineSymbolizer";
              var defaultPolygonNode = "//sld:UserStyle[sld:Name='"+widgetConfig.defaultStyleName+"']//sld:PolygonSymbolizer";
              var selectPointNode = "//sld:UserStyle[sld:Name='"+widgetConfig.selectStyleName+"']//sld:PointSymbolizer";
              var selectLineNode = "//sld:UserStyle[sld:Name='"+widgetConfig.selectStyleName+"']//sld:LineSymbolizer";
              var selectPolygonNode = "//sld:UserStyle[sld:Name='"+widgetConfig.selectStyleName+"']//sld:PolygonSymbolizer";
              widgetConfig.defaultStyle.point = sld2OlStyle(sldNode.selectSingleNode(defaultPointNode));
              if (!widgetConfig.defaultStyle.point) {
                widgetConfig.defaultStyle.point = sld2OlStyle(sldNode.selectSingleNode(defaultPointNode.replace(sldXPath, wmcXPath)));
              }
              widgetConfig.defaultStyle.line = sld2OlStyle(sldNode.selectSingleNode(defaultLineNode));
              if (!widgetConfig.defaultStyle.line) {
                widgetConfig.defaultStyle.line = sld2OlStyle(sldNode.selectSingleNode(defaultLineNode.replace(sldXPath, wmcXPath)));
              }
              widgetConfig.defaultStyle.polygon = sld2OlStyle(sldNode.selectSingleNode(defaultPolygonNode));
              if (!widgetConfig.defaultStyle.polygon) {
                widgetConfig.defaultStyle.polygon = sld2OlStyle(sldNode.selectSingleNode(defaultPolygonNode.replace(sldXPath, wmcXPath)));
              }
              widgetConfig.selectStyle.point = sld2OlStyle(sldNode.selectSingleNode(selectPointNode));
              if (!widgetConfig.selectStyle.point) {
                widgetConfig.selectStyle.point = sld2OlStyle(sldNode.selectSingleNode(selectPointNode.replace(sldXPath, wmcXPath)));
              }
              widgetConfig.selectStyle.line = sld2OlStyle(sldNode.selectSingleNode(selectLineNode));
              if (!widgetConfig.selectStyle.line) {
                widgetConfig.selectStyle.line = sld2OlStyle(sldNode.selectSingleNode(selectLineNode.replace(sldXPath, wmcXPath)));
              }
              widgetConfig.selectStyle.polygon = sld2OlStyle(sldNode.selectSingleNode(selectPolygonNode));
              if (!widgetConfig.selectStyle.polygon) {
                widgetConfig.selectStyle.polygon = sld2OlStyle(sldNode.selectSingleNode(selectPolygonNode.replace(sldXPath, wmcXPath)));
              }
              if (widgetConfig.selectStyle.point) {
                widgetConfig.selectStyle.point.cursor = widgetConfig.hoverCursor;
              }
              if (widgetConfig.selectStyle.line) {
                widgetConfig.selectStyle.line.cursor = widgetConfig.hoverCursor;
              }
              if (widgetConfig.selectStyle.polygon) {
                widgetConfig.selectStyle.polygon.cursor = widgetConfig.hoverCursor;
              }
            }
          }
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
            this.loaded = true;
          }
        },

        preFeatureInsert: function(feature) {
          if (feature.geometry) {
            // check if there is a source model linked with this feature
            var sourceNode = objRef.model.doc.selectSingleNode(objRef.model.idXPath+"[@"+objRef.model.idAttribute+"='"+feature.fid+"']");
            var sourceModel = null;
            if (sourceNode) {
              sourceModel = sourceNode.getAttribute('sourceModel');
            }
            // if so, use the config from the source model
            var widgetConfig = null;
            if (sourceModel && config.objects[sourceModel].config && config.objects[sourceModel].config[objRef.id]) {
              widgetConfig = config.objects[sourceModel].config[objRef.id];
            } else {
              widgetConfig = objRef.config;
            }
            // set styles before rendering the feature
            if (widgetConfig.defaultStyle) {
              if (feature.geometry.CLASS_NAME.indexOf('Point') > -1) {
                feature.style = widgetConfig.defaultStyle.point;
              } else
              if (feature.geometry.CLASS_NAME.indexOf('Line') > -1) {
                feature.style = widgetConfig.defaultStyle.line;
              } else
              if (feature.geometry.CLASS_NAME.indexOf('Polygon') > -1) {
                feature.style = widgetConfig.defaultStyle.polygon;
              }
            }
            // set select styles
            if (widgetConfig.selectStyle) {
              if (feature.geometry.CLASS_NAME.indexOf('Point') > -1) {
                feature.mbSelectStyle = widgetConfig.selectStyle.point;
              } else
              if (feature.geometry.CLASS_NAME.indexOf('Line') > -1) {
                feature.mbSelectStyle = widgetConfig.selectStyle.line;
              } else
              if (feature.geometry.CLASS_NAME.indexOf('Polygon') > -1) {
                feature.mbSelectStyle = widgetConfig.selectStyle.polygon;
              }
            }
          }
        },
        
        /**
         * gets a feature from the gmlRendererLayer by GML feature id.
         * @param fid GML feature id of the feature
         * @return feature OpenLayers feature matching fid
         */
        getFeatureByFid: function(fid) {
          var layer = objRef.olLayer;
          if (!layer) {
            return null;
          }
          var features = layer.features;
          if (!features) {
            return null;
          }
          for (var i = 0; i < features.length; ++i) {
            if (features[i].fid == fid) {
              return features[i];
            }
          }
        }
      });
      
      objRef.olLayer = new OlLayer(objRef.id);
      objRef.targetModel.map.addLayer(objRef.olLayer);
      
      objRef.model.setParam('gmlRendererLayer', objRef.olLayer);
    }
    // We add a refresh listener to the targetModel. This way we
    // can be sure that the gml renderer is reloaded when the
    // map is refreshed, and also if the map did not exist yet
    // when paint was called for the first time.
    objRef.targetModel.addListener('refresh', objRef.paint, objRef);
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
  
  /**
   * Hides the feature specified by its fid from the map
   * @param objRef this widget
   * @param fid feature id of the feature to hide. If it is null,
   * the hideFeature param of the model will be used.
   */
  this.hideFeature = function(objRef, fid) {
    if (!fid) {
      fid = objRef.model.getParam('hideFeature');
    }
    var feature = objRef.olLayer.getFeatureByFid(fid);
    if (feature) {
      objRef.hiddenFeatures.push(fid);
      // mark the feature as hidden - this will be checked by other widgets
      feature.mbHidden = true;
      objRef.olLayer.renderer.eraseGeometry(feature.geometry);      
    }
  }
  this.model.addListener("hideFeature", this.hideFeature, this);
  
  /**
   * Shows the feature specified by its fid in the map
   * @param objRef this widget
   * @param fid feature id of the feature to show. If it is null,
   * the showFeature param of the model will be used.
   */
  this.showFeature = function(objRef, fid) {
    if (!fid) {
      fid = objRef.model.getParam('showFeature');
    }
    var feature = objRef.olLayer.getFeatureByFid(fid);
    if (feature) {
      OpenLayers.Util.removeItem(objRef.hiddenFeatures, fid);
      // mark the feature as visible - this will be checked by other widgets
      feature.mbHidden = false;
      objRef.olLayer.drawFeature(feature);
    }
  }
  this.model.addListener("showFeature", this.showFeature, this);
  
  this.removeHiddenFeatures = function(objRef) {
    if (objRef.olLayer) {
      // remove hidden features
      var hiddenFeatures = objRef.hiddenFeatures.toString().split(/,/);
      objRef.hiddenFeatures = new Array();
      for (var i in hiddenFeatures) {
        if (hiddenFeatures[i]) {
          objRef.hideFeature(objRef, hiddenFeatures[i]);
        }
      }
    }
  }
  
  
  /**
   * Initializes the tip widget for this widget
   * @param objRef This object
   */
  this.init = function(objRef) {
    var clickWidgetNode =  widgetNode.selectSingleNode("mb:featureOnClick");
    if (clickWidgetNode) {
      var clickWidget = config.objects[clickWidgetNode.firstChild.nodeValue];
      objRef.model.addListener("olFeatureSelect", clickWidget.onClick, clickWidget);
    }
    var hoverWidgetNode =  widgetNode.selectSingleNode("mb:featureOnHover");
    if (hoverWidgetNode) {
      var hoverWidget = config.objects[hoverWidgetNode.firstChild.nodeValue];
      objRef.model.addListener("olFeatureHover", hoverWidget.onMouseover, hoverWidget);
      objRef.model.addListener("olFeatureOut", hoverWidget.onMouseout, hoverWidget);
    }
    objRef.targetModel.addListener("aoi", objRef.removeHiddenFeatures, objRef);
  }
  this.model.addListener("init", this.init, this);
}
