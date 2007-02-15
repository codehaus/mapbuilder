/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */
 
/**
 * @class
 */
OpenLayers.Geometry = OpenLayers.Class.create();
OpenLayers.Geometry.prototype = {

    /** @type OpenLayers.Style */
    style: null,
        
    /** @type OpenLayers.Bounds */
    bounds: null,
    
    /** 
     * Cross reference back to the feature that owns this geometry so
     * that that the feature can be identified after the geometry has been
     * selected by a mouse click.
     * @type OpenLayers.Feature */
    feature: null,
    
    /**
     * @constructor
     *
     * @param {array} linearRings
     */
    initialize: function() {
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME+ "_");
    },
    
    /**
     * Set the bounds for this Geometry.
     * @param {OpenLayers.Bounds} bounds
     */
    setBounds: function(bounds){
        this.bounds=bounds;
    },
    
    /**
     * Extend the existing bounds to include the new bounds. If existing
     * bounds=null, then set a new Bounds.
     * @param {Object} bounds
     */
    extendBounds: function(bounds){
        if(!this.bounds){
            this.setBounds(bounds);
        }else{
            this.bounds.extendBounds(bounds.left, bounds.top, bounds.right, bounds.bottom);
        }
    },
    
    /**
     * Get the bounds for this Geometry. The bounds will be null if not it has
     * not been set.
     * Once the bounds is set, it is not calculated again, this makes queries
     * faster.
     * @return {OpenLayers.Bounds}
     */
    getBounds: function(){
        return this.bounds;
    },
    
    /**
     * Takes an lonLat point and returns true if the geometry is at this location.
     * This is only an approximation based on the bounds of the geometry.
     * @param {OpenLayers.LonLat} lonlat
     * @param toleranceLon Optional tolerance in Geometric Coords
     * @param toleranceLat Optional tolerance in Geographic Coords
     * @return Boolean
     */
    atPoint: function(lonlat,toleranceLon,toleranceLat){
        var atPoint=false;
		toleranceLon=(toleranceLon)?toleranceLon:0;
		toleranceLat=(toleranceLat)?toleranceLat:0;
        if(this.bounds){
            atPoint=((this.bounds.bottom-toleranceLat)<=lonlat.lat)
                && (lonlat.lat<=(this.bounds.top+toleranceLat))
                && ((this.bounds.left-toleranceLon)<=lonlat.lon)
                && (lonlat.lon<=(this.bounds.right+toleranceLon));
        }
        return atPoint;
    },
    
    /**
     * Returns the length of the geometry
     */
    getLength: function() {
        return 0.0;
    },

    /**
     * Returns the area of the geometry
     */
    getArea: function() {
        return 0.0;
    },

    CLASS_NAME: "OpenLayers.Geometry"
};