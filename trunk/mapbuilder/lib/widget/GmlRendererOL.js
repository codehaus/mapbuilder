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
 * @base GmlRendererBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GmlRendererOL(widgetNode, model) {
  GmlRendererBase.apply(this,new Array(widgetNode, model));
  
  // create modified OpenLayers GML layer class, which
  // uses a gml doc directly instead of loading it from
  // an URL
  var OlLayer = OpenLayers.Class(OpenLayers.Layer.GML, {
  
    loadGML: function() {
      if (!this.loaded) {
        var gml = new OpenLayers.Format.GML();
        try {
          this.proj = this.projection;
          this.addFeatures(gml.read(this.mbWidget.renderDoc));
          this.loaded = true;
        } catch (e) {
          // nothing to worry, just features without geometries in the doc
        }
      }
    },
    
    // let the layer always be visible, independent of the resolution
    calculateInRange: function() {
      return true;
    },
    
    // make destroyFeatures bullet-proof to work with undefined geometries
    destroyFeatures: function() {
      var features = this.features;
      var featuresToRemove = [];
      var feature;
      for (var i=0; i<features.length; i++) {
        feature = features[i];
        feature.mbWidgetConfig = null;
        if (!feature.geometry) {
          featuresToRemove.push(feature);
        }
      }
      this.removeFeatures(featuresToRemove);
      for (var i=0; i<featuresToRemove.length; i++) {
        featuresToRemove[i].destroy();
      }
      OpenLayers.Layer.GML.prototype.destroyFeatures.apply(this, arguments);
    },
  
    preFeatureInsert: function(feature) {
      if (feature.geometry) {
        // check if there is a source model linked with this feature
        var sourceNode = this.mbWidget.model.doc.selectSingleNode("//*[@fid='"+feature.fid+"']");
        var sourceModel = null;
        if (sourceNode) {
          sourceModel = sourceNode.getAttribute('sourceModel');
        }
        // if so, use the config from the source model
        var widgetConfig = null;
        if (sourceModel && config.objects[sourceModel].config && config.objects[sourceModel].config[this.mbWidget.id]) {
          widgetConfig = config.objects[sourceModel].config[this.mbWidget.id];
        } else {
          widgetConfig = this.mbWidget.config;
        }
        feature.mbWidgetConfig = widgetConfig;
        if (!widgetConfig.sourceSRS) {
          if (widgetConfig.featureSRS) {
            widgetConfig.sourceSRS = new OpenLayers.Projection(widgetConfig.featureSRS);
          } else {
            widgetConfig.sourceSRS = null;
          }
        }
        //in the future this will be handled internally to OpenLayers
        if (widgetConfig.sourceSRS) {
          this.convertPoints(feature.geometry, widgetConfig.sourceSRS);
        }  
      }
    },
    
    drawFeature: function(feature, style) {
      // set styles before rendering the feature
      var widgetConfig = feature.mbWidgetConfig;
      if (widgetConfig) {
        feature.style = null;
        if (widgetConfig.defaultStyle && style != "select") {
          feature.style = widgetConfig.defaultStyle.createSymbolizer ?
              widgetConfig.defaultStyle.createSymbolizer(feature) :
              widgetConfig.defaultStyle;
        }
        // set select styles
        if (widgetConfig && widgetConfig.selectStyle) {
          feature.mbSelectStyle = widgetConfig.selectStyle;
        }
      }
      OpenLayers.Layer.GML.prototype.drawFeature.apply(this, arguments);
    },
    
    convertPoints: function(component, sourceSRS) {
      if (component.CLASS_NAME == 'OpenLayers.Geometry.Point') {
        component.transform(sourceSRS, this.proj);
      } else {
        for (var i=0; i<component.components.length; ++i) {
          this.convertPoints(component.components[i], sourceSRS);
        }
      }
    },
    
    /**
     * gets a feature from the gmlRendererLayer by GML feature id.
     * @param fid GML feature id of the feature
     * @return feature OpenLayers feature matching fid
     */
    getFeatureByFid: function(fid) {
      if (!this.features) {
        return null;
      }
      for (var i = 0; i < this.features.length; ++i) {
        if (this.features[i].fid == fid) {
          return this.features[i];
        }
      }
    },
    
    destroy: function() {
      this.mbWidget = null;
      OpenLayers.Layer.Vector.prototype.destroy.apply(this, arguments);
    }
  });

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
      this.stylesheet = new XslProcessor(getNodeValue(styleNode), model.namespace);
      this.stylesheet.setParameter("proxyUrl", config.proxyUrl);
    }
  }

  // set the hover cursor.
  this.hoverCursor = this.getProperty('mb:hoverCursor', 'pointer');

  this.paint = function(objRef) {
    if (objRef.targetModel.map) {
      // remove features from layer
      if (objRef.olLayer) {
        objRef.model.setParam('gmlRendererLayer', null);
      }
      // transform the model using the xsl stylesheet if there is one,
      // otherwise just take the model doc.
      objRef.renderDoc = objRef.stylesheet ? objRef.stylesheet.transformNodeToObject(objRef.model.doc) : objRef.model.doc;
      // nothing to do here if there is no model doc
      if (!objRef.renderDoc) {
        return;
      }

      // keep a reference to the map we created the layer for
      objRef.map = objRef.targetModel.map;
      
      // add own model to array of configurations
      var models = [objRef.model];
      // get configurations from source models, if any
      if (objRef.model.mergeModels) {
        for (var i=0; i<objRef.model.mergeModels.length; i++) {
          models.push(objRef.model.mergeModels[i]);
        }
      }
      // store configurations for each source model
      for (var i = 0; i < models.length; i++) {
        var widgetConfig = config.objects[models[i].id].config ? config.objects[models[i].id].config[objRef.id] : null;
        if (!widgetConfig) {
          widgetConfig = objRef.config;
        }
        if (widgetConfig.sldModelNode) {
          var sldModel = config.objects[getNodeValue(widgetConfig.sldModelNode)];
          if (sldModel) {
            sldModel.addListener("loadModel", objRef.paint, objRef);
            if (!sldModel.doc) {
              return;
            }
            var sldNode = sldModel.getSldNode();
            if (sldModel.sld) {
              var namedLayer = sldModel.sld.namedLayers[objRef.id].userStyles;
              for (var j=0; j<namedLayer.length; ++j) {
              	namedLayer[j].propertyStyles = namedLayer[j].findPropertyStyles();
              	if (namedLayer[j].name == widgetConfig.defaultStyleName) {
              	  widgetConfig.defaultStyle = namedLayer[j];
              	}
              	if (namedLayer[j].name == widgetConfig.selectStyleName) {
              	  widgetConfig.selectStyle = namedLayer[j];
              	}
              }
              if (widgetConfig.selectStyle) {
                widgetConfig.selectStyle.defaultStyle.cursor = objRef.hoverCursor;
              }
            } else if (sldNode) {
              widgetConfig.defaultStyle =
                  sld2OlStyle(sldNode.selectSingleNode("//*[wmc:Name='"+widgetConfig.defaultStyleName+"']"));
              widgetConfig.selectStyle =
                  sld2OlStyle(sldNode.selectSingleNode("//*[wmc:Name='"+widgetConfig.selectStyleName+"']"));
              if (widgetConfig.selectStyle) {
                widgetConfig.selectStyle.cursor = objRef.hoverCursor;
              }
            }
          }
        }
      }
      
      if (!objRef.olLayer || !objRef.olLayer.mbWidget) {
        objRef.olLayer = new OlLayer(objRef.id, null, {mbWidget: objRef});
        objRef.targetModel.map.addLayer(objRef.olLayer);
      } else {
        objRef.olLayer.loaded = false;
        objRef.olLayer.destroyFeatures();
        objRef.olLayer.loadGML();
      }
      objRef.removeHiddenFeatures(objRef);
      
      objRef.model.setParam('gmlRendererLayer', objRef.olLayer);
    }
    // We add a refresh listener to the targetModel. This way we
    // can be sure that the gml renderer is reloaded when the
    // map is refreshed, and also if the map did not exist yet
    // when paint was called for the first time.
    objRef.targetModel.addListener('refresh', objRef.paint, objRef);
  }
  this.model.addListener("refresh",this.paint, this);
  
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
      for (var i=0; i<hiddenFeatures.length; i++) {
        if (hiddenFeatures[i]) {
          objRef.hideFeature(objRef, hiddenFeatures[i]);
        }
      }
    }
  }
  
  
  /**
   * Initializes this widget
   * @param objRef This object
   */
  this.init = function(objRef) {
    var clickWidgetNode =  widgetNode.selectSingleNode("mb:featureOnClick");
    if (clickWidgetNode) {
      var clickWidget = config.objects[getNodeValue(clickWidgetNode)];
      objRef.model.addListener("olFeatureSelect", clickWidget.onClick, clickWidget);
    }
    var hoverWidgetNode =  widgetNode.selectSingleNode("mb:featureOnHover");
    if (hoverWidgetNode) {
      var hoverWidget = config.objects[getNodeValue(hoverWidgetNode)];
      objRef.model.addListener("olFeatureHover", hoverWidget.onMouseover, hoverWidget);
      objRef.model.addListener("olFeatureOut", hoverWidget.onMouseout, hoverWidget);
    }
    objRef.targetModel.addListener("aoi", objRef.removeHiddenFeatures, objRef);
  }
  this.model.addListener("init", this.init, this);
  
  this.model.removeListener("newModel", this.clearWidget, this);
  this.clearWidget = function(objRef) {
    if (objRef.olLayer) {
      objRef.olLayer.loaded = false;
      for (var i=0; i<objRef.olLayer.map.controls.length; i++) {
        if (objRef.olLayer.map.controls[i].layer == objRef.olLayer) {
          objRef.olLayer.map.controls[i].destroy();
        }
      }
      objRef.olLayer.destroy();
      objRef.olLayer = null;
    }
  }
  this.model.addListener("newModel", this.clearWidget, this);
}
