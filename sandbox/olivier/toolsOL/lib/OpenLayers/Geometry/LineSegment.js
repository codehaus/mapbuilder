/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Geometry/LineString.js
 */
OpenLayers.Geometry.LineSegment = OpenLayers.Class.create();
OpenLayers.Geometry.LineSegment.prototype =
    OpenLayers.Class.inherit(OpenLayers.Geometry.LineString, {

    /**
    * @constructor
    *
    * @param {OpenLayers.Geometry.Point} point
    * @param {OpenLayers.Geometry.Point} point
    */
    initialize: function(point1, point2) {
        this.path = [];
        if (point1 && point2) {
            arguments = [[point1, point2]];
            OpenLayers.Geometry.LineString.prototype.initialize.apply(this, arguments);
        }
    },
    
    /**
     * @returns a clone of the current object
     */    
    clone:function() {
        return new OpenLayers.Geometry.LineSegment(this.path); 
    },

    CLASS_NAME: "OpenLayers.Geometry.LineSegment"
    
});
