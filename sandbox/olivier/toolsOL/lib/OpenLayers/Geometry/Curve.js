/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Geometry.js
 */

OpenLayers.Geometry.Curve = OpenLayers.Class.create();
OpenLayers.Geometry.Curve.prototype = 
  OpenLayers.Class.inherit(OpenLayers.Geometry, {

    /**
    * @constructor
    *
    * @param {array} points
    */
    initialize: function(points) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        
        this.path = [];
        
        if (points && points instanceof Array) {
            for (var i = 0; i < points.length; i++) {
                this.addPoint(points[i]);
            }
        }
                
        this.bounds = this.getBounds();
//        this.bbox = new OpenLayers.Geometry.Rectangle();
//        this.bbox.geometry = this;
    },
    
    /**
     * @returns An exact clone of this OpenLayers.Feature
     * @type OpenLayers.Feature
     */
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Geometry.Curve();
        }
        
        for (var i = 0; i < this.path.length; i++) {
            obj.addPoint(this.path[i].clone());
        }
        
        return obj;
    },

    /**
     * Get the bounds for this Geometry. The bounds will be null if has
     * not been set.
     * Once the bounds is set, it is not calculated again, this makes queries
     * faster.
     * @return {OpenLayers.Bounds}
     */
    getBounds: function(){
        if (this.path.length > 0) {
            var xmin, ymin, xmax, ymax = null;
            for (var i=0; i < this.path.length; i++) {
                var point = this.path[i];
                if (point.lon < xmin || xmin == null) {
                    xmin = point.lon;
                }
                if (point.lon > xmax || xmax == null) {
                    xmax = point.lon;
                }
                if (point.lat < ymin || ymin == null) {
                    ymin = point.lat;
                }
                if (point.lat > ymax || ymax == null) {
                    ymax = point.lat;
                }
            }
            var bounds = new OpenLayers.Bounds(xmin, ymin, xmax, ymax);
            return bounds;
        } else {
            return null;
        }
    },

    /**
     * Adds a point to geometry path at the given index (optional)
     * or a the end of the path
     *
     * @param {OpenLayers.Geometry.Point} point
     * @param {int} index
     */
    addPoint: function(point, index) {
    	point.isVertex = true;
        if (point) {
            if (index) {
                var path1 = this.path.slice(0, index);
                var path2 = this.path.slice(index, this.path.length);
                this.path = path1.concat([point], path2);
            } else {
                this.path.push(point);
            }
            var bounds = new OpenLayers.Bounds(point.lon, point.lat, point.lon, point.lat);
            this.extendBounds(bounds);
        }
    },
    
    /**
     * Removes a point from geometry path
     *
     * @param {OpenLayers.Geometry.Point} point
     */
    removePoint: function(point){
        this.path = OpenLayers.Util.removeItem(this.path, point);
    },
    
    getLength: function() {
        return OpenLayers.Util.length(this.path);
    },
    
    destroy: function () {
        this.path.length = 0;
        this.path = null;
    },
    
    CLASS_NAME: "OpenLayers.Geometry.Curve"
});