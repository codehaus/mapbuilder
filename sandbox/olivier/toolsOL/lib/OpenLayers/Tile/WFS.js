/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

 
/**
 * @class
 * 
 * @requires OpenLayers/Tile.js
 */
OpenLayers.Tile.WFS = OpenLayers.Class.create();
OpenLayers.Tile.WFS.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Tile, {

    /** @type Array(OpenLayers.Feature)*/ 
    features: null,

    /** @type Array(String) */
    urls: null,
    
    /** 
    * @constructor
    *
    * @param {OpenLayers.Layer} layer
    * @param {OpenLayers.Pixel} position
    * @param {OpenLayers.Bounds} bounds
    * @param {Array} urls
    * @param {OpenLayers.Size} size
    */
    initialize: function(layer, position, bounds, url, size) {
        var newArguments = arguments;
        newArguments = [layer, position, bounds, null, size];
        OpenLayers.Tile.prototype.initialize.apply(this, newArguments);
        this.url = url;        
        this.features = new Array();
    },

    /**
     * 
     */
    destroy: function() {
        OpenLayers.Tile.prototype.destroy.apply(this, arguments);
        this.destroyAllFeatures();
        this.features = null;
        this.url = null;
    },

    /** Clear the tile of any bounds/position-related data so that it can 
     *   be reused in a new location.
     */
    clear: function() {
        OpenLayers.Tile.prototype.clear.apply(this, arguments);
        this.destroyAllFeatures();
    },
    
    /**
     * 
     */
    draw:function() {
/*
        if (this.drawn) {
            this.clear();
        }
        */
//        OpenLayers.Tile.prototype.draw.apply(this, arguments);
        if (this.layer.displayOutsideMaxExtent || (this.layer.maxExtent && 
            this.layer.maxExtent.intersectsBounds(this.bounds, false))) { 
            this.loadFeaturesForRegion(this.requestSuccess);
        }
    },

    /** get the full request string from the ds and the tile params 
    *     and call the AJAX loadURL(). 
    *
    *     input are function pointers for what to do on success and failure.
    * 
    * @param {function} success
    * @param {function} failure
    */
    loadFeaturesForRegion:function(success, failure) {
        OpenLayers.loadURL(this.url, null, this, success);
    },
    
    /** Return from AJAX request
    *
    * @param {} request
    */
    requestSuccess:function(request) {
        var doc = request.responseXML;
        
        if (!doc || request.fileType!="XML") {
            doc = OpenLayers.parseXMLString(request.responseText);
        }
        
        var gml = new OpenLayers.Parser.GML();
        gml.load(doc);
        var featureCollection = gml.featureCollection;
        
        this.layer.addFeatures(featureCollection);
    },

    /**
     * @param {Object} results
     */
    addResults: function(results) {
        for (var i=0; i < results.length; i++) {
            var feature = new this.layer.featureClass(this.layer, 
                                                      results[i]);
            this.features.push(feature);
        }
    },

    /** Iterate through and call destroy() on each feature, removing it from
     *   the local array
     * 
     * @private
     */
    destroyAllFeatures: function() {
        while(this.features.length > 0) {
            var feature = this.features.shift();
            feature.destroy();
        }
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Tile.WFS"
  }
);


