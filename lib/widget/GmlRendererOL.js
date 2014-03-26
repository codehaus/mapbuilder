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
  
  // start copy from OpenLayers/lib/deprecated.js OpenLayers.Layer.GML
  OpenLayers.Layer.GML = OpenLayers.Class(OpenLayers.Layer.Vector, {

    /**
      * Property: loaded
      * {Boolean} Flag for whether the GML data has been loaded yet.
      */
    loaded: false,

    /**
      * APIProperty: format
      * {<OpenLayers.Format>} The format you want the data to be parsed with.
      */
    format: null,

    /**
     * APIProperty: formatOptions
     * {Object} Hash of options which should be passed to the format when it is
     * created. Must be passed in the constructor.
     */
    formatOptions: null,

    /**
     * Constructor: OpenLayers.Layer.GML
     * Load and parse a single file on the web, according to the format
     * provided via the 'format' option, defaulting to GML.
     *
     * Parameters:
     * name - {String}
     * url - {String} URL of a GML file.
     * options - {Object} Hashtable of extra options to tag onto the layer.
     */
     initialize: function(name, url, options) {
        var newArguments = [];
        newArguments.push(name, options);
        OpenLayers.Layer.Vector.prototype.initialize.apply(this, newArguments);
        this.url = url;
    },

    /**
     * APIMethod: setVisibility
     * Set the visibility flag for the layer and hide/show&redraw accordingly.
     * Fire event unless otherwise specified
     * GML will be loaded if the layer is being made visible for the first
     * time.
     *
     * Parameters:
     * visible - {Boolean} Whether or not to display the layer
     *                          (if in range)
     * noEvent - {Boolean}
     */
    setVisibility: function(visibility, noEvent) {
        OpenLayers.Layer.Vector.prototype.setVisibility.apply(this, arguments);
        if(this.visibility && !this.loaded){
            // Load the GML
            this.loadGML();
        }
    },

    /**
     * Method: moveTo
     * If layer is visible and GML has not been loaded, load GML, then load GML
     * and call OpenLayers.Layer.Vector.moveTo() to redraw at the new location.
     *
     * Parameters:
     * bounds - {Object}
     * zoomChanged - {Object}
     * minor - {Object}
     */
    moveTo:function(bounds, zoomChanged, minor) {
        OpenLayers.Layer.Vector.prototype.moveTo.apply(this, arguments);
        // Wait until initialisation is complete before loading GML
        // otherwise we can get a race condition where the root HTML DOM is
        // loaded after the GML is paited.
        // See http://trac.openlayers.org/ticket/404
        if(this.visibility && !this.loaded){
            this.loadGML();
        }
    },

    /**
     * Method: loadGML
     */
    loadGML: function() {
        if (!this.loaded) {
            this.events.triggerEvent("loadstart");
            OpenLayers.Request.GET({
                url: this.url,
                success: this.requestSuccess,
                failure: this.requestFailure,
                scope: this
            });
            this.loaded = true;
        }
    },

    /**
     * Method: setUrl
     * Change the URL and reload the GML
     *
     * Parameters:
     * url - {String} URL of a GML file.
     */
    setUrl:function(url) {
        this.url = url;
        this.destroyFeatures();
        this.loaded = false;
        this.loadGML();
    },

    /**
     * Method: requestSuccess
     * Process GML after it has been loaded.
     * Called by initialize() and loadUrl() after the GML has been loaded.
     *
     * Parameters:
     * request - {String}
     */
    requestSuccess:function(request) {
        var doc = request.responseXML;

        if (!doc || !doc.documentElement) {
            doc = request.responseText;
        }

        var options = {};

        OpenLayers.Util.extend(options, this.formatOptions);
        if (this.map && !this.projection.equals(this.map.getProjectionObject())) {
            options.externalProjection = this.projection;
            options.internalProjection = this.map.getProjectionObject();
        }

        var gml = this.format ? new this.format(options) : new OpenLayers.Format.GML(options);
        this.addFeatures(gml.read(doc));
        this.events.triggerEvent("loadend");
    },

    /**
     * Method: requestFailure
     * Process a failed loading of GML.
     * Called by initialize() and loadUrl() if there was a problem loading GML.
     *
     * Parameters:
     * request - {String}
     */
    requestFailure: function(request) {
        OpenLayers.Console.userError('Error in loading GML file ' +  this.url);
        this.events.triggerEvent("loadend");
    },

    CLASS_NAME: "OpenLayers.Layer.GML"
  });
  // end copy from OpenLayers/lib/deprecated.js OpenLayers.Layer.GML

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
          alert(mbGetMessage("documentParseError",
              new XMLSerializer().serializeToString(this.mbWidget.renderDoc)));
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
        var defaultStyle = widgetConfig.defaultStyle;
        if (defaultStyle && style != "select") {
          defaultStyle.defaultsPerSymbolizer = false;
          feature.style = defaultStyle.createSymbolizer ?
              defaultStyle.createSymbolizer(feature) : defaultStyle;
        }
        // set select styles
        var selectStyle = widgetConfig.selectStyle;
        if (widgetConfig && selectStyle) {
          selectStyle.defaultsPerSymbolizer = false;
          feature.mbSelectStyle = selectStyle;
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
