/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/BaseTypes.js
 * @requires OpenLayers/Geometry.js
 */
OpenLayers.Geometry.Point = OpenLayers.Class.create();

OpenLayers.Geometry.Point.prototype =
    OpenLayers.Class.inherit(OpenLayers.LonLat, OpenLayers.Geometry, {

    /**
    * @constructor
    *
    * @param {float} x
    * @param {float} y
    */
    initialize: function(x, y) {
    	OpenLayers.LonLat.prototype.initialize.apply(this, arguments);
    	OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
    	this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    	this.x = this.lon;
    	this.y = this.lat;
    },

    /**
     * @returns An exact clone of this OpenLayers.Geometry.Point
     * @type OpenLayers.Geometry.Point
     */
    clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Geometry.Point(this.x, this.y);
        }

        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(obj, this);

        return obj;
    },

    /**
     * Sets the x coordinate
     *
     * @param {float} x
     */
    setX: function(x) {
    	this.lon = x;
    	this.x = x;
    },

    /**
     * Sets the y coordinate
     *
     * @param {float} y
     */
    setY: function(y) {
    	this.lat = y;
    	this.y = y;
    },

    /**
     * @returns float
     */
    getX: function() {
	   return this.lon;
    },

    /**
     * @returns float
     */
    getY: function() {
	   return this.lat;
    },

    /**
     * @returns the coordinates as a string
     */
    toString: function() {
	   return this.x + "," + this.y;
    },

    CLASS_NAME: "OpenLayers.Geometry.Point"
});
