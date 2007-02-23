/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Geometry/Curve.js
 */

OpenLayers.Geometry.LineString = OpenLayers.Class.create();
OpenLayers.Geometry.LineString.prototype =
    OpenLayers.Class.inherit(OpenLayers.Geometry.Curve, {

    /**
     * @returns the coordinates path as a string
     */
    toString: function() {
        return this.path.toString();
    },
    
    /**
     * @returns An exact clone of this OpenLayers.Feature
     * @type OpenLayers.Feature
     */
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Geometry.LineString();
        }
        
        for (var i = 0; i < this.path.length; i++) {
            obj.addPoint(this.path[i].clone());
        }
        
        return obj;
    },

    removePoint: function(point){
        if (this.path.length > 2) {
            OpenLayers.Geometry.Curve.prototype.removePoint.apply(this, arguments);
        }
    },
       
    CLASS_NAME: "OpenLayers.Geometry.LineString"
    
});
