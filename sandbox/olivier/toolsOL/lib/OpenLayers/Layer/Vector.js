/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Layer.js
 */
OpenLayers.Layer.Vector = OpenLayers.Class.create();
OpenLayers.Layer.Vector.prototype =
  OpenLayers.Class.inherit(OpenLayers.Layer, {

    /** @type Boolean */
    isBaseLayer: false,

    /** @type Boolean */
    isFixed: false,

    /** @type Boolean */
    isVector: true,

    /** @type {Array} An array of {OpenLayer.Feature} */
    features: null,

    map: null,

    url: '',

    /** @type OpenLayers.Parser */
    parser: null,

    /** @type OpenLayers.Writer */
    writer: null,

    /** @type string */
    geometryType: null,

    /**
     * @constructor
     *
     * @param {String} name
     * @param {Object} options Hashtable of extra options to tag onto the layer.
     * Options renderer {Object}: Typically SvgRenderer or VmlRenderer.
     */
    initialize: function(name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);

        if (!this.renderer) {
            this.renderer = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#SVG", "1.1") ?
            new OpenLayers.Renderer.Svg(this.div) :
            new OpenLayers.Renderer.Vml(this.div);
        }

        if (!this.style) {
            this.style = OpenLayers.Style.DefaultRendererStyle;
        }

        // load features
        if (!this.parser) {
            //this.parser = new OpenLayers.Parser.GML();
            //this.parser.load(this.url, this.map.bbox, this.requestSuccess, this.requestFailure);
        }

        this.features = new Array();
        this.selection = new Array();
    },

    setMap: function() {
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);
        this.renderer.setSize(this.map.getSize());
    },

    onMapResize: function() {
        OpenLayers.Layer.prototype.onMapResize.apply(this, arguments);
        this.renderer.setSize(this.map.getSize());
    },

    moveTo: function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
        
        if (!dragging) {
            this.div.style.left = - parseInt(this.map.layerContainerDiv.style.left);
            this.div.style.top = - parseInt(this.map.layerContainerDiv.style.top);
            var extent = this.map.getExtent();
            this.renderer.setExtent(extent.left, extent.top,
                                    extent.getWidth(), extent.getHeight());
        }
    },

    /**
     * Adds features to the layer
     *
     * @param {array} feature collection
     */
    addFeatures: function(features) {
        if (!(features instanceof Array)) {
            features = [features];
        }

        //add reference to the layer
        for (var i = 0; i < features.length; i++) {
            features[i].layer = this;
        }

        this.features = this.features.concat(features);

        for (var i = 0; i < features.length; i++) {
            if (this.geometryType &&
                !(features[i].geometry instanceof this.geometryType)) {
                    console.log(features[i].geometry);
                    throw "addFeatures : component should be an " + this.geometryType.prototype.CLASS_NAME;
                }
            var style = features[i].geometry.style || this.style;
            var feature = this.renderer.drawGeometry(features[i].geometry, style);
            
            features[i].events = new OpenLayers.Events(features[i], $(features[i].geometry.id), null);

            features[i].toState(OpenLayers.State.INSERT);

            if (features[i].state == OpenLayers.State.INSERT) {
                this.onFeatureInsert(features[i]);
            } else if (features[i].state == OpenLayers.State.UNKNOWN) {
                this.onFeatureUnknown(features[i]);
            }
        }

        return features;
    },

    removeFeatures: function(features) {
        if (!(features instanceof Array)) {
            features = [features];
        }

        for (var i = 0; i < features.length; i++) {
            //this.features = OpenLayers.Util.removeItem(this.features, features[i]);

            var geometry = features[i].geometry;
            if (geometry.components) {
                for (var j = 0; j < geometry.components.length; j++) {
                    this.renderer.eraseGeometry(geometry.components[i]);
                }
            } else {
                this.renderer.eraseGeometry(features[i].geometry);
            }
        }


        // update the feature state
        for(var i = 0; i < features.length; i++) {
            features[i].toState(OpenLayers.State.DELETE);
        }

        return features;
    },

    updateFeatures: function(features) {
        // update the feature state
        for (var i = 0; i < features.length; i++) {
            features[i].toState(OpenLayers.State.UPDATE);

            // only call if a feature is updated
            // ie. its state may be OpenLayers.State.INSERT
            if (features[i].state == OpenLayers.State.UPDATE) {
                this.onFeatureUpdate(features[i]);
            }
        }

    },

    /**
     * Unselect the selected features
     * i.e. clears the featureSelection array
     * change the style back
     */
    clearSelection: function() {

        for (var i = 0; i < this.map.featureSelection.length; i++) {
            this.map.vectorLayer.renderer.drawGeometry(this.map.featureSelection[i].geometry, this.map.vectorLayer.style);
        }
        this.map.featureSelection = [];
    },

    /**
     * method called when a feature is updated
     */
    onFeatureUpdate: function(feature) {
        //console.log("feature updated");
    },

    /**
     * method called when a feature is inserted
     */
    onFeatureInsert: function(feature) {
        this.map.events.triggerEvent("insertfeature", feature);
    },

    /**
     * method called when a feature is added as unknown
     */
    onFeatureUnknown: function(feature) {
        //console.log("feature unknown");
    },


    commit: function() {
        if (!this.writer) {
            this.writer = new OpenLayers.Writer.WFS();
        }

        var commitSuccess = this.commitSuccess.bind(this);
        var commitFailure = this.commitFailure.bind(this);
        this.writer.commit(this.url, this.features, commitSuccess, commitFailure);
        // foreach features: set state to null
    },

    /**
     * refreshes all the features of the layer
     */
    refresh: function() {},

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.Vector"
});
