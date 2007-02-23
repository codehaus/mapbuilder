/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Geometry/LineString.js
 */
OpenLayers.Geometry.LinearRing = OpenLayers.Class.create();

OpenLayers.Geometry.LinearRing.prototype = 
    OpenLayers.Class.inherit(OpenLayers.Geometry.LineString, {

    /**
    * @constructor
    *
    * @param {array} points
    */
    initialize: function(points) {
        OpenLayers.Geometry.LineString.prototype.initialize.apply(this, arguments);
    },
    
    /**
     * @returns An exact clone of this OpenLayers.Feature
     * @type OpenLayers.Feature
     */
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Geometry.LinearRing();
        }
        
        for (var i = 0; i < this.path.length; i++) {
            obj.addPoint(this.path[i].clone());
        }
        
        return obj;
    },
    
    /**
     * Adds a point to geometry path
     *
     * @param {OpenLayers.Geometry.Point} point
     * @param {int} index
     */ 
    addPoint: function(point, index) {
        this.path.pop();
        if (this.path.length <= 1 || !(point.x == this.path[0].x && point.y == this.path[0].y)) {
            OpenLayers.Geometry.LineString.prototype.addPoint.apply(this, arguments);
        }
        this.path.push(this.path[0]);
    },
    
    /**
     * Removes a point from geometry path
     *
     * @param {OpenLayers.Geometry.Point} point
     */
    removePoint: function() {
        if (this.path.length > 4) {
            this.path.pop();
            OpenLayers.Geometry.LineString.prototype.removePoint.apply(this, arguments);
            this.path.push(this.path[0]);
        }
    },

    /**
     * @returns the coordinates path as a string
     */
    toString: function() {
        return this.path.toString();
    },
    
    /**
     * Returns the length of the geometry
     */
    getLength: function() {
        return OpenLayers.Util.length(this.path);
    },
    
    /**
     * Returns the area of the geometry
     */
    getArea: function() {
        return OpenLayers.Util.signedArea(this.path);
    },

    CLASS_NAME: "OpenLayers.Geometry.LinearRing"
});
