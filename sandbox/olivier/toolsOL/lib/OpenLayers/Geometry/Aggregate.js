/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Geometry.js
 */
OpenLayers.Geometry.Aggregate = function() {}
OpenLayers.Geometry.Aggregate.prototype = OpenLayers.Class.inherit( OpenLayers.Geometry, {

    /**
     * @returns An exact clone of this OpenLayers.Feature
     * @type OpenLayers.Feature
     */
    clone: function (obj) {
        if (obj == null) {
            obj = eval ("new " + this.CLASS_NAME + "()");
        }
        
        for (var i = 0; i < this.components.length; i++) {
            obj.addComponents(this.components[i].clone());
        }
        
        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(obj, this);
        
        return obj;
    },

    /**
     * @returns the components of the geometry
     */
    getComponents: function(){
        return this.components ? this.components : null;
    },

    /**
     * 
     */
    addComponents: function(components){
        if(!(components instanceof Array)) {
            components = [components];
        }

        if(this.components) {
            this.components = this.components.concat(components);
        } else {
            this.components = [].concat(components);
        }
        
        for (var i = 0; i < components.length; i++) {
            this.extendBounds(components[i].bounds);
        }
    },
    
    /**
     *
     */
    removeComponents: function(components) {
        if(!(components instanceof Array)) {
            components = [components];
        }
        
        for (var i = 0; i < components.length; i++) {
            this.components = OpenLayers.Util.removeItem(this.components, components[i]);
        }
        
        // TBD restrain the bounds
    },

//	/**
//	 * Takes an lonLat point and returns true if the feature is at this location.
//	 * @param {OpenLayers.LonLat} lonlat
//	 * @return Boolean
//	 */
//	atPoint: function(lonlat){
//		var atPoint=false;
//		var bounds;
//		if(this.components){
//			for(var i=0;!atPoint&&(i<this.components.length);i++){
//				atPoint=this.components[i].atPoint(lonlat);
//			}
//		}else{
//			// The following code is probably not required as
//			// agregate geometries will always have components. Right?
//			// Cameron Shorter.
//			if(this.bounds){
//				atPoint=(this.bounds.bottom<=lonlat.lat)
//				    && (lonlat.lat<=this.bounds.top)
//					&& (this.bounds.left<=lonlat.lon)
//					&& (lonlat.lon<=this.bounds.right);
//			}
//		}
//		return atPoint;
//	},
        
    /**
     * Returns the length of the geometry
     */
    getLength: function() {
        var length = 0.0;
        for (var i = 0; i < this.components.length; i++) {
            length += this.components[i].getLength();
        }
        return length;
    },
    
    /**
     * Returns the area of the geometry
     */
    getArea: function() {
        var area = 0.0;
        for (var i = 0; i < this.components.length; i++) {
            area += this.components[i].getArea();
        }
        return area;
    },
    
    destroy: function () {
        this.components.length = 0;
        this.components = null;
    },

    CLASS_NAME: "OpenLayers.Geometry.Aggregate"
});
