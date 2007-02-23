/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

// pgiraud : Global variables, should be used for WFS transactions

/**
 * Represents state in Transaction Handler
 */
OpenLayers.State = {
    /** states */
    UNKNOWN: 'Unknown',
    INSERT: 'Insert',
    UPDATE: 'Update',
    DELETE: 'Delete'
}

/**
 * @class
 * 
 * @requires OpenLayers/Util.js
 */
OpenLayers.Feature = OpenLayers.Class.create();
OpenLayers.Feature.prototype= {

    /** @type OpenLayers.Events */
    events:null,

    /** @type OpenLayers.Layer */
    layer: null,

    /** @type String */
    id: null,
    
    /** @type OpenLayers.Geometry */
    geometry:null,

    /** @type Object */
    data:null,

    /** @type OpenLayers.Marker */
    marker: null,

    /** @type array */
    attributes: null,

    /** @type OpenLayers.Popup */
    popup: null,
    
    /** @type strinng */
    state: null,
    
    /** @type OpenLayers.Events */
    events: null,

    /** 
     * @constructor
     * 
     * @param {OpenLayers.Layer} layer
     * @param {OpenLayers.Geometry} geometry
     * @param {Object} data
     */
    initialize: function(layer, geometry, data) {
        this.layer = layer;
        this.setGeometry(geometry);
        this.data = (data != null) ? data : new Object();
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_"); 
        this.state = null;
    },
    
        
   /**
    * @returns An exact clone of this OpenLayers.Feature
    * @type OpenLayers.Feature
    */
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Feature(null, this.geometry.clone(), this.data);
        } 
        
        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(obj, this);
        
        return obj;
    },

    /**
     * 
     */
    destroy: function() {

        //remove the popup from the map
        if ((this.layer != null) && (this.layer.map != null)) {
            if (this.popup != null) {
                this.layer.map.removePopup(this.popup);
            }
        }

        this.events = null;
        this.layer = null;
        this.id = null;
        this.geometry = null;
        this.data = null;
        if (this.marker != null) {
            this.destroyMarker(this.marker);
            this.marker = null;
        }
        if (this.popup != null) {
            this.destroyPopup(this.popup);
            this.popup = null;
        }
        this.events = null;
    },
    
    /**
     * @returns Whether or not the feature is currently visible on screen
     *           (based on its 'geometry' property)
     * @type Boolean
     */
    onScreen:function() {
        
        var onScreen = false;
        if ((this.layer != null) && (this.layer.map != null)) {
            var screenBounds = this.layer.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.geometry);
        }    
        return onScreen;
    },
    

    /**
     * @returns A Marker Object created from the 'lonlat' and 'icon' properties
     *          set in this.data. If no 'geometry' is set, returns null. If no
     *          'icon' is set, OpenLayers.Marker() will load the default image.
     *          
     *          Note: this.marker is set to return value
     * 
     * @type OpenLayers.Marker
     */
    createMarker: function() {

        var marker = null;
        
        if (this.geometry != null) {
            this.marker = new OpenLayers.Marker(this.geometry, this.data.icon);
        }
        return this.marker;
    },

    /** If user overrides the createMarker() function, s/he should be able
     *   to also specify an alternative function for destroying it
     */
    destroyMarker: function() {
        this.marker.destroy();  
    },

    /**
     * @returns A Popup Object created from the 'geometry', 'popupSize',
     *          and 'popupContentHTML' properties set in this.data. It uses
     *          this.marker.icon as default anchor. 
     *          
     *          If no 'geometry' is set, returns null. 
     *          If no this.marker has been created, no anchor is sent.
     * 
     *          Note: this.popup is set to return value
     * 
     * @type OpenLayers.Popup.AnchoredBubble
     */
    createPopup: function() {

        if (this.geometry != null) {
            
            var id = this.id + "_popup";
            var anchor = (this.marker) ? this.marker.icon : null;

            this.popup = new OpenLayers.Popup.AnchoredBubble(id, 
                                                    this.geometry,
                                                    this.data.popupSize,
                                                    this.data.popupContentHTML,
                                                    anchor); 
        }        
        return this.popup;
    },

    /**
     * Set a geometry to the feature
     *
     * @param {OpenLayers.Geometry} geometry to set
     */
    setGeometry: function(geometry) {
        if(geometry){
            this.geometry = geometry;
            this.geometry.feature = this;
            this._setGeometryFeatureReference(this.geometry, this);
        }
    },
    
    /**
     * Sets recursively the reference to the feature in the geometry
     *
     * @param {OpenLayers.Geometry}
     * @param {OpenLayers.Feature}
     */
    _setGeometryFeatureReference: function(geometry, feature) {
        geometry.feature = feature;
        if (geometry.components) {
            for (var i = 0; i < geometry.components.length; i++) {
                this._setGeometryFeatureReference(geometry.components[i], feature);
            }
        }
    },
    
    /**
     * Adds attributes an attributes object to the feature.
     * (should not be in geometry but in feature class)
     *
     * @param {Attributes} attributes
     */
    setAttributes: function(attributes) {
        this.attributes=attributes;
    },

//    /**
//     * Removes attributes from the feature
//     * (should not be in geometry but in feature class)
//     *
//     * @param {?} attributes to remove, can be an array
//     */
//    removeAttributes: function(attributes) {
//        if (!(attributes instanceof Array)) {
//            attributes = [attributes];
//        }
//        
//        // do something to remove attributes
//        // not implemented yet
//    },

    /**
     * Takes an lonLat point and returns true if the feature is at this location.
     * @param {OpenLayers.LonLat} lonlat
     * @param toleranceLon Optional tolerance in Geometric Coords
     * @param toleranceLat Optional tolerance in Geographic Coords
     * @return Boolean
     */
    atPoint: function(lonlat,toleranceLon,toleranceLat){
        var atPoint=false;
        if(this.geometry){
            atPoint=this.geometry.atPoint(lonlat,toleranceLon,toleranceLat);
        }
        return atPoint;
    },

    /**
     * Set geometry style
     *
     * @param {OpenLayers.Style} attributes to remove, can be an array
     */
    setStyle: function(style) {
        this.style = style;
    },

    /**
     * Get the current geometry style
     * 
     */    
    getStyle: function() {
        return style;
    },
    
    /** As with the marker, if user overrides the createPopup() function, s/he 
     *   should also be able to override the destruction
     */
    destroyPopup: function() {
        this.popup.destroy() 
    },
    
    /**
     * Sets the new state
     * @param {String} state
     */
    toState: function(state) {
        if (state == OpenLayers.State.UPDATE) {
            switch (this.state) {
                case OpenLayers.State.UNKNOWN:
                case OpenLayers.State.DELETE:
                    this.state = state;
                    break;
                case OpenLayers.State.UPDATE:
                case OpenLayers.State.INSERT:
                    break;
            }
        } else if (state == OpenLayers.State.INSERT) {
            switch (this.state) {
                case OpenLayers.State.UNKNOWN:
                    break;
                default:
                    this.state = state;
                    break;
            }
        } else if (state == OpenLayers.State.DELETE) {
            switch (this.state) {
                case OpenLayers.State.INSERT:
                    // the feature should be destroyed
                    break;
                case OpenLayers.State.DELETE:
                    break;
                case OpenLayers.State.UNKNOWN:
                case OpenLayers.State.UPDATE:
                    this.state = state;
                    break;
            }
        } else if (state == OpenLayers.State.UNKNOWN) {
            this.state = state;
        }
    },
    
    destroy: function() {
    
    },
    
    CLASS_NAME: "OpenLayers.Feature"
};
