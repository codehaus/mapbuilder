/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Geometry/Surface.js
 */
OpenLayers.Geometry.Polygon = OpenLayers.Class.create();
OpenLayers.Geometry.Polygon.prototype =
    OpenLayers.Class.inherit(OpenLayers.Geometry.Aggregate, {

    /**
    * @constructor
    *
    * @param {Array|OpenLayers.Geometry.Polygon}
    */
    initialize: function(components) {
    	OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
    	this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
        
        if (components != null) {
            this.addComponents(components);
        }
    },

    /**
     * adds components to the MultiPolygon
     *
     * @param {Array|OpenLayers.Geometry.Polygon} point(s) to add
     */
    addComponents: function(components) {
    	if(!(components instanceof Array)) {
            components = [components];
        }
        for (var i = 0; i < components.length; i++) {
            if (!(components[i] instanceof OpenLayers.Geometry.LinearRing)) {
                throw "component should be an OpenLayers.Geometry.LinearRing but is " + components[i].CLASS_NAME;
            }
        }
        OpenLayers.Geometry.Aggregate.prototype.addComponents.apply(this, arguments);
    },
    
    /**
     * removes components from the MultiPolygon
     *
     * @param {Array|OpenLayers.Geometry.Polygon} point(s) to add
     */
    removeComponents: function(components) {
        OpenLayers.Geometry.Aggregate.prototype.removeComponents.apply(this, arguments);
    },
    
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
        area += Math.abs(this.components[0].getArea());
        for (var i = 1; i < this.components.length; i++) {
            area -= Math.abs(this.components[i].getArea());
        }
        return area;
    },

    CLASS_NAME: "OpenLayers.Geometry.Polygon"
});
