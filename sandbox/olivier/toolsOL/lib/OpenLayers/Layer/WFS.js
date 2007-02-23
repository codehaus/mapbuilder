/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer/Grid.js
 * @requires OpenLayers/Layer/Markers.js
 */
OpenLayers.Layer.WFS = OpenLayers.Class.create();
OpenLayers.Layer.WFS.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer.Vector, {

    /** WFS layer is never a base layer. 
     * 
     * @type Boolean
     */
    isBaseLayer: false,
    
    /** the ratio of image/tile size to map size (this is the untiled buffer)
     * @type int */
    ratio: 2,

    /** Hashtable of default key/value parameters
     * @final @type Object */
    DEFAULT_PARAMS: { service: "WFS",
                      version: "1.0.0",
                      request: "GetFeature"
                    },
    
    /** @type Object */
    tileClass: OpenLayers.Tile.WFS,

    /**
    * @constructor
    *
    * @param {String} name
    * @param {String} url
    * @param {Object} params
    * @param {Object} options Hashtable of extra options to tag onto the layer
    */
    initialize: function(name, url, params, options) {
    
        var newArguments=new Array()
        newArguments.push(name, options);
        OpenLayers.Layer.Vector.prototype.initialize.apply(this, newArguments);
        
        this.params = params;
        OpenLayers.Util.applyDefaults(
                       this.params, 
                       OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS)
                       );
        this.url = url;
    
    },    
    

    /**
     * 
     */
    destroy: function() {
        OpenLayers.Layer.Vector.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Layer.Vector.prototype.setMap.apply(this, arguments);
    },
    
    /** 
     * @param {OpenLayers.Bounds} bounds
     * @param {Boolean} zoomChanged
     * @param {Boolean} dragging
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.Vector.prototype.moveTo.apply(this, arguments);

        // don't load wfs features while dragging, wait for drag end
        if (dragging) {
            // TBD try to hide the vector layer while dragging
            // this.setVisibility(false);
            // this will probably help for panning performances
            return false;
        }
        
        if ( zoomChanged ) {
            this.renderer.clearRoot();
        }
        
        // don't load data if current zoom level doesn't match
        if (this.map.getZoom() < this.params.maxZoomLevel) {
            return null;
        };
        
        if (bounds == null) {
            bounds = this.map.getExtent();
        }

        var firstRendering = (this.tile == null);

        //does the new bounds to which we need to move fall outside of the 
        // current tile's bounds?
        var outOfBounds = (!firstRendering &&
                           !this.tile.bounds.containsBounds(bounds));

        if ( zoomChanged || firstRendering || (!dragging && outOfBounds) ) {
            //determine new tile bounds
            var center = bounds.getCenterLonLat();
            var tileWidth = bounds.getWidth() * this.ratio;
            var tileHeight = bounds.getHeight() * this.ratio;
            var tileBounds = 
                new OpenLayers.Bounds(center.lon - (tileWidth / 2),
                                      center.lat - (tileHeight / 2),
                                      center.lon + (tileWidth / 2),
                                      center.lat + (tileHeight / 2));

            //determine new tile size
            var tileSize = this.map.getSize();
            tileSize.w = tileSize.w * this.ratio;
            tileSize.h = tileSize.h * this.ratio;

            //determine new position (upper left corner of new bounds)
            var ul = new OpenLayers.LonLat(tileBounds.left, tileBounds.top);
            var pos = this.map.getLayerPxFromLonLat(ul);

            //formulate request url string
            var url = this.getFullRequestString();
        
            var params = { BBOX:tileBounds.toBBOX() };
            url += "&" + OpenLayers.Util.getParameterString(params);

            if (!this.tile) {
                this.tile = new this.tileClass(this, pos, tileBounds, 
                                                     url, tileSize);
                this.tile.draw();
            } else {
//                OpenLayers.Util.clearArray(this.features);
                
                this.renderer.clearRoot();
                
                this.tile = null;
                this.tile = new this.tileClass(this, pos, tileBounds, 
                                                     url, tileSize);
                this.tile.draw();
            } 
        }
    },
        
    /**
     * @param {Object} obj
     * 
     * @returns An exact clone of this OpenLayers.Layer.WMS
     * @type OpenLayers.Layer.WMS
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.WFS(this.name,
                                           this.url,
                                           this.params,
                                           this.options);
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.Vector.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },

    /** combine the layer's url with its params and these newParams. 
    *   
    *    Add the SRS parameter from 'projection' -- this is probably
    *     more eloquently done via a setProjection() method, but this 
    *     works for now and always.
    * 
    * @param {Object} newParams
    * 
    * @type String
    */
    getFullRequestString:function(newParams) {
        var projection = this.map.getProjection();
        this.params.SRS = (projection == "none") ? null : projection;

        return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(
                                                    this, arguments);
    },
        
    /**
     * Called when the Ajax request returns a response
     *
     * @param {XmlNode} response from server
     */
    commitSuccess: function(request) {
        var response = request.responseText;
        if (response.indexOf('SUCCESS') != -1) {
            alert ('WFS Transaction : SUCCESS');
            this.refresh();
            // TBD redraw the layer or reset the state of features
            // foreach features: set state to null
        } else if (response.indexOf('FAILED') != -1 ||
            response.indexOf('Exception') != -1) {
            alert ('WFS Transaction : FAILED');
        }
    },
    
    /**
     * Called when the Ajax request fails
     *
     * @param {XmlNode} response from server
     */
    commitFailure: function(request) {},
    
    /**
     * Refreshes all the features of the layer
     */
    refresh: function() {
        if (this.tile) {
            this.renderer.clearRoot();
            OpenLayers.Util.clearArray(this.features);
            this.tile.draw();
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.WFS"
});
